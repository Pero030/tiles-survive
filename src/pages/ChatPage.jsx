import { LockKeyhole, MessageCircle, Plus, Search, Send, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../features/auth/authService.js';
import { chatService } from '../features/chat/chatService.js';
import { subscribeToPublicProfiles } from '../services/profileDirectory.js';

const formatChatTime = (createdAt) => {
  const date = createdAt?.toDate?.() || null;
  if (!date) return '';

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatUserOption = (profile) => {
  const name = profile.displayName || 'Player';
  const server = profile.gameServer ? `#${profile.gameServer}` : '';
  const alliance = profile.allianceTag ? `[${profile.allianceTag}]` : '';
  return [server, alliance, name].filter(Boolean).join(' ');
};

const getSearchText = (profile) => [
  profile.displayName,
  profile.gameServer,
  profile.allianceName,
  profile.allianceTag,
  profile.uid,
].filter(Boolean).join(' ').toLowerCase();

function UserPicker({ filteredProfiles, selectedUserIds, title, toggleUser, userSearch, setUserSearch }) {
  const searchId = `${title.replace(/\s+/g, '-').toLowerCase()}-search`;

  return (
    <div className="chat-user-picker">
      <label htmlFor={searchId}>{title}</label>
      <div className="chat-user-search">
        <Search size={16} />
        <input
          id={searchId}
          onChange={(event) => setUserSearch(event.target.value)}
          placeholder="Search name, server, alliance..."
          value={userSearch}
        />
      </div>
      <div className="chat-user-options">
        {filteredProfiles.length ? filteredProfiles.map((profile) => (
          <button
            className={selectedUserIds.includes(profile.uid) ? 'is-selected' : ''}
            key={profile.uid}
            type="button"
            onClick={() => toggleUser(profile.uid)}
            translate="no"
          >
            <Users size={15} />
            <span>{formatUserOption(profile)}</span>
          </button>
        )) : <p>No users found.</p>}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [profile, setProfile] = useState({});
  const [privateRooms, setPrivateRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState('global');
  const [messages, setMessages] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [privateTitle, setPrivateTitle] = useState('');
  const [invitePolicy, setInvitePolicy] = useState('ownerOnly');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [inviteUserIds, setInviteUserIds] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const listRef = useRef(null);

  useEffect(() => authService.subscribe(setUser), []);

  useEffect(() => {
    if (!user) {
      setProfile({});
      setPrivateRooms([]);
      setMessages([]);
      setActiveRoomId('global');
      return undefined;
    }

    let isMounted = true;
    authService.getCurrentUserProfile()
      .then((nextProfile) => {
        if (isMounted) setProfile(nextProfile || {});
      })
      .catch((error) => setStatus(error.message || 'Could not load your profile.'));

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    return chatService.subscribeToPrivateRooms(
      user,
      (rooms) => {
        setPrivateRooms(rooms);
        setStatus('');
      },
      (error) => setStatus(error.message || 'Could not load private chats.'),
    );
  }, [user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    return subscribeToPublicProfiles(
      (items) => setPublicProfiles(items.filter((item) => item.uid !== user.uid)),
      (error) => setStatus(error.message || 'Could not load public profiles.'),
    );
  }, [user]);

  const globalRoom = useMemo(() => chatService.getGlobalRoom(), []);
  const allianceRoom = useMemo(() => chatService.getAllianceRoomForProfile(profile), [profile?.gameServer, profile?.allianceTag]);
  const rooms = useMemo(() => [
    globalRoom,
    ...(allianceRoom ? [allianceRoom] : []),
    ...privateRooms,
  ], [globalRoom, allianceRoom, privateRooms]);
  const activeRoom = rooms.find((room) => room.id === activeRoomId) || globalRoom;
  const canInviteActiveRoom = chatService.canInviteToRoom(activeRoom, user);

  useEffect(() => {
    if (!rooms.some((room) => room.id === activeRoomId)) {
      setActiveRoomId('global');
    }
  }, [activeRoomId, rooms]);

  useEffect(() => {
    if (!user || !activeRoom?.id) {
      setMessages([]);
      return undefined;
    }

    return chatService.subscribeToMessages(
      activeRoom.id,
      (items) => {
        setMessages(items);
        setStatus('');
      },
      (error) => setStatus(error.message || 'Could not load chat messages.'),
    );
  }, [user, activeRoom?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, activeRoom?.id]);

  const trimmedDraft = useMemo(() => draft.trim(), [draft]);
  const filteredProfiles = useMemo(() => {
    const searchValue = userSearch.trim().toLowerCase();
    const profiles = searchValue
      ? publicProfiles.filter((item) => getSearchText(item).includes(searchValue))
      : publicProfiles;
    return profiles.slice(0, 18);
  }, [userSearch, publicProfiles]);

  const toggleSelectedUser = (uid, targetSetter) => {
    targetSetter((current) => current.includes(uid) ? current.filter((item) => item !== uid) : [...current, uid]);
  };

  const handleCreatePrivateRoom = async (event) => {
    event.preventDefault();
    setStatus('');
    setCreatingRoom(true);

    try {
      const roomId = await chatService.createPrivateRoom({
        title: privateTitle,
        invitePolicy,
        memberUids: selectedUserIds,
      });
      setPrivateTitle('');
      setSelectedUserIds([]);
      setActiveRoomId(roomId);
      setStatus('Private chat created.');
    } catch (error) {
      setStatus(error.message || 'Private chat could not be created.');
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleInviteUsers = async () => {
    setStatus('');

    try {
      await chatService.addMembersToPrivateRoom(activeRoom.id, inviteUserIds);
      setInviteUserIds([]);
      setStatus('Users added to private chat.');
    } catch (error) {
      setStatus(error.message || 'Users could not be added.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (!trimmedDraft) {
      return;
    }

    setSending(true);
    try {
      await chatService.sendMessage(activeRoom, trimmedDraft);
      setDraft('');
    } catch (error) {
      setStatus(error.message || 'Message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <section className="page-shell page-top chat-page">
        <div className="chat-locked-panel">
          <span><ShieldCheck size={30} /></span>
          <h1>Alliance Chat</h1>
          <p>You need an account and must be signed in to read or write in chat.</p>
          <Link className="user-auth-primary" to="/login">Go to Login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell page-top chat-page">
      <div className="chat-shell chat-room-shell">
        <header className="chat-header">
          <span><MessageCircle size={28} /></span>
          <div>
            <p className="eyebrow">Community</p>
            <h1>Alliance Chat</h1>
            <p>Choose Global, your server alliance chat, or a private room.</p>
          </div>
        </header>

        <div className="chat-room-layout">
          <aside className="chat-room-sidebar">
            <div className="chat-room-group">
              <h2>Rooms</h2>
              <button className={activeRoomId === 'global' ? 'chat-room-button is-active' : 'chat-room-button'} type="button" onClick={() => setActiveRoomId('global')}>
                <MessageCircle size={17} />
                <span>Global</span>
                <small>All signed-in users</small>
              </button>
              {allianceRoom ? (
                <button className={activeRoomId === allianceRoom.id ? 'chat-room-button is-active' : 'chat-room-button'} type="button" onClick={() => setActiveRoomId(allianceRoom.id)} translate="no">
                  <ShieldCheck size={17} />
                  <span>{allianceRoom.title}</span>
                  <small>Your server and alliance tag</small>
                </button>
              ) : (
                <div className="chat-room-note">
                  Add server and alliance tag in your profile to unlock Alliance chat.
                </div>
              )}
            </div>

            <div className="chat-room-group">
              <h2>Private chats</h2>
              {privateRooms.length ? privateRooms.map((room) => (
                <button className={activeRoomId === room.id ? 'chat-room-button is-active' : 'chat-room-button'} key={room.id} type="button" onClick={() => setActiveRoomId(room.id)}>
                  <LockKeyhole size={17} />
                  <span>{room.title || 'Private Chat'}</span>
                  <small>{room.memberCount || Object.keys(room.memberUids || {}).length || 1} members</small>
                </button>
              )) : <p className="chat-room-note">No private chats yet.</p>}
            </div>

            <form className="chat-private-builder" onSubmit={handleCreatePrivateRoom}>
              <h2><Plus size={17} /> New private chat</h2>
              <label htmlFor="private-chat-title">Name</label>
              <input id="private-chat-title" value={privateTitle} onChange={(event) => setPrivateTitle(event.target.value)} placeholder="Strategy room" maxLength={60} />
              <label htmlFor="private-chat-policy">Who can invite?</label>
              <select id="private-chat-policy" value={invitePolicy} onChange={(event) => setInvitePolicy(event.target.value)}>
                <option value="ownerOnly">Only creator</option>
                <option value="allMembers">All members</option>
              </select>
              <UserPicker
                filteredProfiles={filteredProfiles}
                selectedUserIds={selectedUserIds}
                setUserSearch={setUserSearch}
                title="Invite users"
                toggleUser={(uid) => toggleSelectedUser(uid, setSelectedUserIds)}
                userSearch={userSearch}
              />
              <button className="user-auth-primary" type="submit" disabled={creatingRoom}>
                <Plus size={17} /> {creatingRoom ? 'Creating...' : 'Create private chat'}
              </button>
            </form>
          </aside>

          <main className="chat-main-panel">
            <div className="chat-room-heading">
              <div>
                <span>{activeRoom.type === 'global' ? 'Global chat' : activeRoom.type === 'alliance' ? 'Alliance chat' : 'Private chat'}</span>
                <h2 translate={activeRoom.type === 'alliance' ? 'no' : undefined}>{activeRoom.title || 'Private Chat'}</h2>
              </div>
              {activeRoom.type === 'private' ? <small>{activeRoom.invitePolicy === 'allMembers' ? 'Members can invite' : 'Creator invites only'}</small> : null}
            </div>

            {activeRoom.type === 'private' && canInviteActiveRoom ? (
              <div className="chat-invite-panel">
                <div>
                  <h3><UserPlus size={17} /> Add users</h3>
                  <p>Choose more people for this private chat.</p>
                </div>
                <UserPicker
                  filteredProfiles={filteredProfiles}
                  selectedUserIds={inviteUserIds}
                  setUserSearch={setUserSearch}
                  title="Add to chat"
                  toggleUser={(uid) => toggleSelectedUser(uid, setInviteUserIds)}
                  userSearch={userSearch}
                />
                <button className="user-auth-secondary" type="button" onClick={handleInviteUsers} disabled={!inviteUserIds.length}>
                  <UserPlus size={17} /> Add selected
                </button>
              </div>
            ) : null}

            <div className="chat-message-list" ref={listRef} aria-live="polite">
              {messages.length ? messages.map((message) => (
                <article className={message.uid === user.uid ? 'chat-message is-own' : 'chat-message'} key={message.id}>
                  <header translate="no">
                    <strong>{message.senderLabel || message.displayName || 'Player'}</strong>
                    {message.createdAt ? <time>{formatChatTime(message.createdAt)}</time> : null}
                  </header>
                  <p>{message.text}</p>
                </article>
              )) : (
                <div className="chat-empty-state">
                  <strong>No messages yet.</strong>
                  <p>Start the first conversation in this room.</p>
                </div>
              )}
            </div>

            {status ? <strong className="chat-status">{status}</strong> : null}

            <form className="chat-compose" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="chat-message">Message</label>
              <textarea
                id="chat-message"
                maxLength={800}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Write to ${activeRoom.title || 'this chat'}...`}
                rows={3}
                value={draft}
              />
              <button className="user-auth-primary" type="submit" disabled={sending || !trimmedDraft}>
                <Send size={18} /> {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </main>
        </div>
      </div>
    </section>
  );
}
