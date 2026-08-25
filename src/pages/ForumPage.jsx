import { CheckCircle2, Flag, LockKeyhole, MessageSquare, Pin, Plus, Search, Send, Trash2, Unlock, User, X } from 'lucide-react';
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

  useEffect(() => authService.subscribe(setUser), []);
  useEffect(() => subscribeToAdminUsers(setAdminUsers, (error) => setStatus(error.message || 'Could not load admin state.')), []);
  useEffect(() => forumService.subscribeToThreads(setThreads, (error) => setStatus(error.message || 'Could not load forum topics.')), []);

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

  const categoryCounts = useMemo(() => threads.reduce((counts, thread) => ({
    ...counts,
    [thread.categoryId]: (counts[thread.categoryId] || 0) + 1,
  }), {}), [threads]);

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

  return (
    <section className="page-shell page-top forum-page">
      <div className="forum-shell">
        <header className="forum-header">
          <div>
            <p className="eyebrow">Community Forum</p>
            <h1>Forum</h1>
            <p>Ask questions, share strategies, collect guides, and keep long discussions outside the live chat.</p>
          </div>
          {user ? (
            <button className="forum-primary-action" type="button" onClick={() => { setIsCreating(true); setSelectedThreadId(''); }}>
              <Plus size={18} /> New topic
            </button>
          ) : (
            <Link className="forum-primary-action" to="/login"><User size={18} /> Sign in to post</Link>
          )}
        </header>

        <div className="forum-tools">
          <label className="forum-search" htmlFor="forum-search">
            <Search size={18} />
            <input id="forum-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topics, tags, players..." />
          </label>
          <button className={selectedCategory === 'all' ? 'is-active' : ''} type="button" onClick={() => setSelectedCategory('all')}>All <span>{threads.length}</span></button>
          {forumCategories.map((category) => (
            <button className={selectedCategory === category.id ? 'is-active' : ''} key={category.id} type="button" onClick={() => setSelectedCategory(category.id)}>
              {category.title} <span>{categoryCounts[category.id] || 0}</span>
            </button>
          ))}
        </div>

        {status ? <strong className="forum-status">{status}</strong> : null}

        <div className="forum-layout">
          <aside className="forum-thread-list" aria-label="Forum topics">
            {filteredThreads.length ? filteredThreads.map((thread) => {
              const category = forumCategories.find((item) => item.id === thread.categoryId);
              return (
                <button className={selectedThreadId === thread.id ? 'forum-thread-card is-active' : 'forum-thread-card'} key={thread.id} type="button" onClick={() => { setSelectedThreadId(thread.id); setIsCreating(false); }}>
                  <span className="forum-thread-flags">
                    {thread.pinned ? <Pin size={14} /> : null}
                    {thread.locked ? <LockKeyhole size={14} /> : null}
                    {thread.solved ? <CheckCircle2 size={14} /> : null}
                    <small>{category?.title || 'General'}</small>
                  </span>
                  <strong>{thread.title}</strong>
                  <AuthorBadge item={thread} />
                  <span className="forum-thread-meta">{thread.replyCount || 0} replies · Last by {thread.lastPostByName || thread.authorName || 'Player'}</span>
                  {thread.tags?.length ? <span className="forum-tags">{thread.tags.map((tag) => <i key={tag}>#{tag}</i>)}</span> : null}
                </button>
              );
            }) : <p className="forum-empty">No topics found.</p>}
          </aside>

          <main className="forum-topic-panel">
            {isCreating ? (
              <form className="forum-editor" onSubmit={handleCreateThread}>
                <div className="forum-panel-heading">
                  <div>
                    <p className="eyebrow">New Topic</p>
                    <h2>Create a forum topic</h2>
                  </div>
                  <button className="forum-icon-action" type="button" onClick={() => setIsCreating(false)} aria-label="Close editor"><X size={18} /></button>
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
                  <div>
                    <p className="eyebrow">{forumCategories.find((item) => item.id === selectedThread.categoryId)?.title || 'General'}</p>
                    <h2>{selectedThread.title}</h2>
                    <AuthorBadge item={selectedThread} />
                  </div>
                  <div className="forum-topic-actions">
                    <button type="button" onClick={() => handleThreadUpdate({ solved: !selectedThread.solved })} disabled={busy || !canEditSelectedThread}><CheckCircle2 size={15} /> {selectedThread.solved ? 'Unsolve' : 'Solved'}</button>
                    {isAdmin ? <button type="button" onClick={() => handleThreadUpdate({ pinned: !selectedThread.pinned })} disabled={busy}><Pin size={15} /> {selectedThread.pinned ? 'Unpin' : 'Pin'}</button> : null}
                    {isAdmin ? <button type="button" onClick={() => handleThreadUpdate({ locked: !selectedThread.locked })} disabled={busy}>{selectedThread.locked ? <Unlock size={15} /> : <LockKeyhole size={15} />} {selectedThread.locked ? 'Unlock' : 'Lock'}</button> : null}
                    {canEditSelectedThread ? <button className="is-danger" type="button" onClick={handleDeleteThread} disabled={busy}><Trash2 size={15} /> Delete</button> : null}
                    {user ? <button type="button" onClick={handleReportThread} disabled={busy}><Flag size={15} /> Report</button> : null}
                  </div>
                </header>

                <div className="forum-post-list">
                  {posts.length ? posts.map((post) => (
                    <article className={post.type === 'topic' ? 'forum-post is-topic' : 'forum-post'} key={post.id}>
                      <header>
                        <AuthorBadge item={post} />
                        <time>{formatForumDate(post.createdAt)}</time>
                      </header>
                      <p>{post.body}</p>
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
            ) : (
              <div className="forum-welcome-panel">
                <MessageSquare size={42} />
                <h2>Select a topic</h2>
                <p>Open an existing discussion or create a new topic to start a longer conversation.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}