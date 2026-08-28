import { CheckCircle2, Flag, LockKeyhole, MessageSquare, Pin, Plus, Search, Send, Settings, Trash2, Unlock, User, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../features/auth/authService.js';
import { forumCategories, forumService } from '../features/forum/forumService.js';
import { subscribeToAdminUsers } from '../services/adminAccess.js';

const formatForumDate = (value) => {
  const date = value?.toDate?.() || null;
  if (!date) return '';
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getInitial = (name) => String(name || 'P').trim().slice(0, 1).toUpperCase();
const readCookie = (name) => document.cookie
  .split('; ')
  .find((cookie) => cookie.startsWith(`${name}=`))
  ?.split('=')[1] || '';

const readStoredLanguage = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return '';
  const storedLanguage = String(window.localStorage.getItem('tiles-survive-language') || '').trim().toLowerCase();
  if (storedLanguage) return storedLanguage;
  const rawCookie = readCookie('googtrans');
  return rawCookie ? decodeURIComponent(rawCookie).split('/').filter(Boolean).pop()?.toLowerCase() || '' : '';
};

const getAuthorLine = (item) => {
  const parts = [];
  if (item.authorServer) parts.push(`#${item.authorServer}`);
  if (item.authorAllianceTag) parts.push(`[${item.authorAllianceTag}]`);
  parts.push(item.authorName || 'Player');
  return parts.join(' ');
};

function AuthorBadge({ item }) {
  return (
    <span className="forum-author" translate="no">
      <span className={item.authorPhotoURL ? 'forum-avatar has-photo' : 'forum-avatar'}>
        {item.authorPhotoURL ? <img src={item.authorPhotoURL} alt="" /> : getInitial(item.authorName)}
      </span>
      <span>{getAuthorLine(item)}</span>
    </span>
  );
}

function ForumThreadRow({ thread, category, isActive, onOpen, title }) {
  return (
    <button className={isActive ? 'forum-board-row is-active' : 'forum-board-row'} type="button" onClick={onOpen}>
      <span className="forum-board-icon"><MessageSquare size={18} /></span>
      <span className="forum-board-main">
        <span className="forum-board-title-line">
          {thread.pinned ? <Pin size={14} /> : null}
          {thread.locked ? <LockKeyhole size={14} /> : null}
          {thread.solved ? <CheckCircle2 size={14} /> : null}
          <strong translate="no">{title || thread.title}</strong>
        </span>
        <span className="forum-board-subline">
          <span>{category?.title || 'General'}</span>
          <AuthorBadge item={thread} />
          {thread.tags?.length ? <span className="forum-tags">{thread.tags.slice(0, 3).map((tag) => <i key={tag}>#{tag}</i>)}</span> : null}
        </span>
      </span>
      <span className="forum-board-stat"><strong>{thread.replyCount || 0}</strong><small>Replies</small></span>
      <span className="forum-board-stat"><strong>{thread.viewCount || 0}</strong><small>Views</small></span>
      <span className="forum-board-last">
        <small>Last post</small>
        <strong translate="no">{thread.lastPostByName || thread.authorName || 'Player'}</strong>
        <time>{formatForumDate(thread.lastPostAt || thread.createdAt)}</time>
      </span>
    </button>
  );
}

export default function ForumPage() {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [adminUsers, setAdminUsers] = useState([]);
  const [threads, setThreads] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedThreadId, setSelectedThreadId] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newThread, setNewThread] = useState({ categoryId: 'general', title: '', tags: '', body: '' });
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);
  const [forumActionsOpen, setForumActionsOpen] = useState(false);
  const [forumLanguage, setForumLanguage] = useState(() => readStoredLanguage() || 'en');
  const [translatedForumContent, setTranslatedForumContent] = useState({});

  useEffect(() => authService.subscribe(setUser), []);
  useEffect(() => subscribeToAdminUsers(setAdminUsers, (error) => setStatus(error.message || 'Could not load admin state.')), []);
  useEffect(() => forumService.subscribeToThreads(setThreads, (error) => setStatus(error.message || 'Could not load forum topics.')), []);
  useEffect(() => {
    setForumActionsOpen(false);
  }, [selectedThreadId, isCreating]);
  useEffect(() => {
    const syncForumLanguage = () => setForumLanguage(readStoredLanguage() || 'en');
    syncForumLanguage();
    window.addEventListener('tiles-survive-translation-change', syncForumLanguage);
    const intervalId = window.setInterval(syncForumLanguage, 1200);
    return () => {
      window.removeEventListener('tiles-survive-translation-change', syncForumLanguage);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!user || !forumLanguage || forumLanguage === 'en') return undefined;
    let isMounted = true;
    const requests = [];

    threads.slice(0, 24).forEach((thread) => {
      const key = `thread:${thread.id}:title:${forumLanguage}`;
      if (thread.id && thread.title && !thread.translations?.[forumLanguage]?.title && !translatedForumContent[key]) {
        requests.push({ key, threadId: thread.id, field: 'title', fallback: thread.title });
      }
    });

    posts.slice(0, 24).forEach((post) => {
      const key = `post:${selectedThreadId}:${post.id}:body:${forumLanguage}`;
      if (selectedThreadId && post.id && post.body && !post.translations?.[forumLanguage]?.body && !translatedForumContent[key]) {
        requests.push({ key, threadId: selectedThreadId, postId: post.id, field: 'body', fallback: post.body });
      }
    });

    requests.slice(0, 12).forEach((item) => {
      forumService.translateContent({
        threadId: item.threadId,
        postId: item.postId || '',
        field: item.field,
        targetLanguage: forumLanguage,
      })
        .then((translatedText) => {
          if (!isMounted || !translatedText) return;
          setTranslatedForumContent((current) => ({ ...current, [item.key]: translatedText }));
        })
        .catch(() => {
          if (!isMounted) return;
          setTranslatedForumContent((current) => ({ ...current, [item.key]: item.fallback }));
        });
    });

    return () => {
      isMounted = false;
    };
  }, [forumLanguage, posts, selectedThreadId, threads, translatedForumContent, user]);

  const selectedThread = threads.find((thread) => thread.id === selectedThreadId) || null;
  const isAdmin = forumService.canModerate(user, adminUsers);
  const canEditSelectedThread = forumService.canEditThread(selectedThread, user, adminUsers);
  const canReplySelectedThread = forumService.canReplyThread(selectedThread, user);

  useEffect(() => {
    if (!selectedThreadId) {
      setPosts([]);
      return undefined;
    }

    return forumService.subscribeToPosts(
      selectedThreadId,
      (items) => {
        setPosts(items);
        setStatus('');
      },
      (error) => setStatus(error.message || 'Could not load replies.'),
    );
  }, [selectedThreadId]);

  const filteredThreads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return threads
      .filter((thread) => selectedCategory === 'all' || thread.categoryId === selectedCategory)
      .filter((thread) => {
        if (!query) return true;
        return [thread.title, thread.authorName, thread.authorServer, thread.authorAllianceTag, ...(thread.tags || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);
      })
      .sort((first, second) => {
        if (first.pinned !== second.pinned) return first.pinned ? -1 : 1;
        return (second.lastPostAt?.toMillis?.() || 0) - (first.lastPostAt?.toMillis?.() || 0);
      });
  }, [search, selectedCategory, threads]);

  const groupedThreads = useMemo(() => forumCategories
    .map((category) => ({
      ...category,
      threads: filteredThreads.filter((thread) => thread.categoryId === category.id),
    }))
    .filter((category) => selectedCategory !== 'all' || category.threads.length || !search.trim()), [filteredThreads, search, selectedCategory]);

  const categoryCounts = useMemo(() => threads.reduce((counts, thread) => ({
    ...counts,
    [thread.categoryId]: (counts[thread.categoryId] || 0) + 1,
  }), {}), [threads]);

  
  const getThreadTitle = (thread) => {
    if (!thread) return '';
    if (!forumLanguage || forumLanguage === 'en') return thread.title;
    return thread.translations?.[forumLanguage]?.title
      || translatedForumContent[`thread:${thread.id}:title:${forumLanguage}`]
      || thread.title;
  };

  const getPostBody = (post) => {
    if (!post) return '';
    if (!forumLanguage || forumLanguage === 'en') return post.body;
    return post.translations?.[forumLanguage]?.body
      || translatedForumContent[`post:${selectedThreadId}:${post.id}:body:${forumLanguage}`]
      || post.body;
  };

  const handleCreateThread = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus('');

    try {
      const threadId = await forumService.createThread(newThread);
      setSelectedThreadId(threadId);
      setIsCreating(false);
      setNewThread({ categoryId: 'general', title: '', tags: '', body: '' });
    } catch (error) {
      setStatus(error.message || 'Topic could not be created.');
    } finally {
      setBusy(false);
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus('');

    try {
      await forumService.addReply(selectedThreadId, reply);
      setReply('');
    } catch (error) {
      setStatus(error.message || 'Reply could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  const handleThreadUpdate = async (partial) => {
    if (!selectedThread) return;
    setBusy(true);
    setStatus('');

    try {
      await forumService.updateThread(selectedThread.id, partial, adminUsers);
    } catch (error) {
      setStatus(error.message || 'Topic could not be updated.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!selectedThread || !window.confirm('Delete this topic?')) return;
    setBusy(true);
    setStatus('');

    try {
      await forumService.deleteThread(selectedThread.id, adminUsers);
      setSelectedThreadId('');
    } catch (error) {
      setStatus(error.message || 'Topic could not be deleted.');
    } finally {
      setBusy(false);
    }
  };

  const handleReportThread = async () => {
    if (!selectedThread) return;
    setBusy(true);
    setStatus('');

    try {
      await forumService.reportThread(selectedThread.id);
      setStatus('Topic reported to the moderation queue.');
    } catch (error) {
      setStatus(error.message || 'Report could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  const openBoard = () => {
    setSelectedThreadId('');
    setIsCreating(false);
    setForumActionsOpen(false);
  };

  return (
    <section className="page-shell page-top forum-page">
      <div className="forum-shell">
        {!isCreating && !selectedThread ? (
          <div className="forum-board-tools">
            <label className="forum-search" htmlFor="forum-search">
              <Search size={18} />
              <input id="forum-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topics, tags, players..." />
            </label>
            <button className={selectedCategory === 'all' ? 'is-active' : ''} type="button" onClick={() => { setSelectedCategory('all'); openBoard(); }}>All <span>{threads.length}</span></button>
            {forumCategories.map((category) => (
              <button className={selectedCategory === category.id ? 'is-active' : ''} key={category.id} type="button" onClick={() => { setSelectedCategory(category.id); openBoard(); }}>
                {category.title} <span>{categoryCounts[category.id] || 0}</span>
              </button>
            ))}
            {user ? (
              <button className="forum-primary-action" type="button" onClick={() => { setForumActionsOpen(false); setIsCreating(true); setSelectedThreadId(''); }}>
                <Plus size={18} /> New topic
              </button>
            ) : (
              <Link className="forum-primary-action" to="/login"><User size={18} /> Sign in</Link>
            )}
          </div>
        ) : null}

        {status ? <strong className="forum-status">{status}</strong> : null}

        {!isCreating && !selectedThread ? (
          <div className="forum-board-overview">
            <div className="forum-board-column-head"><span>Forum</span><span>Replies</span><span>Views</span><span>Last post</span></div>
            {groupedThreads.length ? groupedThreads.map((category) => {
              const replyTotal = category.threads.reduce((total, thread) => total + (thread.replyCount || 0), 0);
              const latest = category.threads[0] || null;
              return (
                <section className="forum-category-section" key={category.id}>
                  <header className="forum-category-header">
                    <div>
                      <h2>{category.title}</h2>
                      <p>{category.description}</p>
                    </div>
                    <div className="forum-category-stats">
                      <span><strong>{category.threads.length}</strong> Topics</span>
                      <span><strong>{replyTotal}</strong> Replies</span>
                    </div>
                  </header>
                  <div className="forum-category-rows">
                    {category.threads.length ? category.threads.slice(0, 8).map((thread) => (
                      <ForumThreadRow
                        category={category}
                        isActive={selectedThreadId === thread.id}
                        key={thread.id}
                        onOpen={() => { setForumActionsOpen(false); setSelectedThreadId(thread.id); setIsCreating(false); }}
                        thread={thread}
                        title={getThreadTitle(thread)}
                      />
                    )) : (
                      <div className="forum-board-empty">
                        <MessageSquare size={18} />
                        <span>No topics yet.</span>
                        {user ? <button type="button" onClick={() => { setForumActionsOpen(false); setNewThread((current) => ({ ...current, categoryId: category.id })); setIsCreating(true); }}>Start one</button> : null}
                      </div>
                    )}
                  </div>
                  {latest ? (
                    <footer className="forum-category-footer">
                      Latest: <strong translate="no">{getThreadTitle(latest)}</strong> by <span translate="no">{latest.lastPostByName || latest.authorName || 'Player'}</span>
                    </footer>
                  ) : null}
                </section>
              );
            }) : <p className="forum-empty">No topics found.</p>}
          </div>
        ) : (
          <main className="forum-topic-panel forum-topic-full">
            {isCreating ? (
              <form className="forum-editor" onSubmit={handleCreateThread}>
                <div className="forum-panel-heading">
                  <div>
                    <p className="eyebrow">New Topic</p>
                    <h2>Create a forum topic</h2>
                  </div>
                  <button className="forum-icon-action" type="button" onClick={openBoard} aria-label="Close editor"><X size={18} /></button>
                </div>
                <label>Category</label>
                <select value={newThread.categoryId} onChange={(event) => setNewThread((current) => ({ ...current, categoryId: event.target.value }))}>
                  {forumCategories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
                </select>
                <label>Title</label>
                <input value={newThread.title} onChange={(event) => setNewThread((current) => ({ ...current, title: event.target.value }))} placeholder="What should the topic be called?" maxLength={110} />
                <label>Tags</label>
                <input value={newThread.tags} onChange={(event) => setNewThread((current) => ({ ...current, tags: event.target.value }))} placeholder="arena, heroes, event" maxLength={140} />
                <label>First post</label>
                <textarea value={newThread.body} onChange={(event) => setNewThread((current) => ({ ...current, body: event.target.value }))} placeholder="Write the full question, guide, idea, or discussion start..." rows={8} maxLength={5000} />
                <button className="forum-primary-action" type="submit" disabled={busy}><Plus size={18} /> {busy ? 'Creating...' : 'Create topic'}</button>
              </form>
            ) : selectedThread ? (
              <>
                <header className="forum-panel-heading">
                  <button className="forum-back-action" type="button" onClick={openBoard}>Back to forum</button>
                  <div>
                    <p className="eyebrow">{forumCategories.find((item) => item.id === selectedThread.categoryId)?.title || 'General'}</p>
                    <h2 translate="no">{getThreadTitle(selectedThread)}</h2>
                    <AuthorBadge item={selectedThread} />
                  </div>
                  <div className="forum-topic-settings">
                    <button className={forumActionsOpen ? 'forum-settings-toggle is-active' : 'forum-settings-toggle'} type="button" onClick={() => setForumActionsOpen((current) => !current)} aria-expanded={forumActionsOpen}>
                      <Settings size={15} /> Settings
                    </button>
                    {forumActionsOpen ? (
                      <div className="forum-topic-actions">
                        <button type="button" onClick={() => handleThreadUpdate({ solved: !selectedThread.solved })} disabled={busy || !canEditSelectedThread}><CheckCircle2 size={15} /> {selectedThread.solved ? 'Unsolve' : 'Solved'}</button>
                        {isAdmin ? <button type="button" onClick={() => handleThreadUpdate({ pinned: !selectedThread.pinned })} disabled={busy}><Pin size={15} /> {selectedThread.pinned ? 'Unpin' : 'Pin'}</button> : null}
                        {isAdmin ? <button type="button" onClick={() => handleThreadUpdate({ locked: !selectedThread.locked })} disabled={busy}>{selectedThread.locked ? <Unlock size={15} /> : <LockKeyhole size={15} />} {selectedThread.locked ? 'Unlock' : 'Lock'}</button> : null}
                        {canEditSelectedThread ? <button className="is-danger" type="button" onClick={handleDeleteThread} disabled={busy}><Trash2 size={15} /> Delete</button> : null}
                        {user ? <button type="button" onClick={handleReportThread} disabled={busy}><Flag size={15} /> Report</button> : null}
                      </div>
                    ) : null}
                  </div>
                </header>

                <div className="forum-post-list">
                  {posts.length ? posts.map((post) => (
                    <article className={post.type === 'topic' ? 'forum-post is-topic' : 'forum-post'} key={post.id}>
                      <header>
                        <AuthorBadge item={post} />
                        <time>{formatForumDate(post.createdAt)}</time>
                      </header>
                      <p translate="no">{getPostBody(post)}</p>
                    </article>
                  )) : <p className="forum-empty">No posts loaded yet.</p>}
                </div>

                {canReplySelectedThread ? (
                  <form className="forum-reply" onSubmit={handleReply}>
                    <textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." rows={4} maxLength={5000} />
                    <button className="forum-primary-action" type="submit" disabled={busy || !reply.trim()}><Send size={17} /> {busy ? 'Sending...' : 'Reply'}</button>
                  </form>
                ) : selectedThread.locked ? (
                  <div className="forum-locked-note"><LockKeyhole size={17} /> This topic is locked.</div>
                ) : (
                  <Link className="forum-primary-action" to="/login"><User size={17} /> Sign in to reply</Link>
                )}
              </>
            ) : null}
          </main>
        )}
      </div>
    </section>
  );
}








