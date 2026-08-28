import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions, isFirebaseConfigured } from '../../services/firebase.js';
import { authService } from '../auth/authService.js';

const threadsRef = collection(db, 'forumThreads');

export const forumCategories = [
  { id: 'general', title: 'General', description: 'Open discussion, player questions, and community talk.' },
  { id: 'guides', title: 'Guides', description: 'Strategies, tips, and step-by-step help.' },
  { id: 'heroes', title: 'Heroes', description: 'Hero builds, teams, counters, and investment advice.' },
  { id: 'alliance', title: 'Alliance', description: 'Alliance organization, events, diplomacy, and recruiting.' },
  { id: 'events', title: 'Events', description: 'Event planning, rankings, rewards, and timing.' },
  { id: 'support', title: 'Support', description: 'Bug reports, account help, and website feedback.' },
];

const normalizeText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const normalizeLanguageCode = (languageCode) => String(languageCode || '').trim().toLowerCase().replace(/[^a-z-]/g, '').split('-')[0].slice(0, 8) || 'en';
const normalizeCategory = (categoryId) => forumCategories.some((category) => category.id === categoryId) ? categoryId : 'general';
const normalizeTags = (tags) => String(tags || '')
  .split(',')
  .map((tag) => tag.trim().replace(/^#/, '').slice(0, 22))
  .filter(Boolean)
  .slice(0, 5);

const buildAuthor = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sign in before using the forum.');
  }

  const profile = await authService.getCurrentUserProfile().catch(() => ({}));
  return {
    uid: user.uid,
    displayName: normalizeText(profile.displayName || user.displayName || 'Player', 48),
    photoURL: profile.photoURL || user.photoURL || '',
    gameServer: profile.gameServer || '',
    allianceTag: profile.allianceTag || '',
  };
};

const canModerate = (user, adminUsers = []) => {
  if (!user) return false;
  const email = String(user.email || '').trim().toLowerCase();
  return adminUsers.some((entry) => entry.id === user.uid || entry.id === email || entry.email === email || entry.uid === user.uid);
};

const canEditThread = (thread, user, adminUsers = []) => Boolean(user?.uid && (thread?.authorUid === user.uid || canModerate(user, adminUsers)));
const canReplyThread = (thread, user) => Boolean(user?.uid && thread?.locked !== true);

export const forumService = {
  categories: forumCategories,
  normalizeCategory,
  canModerate,
  canEditThread,
  canReplyThread,

  subscribeToThreads(onData, onError) {
    if (typeof window === 'undefined' || !isFirebaseConfigured()) {
      onData([]);
      return () => {};
    }

    return onSnapshot(
      query(threadsRef, orderBy('lastPostAt', 'desc'), limit(150)),
      (snapshot) => {
        onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      },
      (error) => onError?.(error),
    );
  },

  subscribeToPosts(threadId, onData, onError) {
    if (typeof window === 'undefined' || !isFirebaseConfigured() || !threadId) {
      onData([]);
      return () => {};
    }

    return onSnapshot(
      query(collection(db, 'forumThreads', threadId, 'posts'), orderBy('createdAt', 'asc'), limit(300)),
      (snapshot) => {
        onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      },
      (error) => onError?.(error),
    );
  },

  async createThread({ categoryId, title, body, tags }) {
    const author = await buildAuthor();
    const cleanTitle = normalizeText(title, 110);
    const cleanBody = normalizeText(body, 5000);

    if (!cleanTitle) throw new Error('Enter a topic title.');
    if (cleanBody.length < 10) throw new Error('Write at least 10 characters for the first post.');

    const threadDoc = await addDoc(threadsRef, {
      categoryId: normalizeCategory(categoryId),
      title: cleanTitle,
      tags: normalizeTags(tags),
      authorUid: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      authorServer: author.gameServer,
      authorAllianceTag: author.allianceTag,
      replyCount: 0,
      viewCount: 0,
      pinned: false,
      locked: false,
      solved: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastPostAt: serverTimestamp(),
      lastPostByName: author.displayName,
    });

    await addDoc(collection(db, 'forumThreads', threadDoc.id, 'posts'), {
      type: 'topic',
      body: cleanBody,
      authorUid: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      authorServer: author.gameServer,
      authorAllianceTag: author.allianceTag,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return threadDoc.id;
  },

  async addReply(threadId, body) {
    const author = await buildAuthor();
    const cleanBody = normalizeText(body, 5000);
    if (!threadId) throw new Error('Open a topic first.');
    if (cleanBody.length < 2) throw new Error('Write a reply first.');

    const threadSnapshot = await getDoc(doc(db, 'forumThreads', threadId));
    if (!threadSnapshot.exists()) throw new Error('Topic not found.');
    const thread = { id: threadSnapshot.id, ...threadSnapshot.data() };
    if (thread.locked) throw new Error('This topic is locked.');

    await addDoc(collection(db, 'forumThreads', threadId, 'posts'), {
      type: 'reply',
      body: cleanBody,
      authorUid: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      authorServer: author.gameServer,
      authorAllianceTag: author.allianceTag,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'forumThreads', threadId), {
      replyCount: increment(1),
      lastPostAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastPostByName: author.displayName,
    });
  },

  async updateThread(threadId, partial, adminUsers = []) {
    const user = auth.currentUser;
    const threadSnapshot = await getDoc(doc(db, 'forumThreads', threadId));
    if (!threadSnapshot.exists()) throw new Error('Topic not found.');
    const thread = { id: threadSnapshot.id, ...threadSnapshot.data() };
    if (!canEditThread(thread, user, adminUsers)) throw new Error('You are not allowed to edit this topic.');

    const next = {};
    if (partial.title !== undefined) next.title = normalizeText(partial.title, 110) || thread.title;
    if (partial.categoryId !== undefined) next.categoryId = normalizeCategory(partial.categoryId);
    if (partial.tags !== undefined) next.tags = Array.isArray(partial.tags) ? partial.tags.slice(0, 5) : normalizeTags(partial.tags);
    if (partial.solved !== undefined) next.solved = partial.solved === true;
    if (partial.locked !== undefined) {
      if (!canModerate(user, adminUsers)) throw new Error('Only admins can lock topics.');
      next.locked = partial.locked === true;
    }
    if (partial.pinned !== undefined) {
      if (!canModerate(user, adminUsers)) throw new Error('Only admins can pin topics.');
      next.pinned = partial.pinned === true;
    }

    await updateDoc(doc(db, 'forumThreads', threadId), {
      ...next,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteThread(threadId, adminUsers = []) {
    const user = auth.currentUser;
    const threadSnapshot = await getDoc(doc(db, 'forumThreads', threadId));
    if (!threadSnapshot.exists()) return;
    const thread = { id: threadSnapshot.id, ...threadSnapshot.data() };
    if (!canEditThread(thread, user, adminUsers)) throw new Error('You are not allowed to delete this topic.');
    await deleteDoc(doc(db, 'forumThreads', threadId));
  },


  async translateContent({ threadId, postId = '', field, targetLanguage }) {
    if (!auth.currentUser) {
      throw new Error('Sign in before translating forum content.');
    }

    const language = normalizeLanguageCode(targetLanguage);
    if (!threadId || !field || !language || language === 'en') {
      return null;
    }

    const translateForumContent = httpsCallable(functions, 'translateForumContent');
    const result = await translateForumContent({ threadId, postId, field, targetLanguage: language });
    return result.data?.translatedText || null;
  },
  async reportThread(threadId, reason = '') {
    const author = await buildAuthor();
    if (!threadId) return;
    await addDoc(collection(db, 'forumReports'), {
      threadId,
      reason: normalizeText(reason || 'Needs moderator review', 400),
      reporterUid: author.uid,
      reporterName: author.displayName,
      createdAt: serverTimestamp(),
      status: 'open',
    });
  },
};