import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase.js';
import { savePublicProfile } from './profileDirectory.js';

const friendRequestsRef = collection(db, 'friendRequests');

const normalizeProfile = (profile = {}) => ({
  uid: String(profile.uid || '').trim(),
  displayName: String(profile.displayName || 'Player').trim().slice(0, 40),
  gameServer: String(profile.gameServer || '').replace(/\D/g, '').slice(0, 6),
  allianceTag: String(profile.allianceTag || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8),
  photoURL: String(profile.photoURL || '').trim(),
});

const formatUserLabel = (profile = {}) => {
  const normalized = normalizeProfile(profile);
  const server = normalized.gameServer ? `#${normalized.gameServer}` : '';
  const alliance = normalized.allianceTag ? `[${normalized.allianceTag}]` : '';
  return [server, alliance, normalized.displayName].filter(Boolean).join(' ');
};

const requestIdFor = (fromUid, toUid) => `${fromUid}_${toUid}`;
const friendshipIdFor = (firstUid, secondUid) => [firstUid, secondUid].sort().join('_');

const getCurrentProfile = () => normalizeProfile({
  uid: auth.currentUser?.uid,
  displayName: auth.currentUser?.displayName || auth.currentUser?.email || 'Player',
  photoURL: auth.currentUser?.photoURL || '',
});

const sortRequests = (requests) => [...requests].sort((first, second) => {
  const firstTime = first.updatedAt?.toMillis?.() || first.createdAt?.toMillis?.() || 0;
  const secondTime = second.updatedAt?.toMillis?.() || second.createdAt?.toMillis?.() || 0;
  return secondTime - firstTime;
});

export const friendService = {
  async sendFriendRequest(targetProfile) {
    if (!auth.currentUser?.uid || !isFirebaseConfigured()) {
      throw new Error('Please sign in first.');
    }

    const fromProfile = getCurrentProfile();
    const toProfile = normalizeProfile(targetProfile);

    if (!toProfile.uid) {
      throw new Error('User profile not found.');
    }

    if (fromProfile.uid === toProfile.uid) {
      throw new Error('You cannot send a friend request to yourself.');
    }

    await savePublicProfile(fromProfile);
    const directRequestRef = doc(db, 'friendRequests', requestIdFor(fromProfile.uid, toProfile.uid));
    const reverseRequestRef = doc(db, 'friendRequests', requestIdFor(toProfile.uid, fromProfile.uid));
    const friendshipRef = doc(db, 'friendships', friendshipIdFor(fromProfile.uid, toProfile.uid));
    const [directRequest, reverseRequest, friendship] = await Promise.all([
      getDoc(directRequestRef),
      getDoc(reverseRequestRef),
      getDoc(friendshipRef),
    ]);

    if (friendship.exists()) {
      throw new Error('You are already friends.');
    }

    if (directRequest.exists() && directRequest.data()?.status === 'pending') {
      throw new Error('Friend request already sent.');
    }

    if (reverseRequest.exists() && reverseRequest.data()?.status === 'pending') {
      throw new Error('This user already sent you a friend request. Accept it on your profile page.');
    }

    await setDoc(directRequestRef, {
      fromUid: fromProfile.uid,
      toUid: toProfile.uid,
      fromProfile,
      toProfile,
      fromLabel: formatUserLabel(fromProfile),
      toLabel: formatUserLabel(toProfile),
      participants: [fromProfile.uid, toProfile.uid],
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  subscribeFriendRequests(uid, onData, onError) {
    if (typeof window === 'undefined' || !uid || !isFirebaseConfigured()) {
      onData({ incoming: [], outgoing: [], friends: [] });
      return () => {};
    }

    let incoming = [];
    let outgoing = [];
    let friendships = [];

    const emit = () => onData({
      incoming: sortRequests(incoming),
      outgoing: sortRequests(outgoing),
      friends: sortRequests(friendships),
    });

    const unsubscribeIncoming = onSnapshot(
      query(friendRequestsRef, where('toUid', '==', uid)),
      (snapshot) => {
        incoming = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        emit();
      },
      (error) => onError?.(error),
    );

    const unsubscribeOutgoing = onSnapshot(
      query(friendRequestsRef, where('fromUid', '==', uid)),
      (snapshot) => {
        outgoing = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        emit();
      },
      (error) => onError?.(error),
    );

    const unsubscribeFriendships = onSnapshot(
      query(collection(db, 'friendships'), where('participants', 'array-contains', uid)),
      (snapshot) => {
        friendships = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        emit();
      },
      (error) => onError?.(error),
    );

    return () => {
      unsubscribeIncoming();
      unsubscribeOutgoing();
      unsubscribeFriendships();
    };
  },

  async acceptFriendRequest(request) {
    if (!auth.currentUser?.uid || request?.toUid !== auth.currentUser.uid) {
      throw new Error('You can only accept requests sent to you.');
    }

    const requestRef = doc(db, 'friendRequests', request.id);
    const friendshipRef = doc(db, 'friendships', friendshipIdFor(request.fromUid, request.toUid));

    await setDoc(friendshipRef, {
      participants: [request.fromUid, request.toUid],
      memberProfiles: {
        [request.fromUid]: normalizeProfile(request.fromProfile),
        [request.toUid]: normalizeProfile(request.toProfile),
      },
      memberLabels: {
        [request.fromUid]: request.fromLabel || formatUserLabel(request.fromProfile),
        [request.toUid]: request.toLabel || formatUserLabel(request.toProfile),
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    await updateDoc(requestRef, {
      status: 'accepted',
      updatedAt: serverTimestamp(),
    });
  },

  async declineFriendRequest(request) {
    if (!auth.currentUser?.uid || request?.toUid !== auth.currentUser.uid) {
      throw new Error('You can only decline requests sent to you.');
    }

    await updateDoc(doc(db, 'friendRequests', request.id), {
      status: 'declined',
      updatedAt: serverTimestamp(),
    });
  },

  async cancelFriendRequest(request) {
    if (!auth.currentUser?.uid || request?.fromUid !== auth.currentUser.uid) {
      throw new Error('You can only cancel your own requests.');
    }

    await deleteDoc(doc(db, 'friendRequests', request.id));
  },
};
