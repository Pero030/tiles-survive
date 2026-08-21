import { FileText, Hammer, Image, Lock, LogOut, MessageCircle, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { formatChatRoomType, subscribeToAllChatRooms, subscribeToChatRoomMessages } from '../services/chatMonitor.js';
import { addAdminEmail, removeAdminEmail, subscribeToAdminAccess } from '../services/adminAccess.js';
import { signInAdmin, signOutAdmin, subscribeToAdminAuth } from '../services/adminAuth.js';
import { subscribeToWebsiteUsers } from '../services/websiteUsers.js';

const ContentBuilder = lazy(() => import('../features/admin/ContentBuilder.jsx').then((module) => ({ default: module.ContentBuilder })));

const adminModules = [
  {
    icon: FileText,
    title: 'Patch Notes',
    text: 'Prepare patch entries, version notes, and release highlights before they go live.',
  },
  {
    icon: ShieldCheck,
    title: 'Hero Database',
    text: 'Manage hero tiers, roles, positions, strengths, weaknesses, and detail pages.',
  },
  {
    icon: Image,
    title: 'Media Library',
    text: 'Manage hero portraits, patch images, flags, and guide screenshots through Firebase/R2.',
  },
  {
    icon: Users,
    title: 'Community Tools',
    text: 'Prepared for future accounts, favorites, comments, and moderation workflows.',
  },
];

const initialAuthState = {
  loading: true,
  authenticated: false,
  allowed: false,
  user: null,
  adminRecord: null,
};


const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatUserDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleString('en') : 'Not recorded yet';
};

const formatChatDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleString('en') : 'No activity yet';
};

const isRecentlyActive = (value) => {
  const date = toDate(value);
  return Boolean(date && Date.now() - date.getTime() < 2 * 60 * 1000);
};

function WebsiteUsersPanel({ currentEmail }) {
  const [users, setUsers] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);
  const [status, setStatus] = useState('');
  const [busyEmail, setBusyEmail] = useState('');

  useEffect(() => {
    const unsubscribeUsers = subscribeToWebsiteUsers(
      (items) => {
        setUsers(items);
        setStatus('');
      },
      (error) => setStatus(error.message || 'Could not load website users.'),
    );

    const unsubscribeAccess = subscribeToAdminAccess(
      (data) => setAdminEmails(data.emails || []),
      (error) => setStatus(error.message || 'Could not load admin emails.'),
    );

    return () => {
      unsubscribeUsers();
      unsubscribeAccess();
    };
  }, []);

  const handleMakeAdmin = async (email) => {
    setBusyEmail(email);
    setStatus('');

    try {
      await addAdminEmail(email);
      setStatus(`${email} is now an admin.`);
    } catch (error) {
      setStatus(error.message || 'Could not make this user an admin.');
    } finally {
      setBusyEmail('');
    }
  };

  return (
    <section className="admin-access-panel website-users-panel">
      <div className="admin-access-heading">
        <span><Users size={22} /></span>
        <div>
          <h2>Website Users</h2>
          <p>Users are saved here when they sign in anywhere on the website.</p>
        </div>
      </div>

      {status ? <strong className="admin-access-status">{status}</strong> : null}

      <div className="website-users-list">
        {users.length ? users.map((user) => {
          const email = String(user.email || '').toLowerCase();
          const isAdmin = adminEmails.includes(email);
          const activeNow = user.online && isRecentlyActive(user.lastSeenAt);

          return (
            <article className="website-user-row" key={user.uid || user.id} translate="no">
              <div className="website-user-main">
                <strong>{email || 'No email saved'}</strong>
                <span>UID: {user.uid || user.id}</span>
              </div>
              <div className="website-user-meta">
                <span className={activeNow ? 'user-status-online' : 'user-status-offline'}>{activeNow ? 'Online' : 'Offline'}</span>
                <span>Last seen: {formatUserDate(user.lastSeenAt)}</span>
                <span>Server: {user.gameServer ? `#${user.gameServer}` : 'Not set'}</span>
                <span>Alliance: {user.allianceName ? `${user.allianceTag ? `[${user.allianceTag}] ` : ''}${user.allianceName}` : 'Not set'}</span>
                <span>{isAdmin ? 'Admin' : 'User'}</span>
              </div>
              <button type="button" onClick={() => handleMakeAdmin(email)} disabled={!email || isAdmin || busyEmail === email || email === currentEmail}>
                <UserPlus size={17} /> {isAdmin ? 'Admin' : 'Make Admin'}
              </button>
            </article>
          );
        }) : <p className="admin-access-empty">No website users have signed in yet.</p>}
      </div>
    </section>
  );
}

function ChatMonitorPanel() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => subscribeToAllChatRooms(
    (items) => {
      setRooms(items);
      setStatus('');
      setSelectedRoomId((current) => current || items[0]?.id || '');
    },
    (error) => setStatus(error.message || 'Could not load chat rooms.'),
  ), []);

  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      return undefined;
    }

    return subscribeToChatRoomMessages(
      selectedRoomId,
      (items) => {
        setMessages(items);
        setStatus('');
      },
      (error) => setStatus(error.message || 'Could not load chat messages.'),
    );
  }, [selectedRoomId]);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || null;

  const getRoomTitle = (room) => room?.title || (room?.type === 'global' ? 'Global' : 'Unnamed chat');

  const getParticipantCount = (room) => room?.memberCount || Object.keys(room?.memberUids || {}).length || (room?.type === 'global' ? 'All users' : 0);

  return (
    <section className="admin-access-panel chat-monitor-panel">
      <div className="admin-access-heading">
        <span><MessageCircle size={22} /></span>
        <div>
          <h2>Chat Monitor</h2>
          <p>Read global, alliance, sub, and private chats for moderation and support.</p>
        </div>
      </div>

      {status ? <strong className="admin-access-status">{status}</strong> : null}

      <div className="chat-monitor-layout">
        <div className="chat-monitor-room-list">
          {rooms.length ? rooms.map((room) => (
            <button className={room.id === selectedRoomId ? 'is-active' : ''} key={room.id} type="button" onClick={() => setSelectedRoomId(room.id)}>
              <strong>{getRoomTitle(room)}</strong>
              <span>{formatChatRoomType(room.type)} · {getParticipantCount(room)} members</span>
              <small>{formatChatDate(room.lastMessageAt || room.updatedAt)}</small>
            </button>
          )) : <p className="admin-access-empty">No chat rooms found.</p>}
        </div>

        <div className="chat-monitor-message-panel">
          {selectedRoom ? (
            <header>
              <div>
                <strong>{getRoomTitle(selectedRoom)}</strong>
                <span>{formatChatRoomType(selectedRoom.type)} · ID: {selectedRoom.id}</span>
              </div>
              <small>{messages.length} messages shown</small>
            </header>
          ) : null}

          <div className="chat-monitor-messages">
            {messages.length ? messages.map((message) => (
              <article className={message.type === 'system' ? 'is-system' : ''} key={message.id}>
                <header>
                  <strong>{message.type === 'system' ? 'System' : message.senderLabel || message.displayName || 'Player'}</strong>
                  <time>{formatChatDate(message.createdAt)}</time>
                </header>
                <p>{message.text || ''}</p>
              </article>
            )) : <p className="admin-access-empty">No messages in this chat yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminAccessPanel({ currentEmail }) {
  const [accessState, setAccessState] = useState({ active: true, emails: [] });
  const [newEmail, setNewEmail] = useState('');
  const [status, setStatus] = useState('');
  const [busyEmail, setBusyEmail] = useState('');

  useEffect(() => subscribeToAdminAccess(
    (data) => {
      setAccessState(data);
      setStatus('');
    },
    (error) => setStatus(error.message || 'Could not load admin access.'),
  ), []);

  const handleAddEmail = async (event) => {
    event.preventDefault();
    setBusyEmail(newEmail);
    setStatus('');

    try {
      await addAdminEmail(newEmail);
      setNewEmail('');
      setStatus('Admin email saved.');
    } catch (error) {
      setStatus(error.message || 'Could not save admin email.');
    } finally {
      setBusyEmail('');
    }
  };

  const handleRemoveEmail = async (email) => {
    if (email === currentEmail) {
      setStatus('You cannot remove your own active admin email while signed in.');
      return;
    }

    setBusyEmail(email);
    setStatus('');

    try {
      await removeAdminEmail(email);
      setStatus('Admin email removed.');
    } catch (error) {
      setStatus(error.message || 'Could not remove admin email.');
    } finally {
      setBusyEmail('');
    }
  };

  return (
    <section className="admin-access-panel">
      <div className="admin-access-heading">
        <span><Users size={22} /></span>
        <div>
          <h2>Admin Users</h2>
          <p>Manage who can open this hidden Firebase admin area.</p>
        </div>
      </div>

      <form className="admin-access-form" onSubmit={handleAddEmail}>
        <label htmlFor="new-admin-email">Add admin email</label>
        <div>
          <input
            autoComplete="email"
            id="new-admin-email"
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="admin@example.com"
            type="email"
            value={newEmail}
          />
          <button type="submit" disabled={Boolean(busyEmail)}>
            <UserPlus size={18} /> Add
          </button>
        </div>
      </form>

      {status ? <strong className="admin-access-status">{status}</strong> : null}

      <div className="admin-access-list">
        {accessState.emails.length ? accessState.emails.map((email) => (
          <article className="admin-access-row" key={email} translate="no">
            <div>
              <strong>{email}</strong>
              <span>{email === currentEmail ? 'Current session' : 'Firebase admin'}</span>
            </div>
            <button type="button" onClick={() => handleRemoveEmail(email)} disabled={busyEmail === email || email === currentEmail}>
              <Trash2 size={17} /> Remove
            </button>
          </article>
        )) : <p className="admin-access-empty">No admin emails are listed in Firestore yet.</p>}
      </div>
    </section>
  );
}

export default function AdminLoginPage() {
  const [authState, setAuthState] = useState(initialAuthState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);

  useEffect(() => subscribeToAdminAuth((nextState) => {
    setAuthState(nextState);
    if (nextState.allowed) {
      setError('');
    }
  }), []);

  const currentSession = useMemo(() => ({
    email: authState.user?.email || '',
    role: authState.adminRecord?.role || (authState.allowed ? 'admin' : ''),
    startedAt: authState.user?.metadata?.lastSignInTime || '',
  }), [authState]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await signInAdmin({ email, password });
      setPassword('');
    } catch (loginError) {
      setError(loginError.message || 'Firebase admin login failed.');
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setBuilderOpen(false);
    await signOutAdmin();
  };

  if (authState.loading) {
    return (
      <section className="admin-page admin-login-page">
        <div className="admin-login-card">
          <span className="admin-lock-icon"><Lock size={28} /></span>
          <h1>Checking Admin Access</h1>
          <p>Loading Firebase session...</p>
        </div>
      </section>
    );
  }

  if (authState.authenticated && authState.allowed) {
    return (
      <section className="admin-page">
        <div className="admin-shell">
          <div className="admin-hero-panel">
            <span className="admin-status-pill"><ShieldCheck size={18} /> Firebase Admin Active</span>
            <h1>Admin Control Room</h1>
            <p>
              This hidden area uses Firebase Auth. Access is granted to emails listed in Firestore at admin/access emails.
            </p>
            <div className="admin-action-row">
              <button className="admin-builder-button" type="button" onClick={() => setBuilderOpen((value) => !value)}>
                <Hammer size={18} /> {builderOpen ? 'Close Builder' : 'Open Builder'}
              </button>
              <button className="admin-logout-button" type="button" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {builderOpen ? (
            <Suspense fallback={<main className="loading">Loading builder...</main>}>
              <ContentBuilder />
            </Suspense>
          ) : null}

          <WebsiteUsersPanel currentEmail={currentSession.email.toLowerCase()} />

          <ChatMonitorPanel />

          <AdminAccessPanel currentEmail={currentSession.email.toLowerCase()} />

          <div className="admin-session-card" translate="no">
            <strong>Firebase Session</strong>
            <span>Email: {currentSession.email}</span>
            <span>Role: {currentSession.role || 'admin'}</span>
            <span>Started: {currentSession.startedAt ? new Date(currentSession.startedAt).toLocaleString('en') : 'Firebase session'}</span>
          </div>

          <div className="admin-module-grid">
            {adminModules.map(({ icon: Icon, title, text }) => (
              <article className="admin-module-card" key={title}>
                <span><Icon size={22} /></span>
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <span className="admin-lock-icon"><Lock size={28} /></span>
        <h1>Admin Login</h1>
        <p>Sign in with a Firebase admin account.</p>

        <label htmlFor="admin-email">Email</label>
        <input
          autoComplete="username"
          id="admin-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          type="email"
          value={email}
        />

        <label htmlFor="admin-password">Password</label>
        <input
          autoComplete="current-password"
          id="admin-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Firebase password"
          type="password"
          value={password}
        />

        {error ? <strong className="admin-login-error">{error}</strong> : null}
        {authState.authenticated && !authState.allowed ? <strong className="admin-login-error">This Firebase user is signed in but the email is not listed in Firestore: admin/access emails.</strong> : null}
        <button className="admin-login-button" type="submit" disabled={submitting}>
          {submitting ? 'Checking...' : 'Sign In'}
        </button>
      </form>
    </section>
  );
}
