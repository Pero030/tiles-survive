import { LockKeyhole, MessageCircle, Plus, Search, Send, ShieldCheck, SmilePlus, Trash2, UserPlus, Users } from 'lucide-react';
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

const chatEmojiOptions = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '🙏', '🔥', '💪', '🎉', '❤️', '💚', '💎', '⚔️', '🛡️', '🏆', '✅', '❌'];

const getTimestampValue = (timestamp) => timestamp?.toMillis?.() || 0;

const normalizeChatLanguage = (languageCode) => String(languageCode || '')
  .trim()
  .replace(/^\/[^/]+\//, '')
  .split('|')[0]
  .toLowerCase()
  .split('-')[0] || 'en';

const getStoredChatLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return normalizeChatLanguage(window.localStorage.getItem('tiles-survive-language') || document.documentElement.lang || 'en');
};

const cleanMentionName = (name) => String(name || 'Player').trim().replace(/\s+/g, ' ').slice(0, 40);

const getMentionQuery = (message) => {
  const match = String(message || '').match(/(^|\s)@([^\s@]*)$/);
  return match ? match[2].toLowerCase() : null;
};

const renderMessageText = (text, memberProfiles = []) => {
  const value = String(text || '');
  const mentionNames = [...new Set(memberProfiles.map((profile) => cleanMentionName(profile.displayName)).filter(Boolean))]
    .sort((first, second) => second.length - first.length);
  const parts = [];
  let index = 0;

  while (index < value.length) {
    if (value[index] !== '@') {
      const nextMention = value.indexOf('@', index);
      const end = nextMention === -1 ? value.length : nextMention;
      parts.push(value.slice(index, end));
      index = end;
      continue;
    }

    const matchedName = mentionNames.find((name) => {
      const mention = `@${name}`;
      const possibleMatch = value.slice(index, index + mention.length);
      const nextCharacter = value[index + mention.length] || '';
      return possibleMatch.toLowerCase() === mention.toLowerCase() && (!nextCharacter || /\s|[.,!?;:]/.test(nextCharacter));
    });

    if (!matchedName) {
      parts.push('@');
      index += 1;
      continue;
    }

    parts.push(<span className="chat-mention" key={`${matchedName}-${index}`}>@{matchedName}</span>);
    index += matchedName.length + 1;
  }

  return parts;
};

const getStoredReadState = (uid) => {
  if (typeof window === 'undefined' || !uid) return {};

  try {
    return JSON.parse(window.localStorage.getItem(`tiles-survive-chat-read-${uid}`) || '{}');
  } catch {
    return {};
  }
};

const storeReadState = (uid, state) => {
  if (typeof window === 'undefined' || !uid) return;
  window.localStorage.setItem(`tiles-survive-chat-read-${uid}`, JSON.stringify(state));
};

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
  const [publicRoomSnapshots, setPublicRoomSnapshots] = useState({});
  const [activeRoomId, setActiveRoomId] = useState('global');
  const [messages, setMessages] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [draft, setDraft] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(() => getStoredChatLanguage());
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [readByRoom, setReadByRoom] = useState(() => getStoredReadState(authService.getCurrentUser()?.uid));
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [privateTitle, setPrivateTitle] = useState('');
  const [invitePolicy, setInvitePolicy] = useState('ownerOnly');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [inviteUserIds, setInviteUserIds] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => authService.subscribe(setUser), []);

  useEffect(() => {
    if (!user) {
      setProfile({});
      setPrivateRooms([]);
      setPublicRoomSnapshots({});
      setMessages([]);
      setActiveRoomId('global');
      setReadByRoom({});
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
    setReadByRoom(getStoredReadState(user?.uid));
  }, [user?.uid]);

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
  const liveGlobalRoom = publicRoomSnapshots.global ? { ...globalRoom, ...publicRoomSnapshots.global } : globalRoom;
  const liveAllianceRoom = allianceRoom && publicRoomSnapshots[allianceRoom.id]
    ? { ...allianceRoom, ...publicRoomSnapshots[allianceRoom.id] }
    : allianceRoom;
  const rooms = useMemo(() => [
    liveGlobalRoom,
    ...(liveAllianceRoom ? [liveAllianceRoom] : []),
    ...privateRooms,
  ], [liveGlobalRoom, liveAllianceRoom, privateRooms]);
  const activeRoom = rooms.find((room) => room.id === activeRoomId) || liveGlobalRoom;
  const canInviteActiveRoom = chatService.canInviteToRoom(activeRoom, user);
  const canDeleteActiveRoom = chatService.canDeleteRoom(activeRoom, user);

  useEffect(() => {
    if (!rooms.some((room) => room.id === activeRoomId)) {
      setActiveRoomId('global');
    }
  }, [activeRoomId, rooms]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const roomIds = ['global', allianceRoom?.id].filter(Boolean);
    const unsubscribes = roomIds.map((roomId) => chatService.subscribeToRoom(
      roomId,
      (room) => setPublicRoomSnapshots((current) => ({ ...current, [roomId]: room })),
      (error) => setStatus(error.message || 'Could not load chat notifications.'),
    ));

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [user, allianceRoom?.id]);

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
    if (!user?.uid || !activeRoom?.id) {
      return;
    }

    const newestMessageAt = messages.reduce((newest, message) => Math.max(newest, getTimestampValue(message.createdAt)), 0);
    const roomUpdatedAt = getTimestampValue(activeRoom.lastMessageAt || activeRoom.updatedAt);
    const newestReadAt = Math.max(newestMessageAt, roomUpdatedAt);

    if (!newestReadAt || readByRoom[activeRoom.id] >= newestReadAt) {
      return;
    }

    setReadByRoom((current) => {
      const next = { ...current, [activeRoom.id]: newestReadAt };
      storeReadState(user.uid, next);
      return next;
    });
  }, [activeRoom?.id, activeRoom?.lastMessageAt, activeRoom?.updatedAt, messages, readByRoom, user?.uid]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, activeRoom?.id]);

  useEffect(() => {
    const syncChatLanguage = () => setChatLanguage(getStoredChatLanguage());
    syncChatLanguage();

    window.addEventListener('tiles-survive-translation-change', syncChatLanguage);
    const intervalId = window.setInterval(syncChatLanguage, 1200);

    return () => {
      window.removeEventListener('tiles-survive-translation-change', syncChatLanguage);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!user || !activeRoom?.id || !chatLanguage) {
      return undefined;
    }

    let isMounted = true;
    const messagesToTranslate = messages.filter((message) => (
      message.id
      && message.text
      && message.uid !== user.uid
      && !message.translations?.[chatLanguage]
      && !translatedMessages[`${message.id}:${chatLanguage}`]
    ));

    messagesToTranslate.slice(0, 12).forEach((message) => {
      chatService.translateMessage({
        roomId: activeRoom.id,
        messageId: message.id,
        targetLanguage: chatLanguage,
      })
        .then((translatedText) => {
          if (!isMounted || !translatedText) return;
          setTranslatedMessages((current) => ({
            ...current,
            [`${message.id}:${chatLanguage}`]: translatedText,
          }));
        })
        .catch(() => {
          if (!isMounted) return;
          setTranslatedMessages((current) => ({
            ...current,
            [`${message.id}:${chatLanguage}`]: message.text,
          }));
        });
    });

    return () => {
      isMounted = false;
    };
  }, [activeRoom?.id, chatLanguage, messages, translatedMessages, user]);

  const trimmedDraft = useMemo(() => draft.trim(), [draft]);
  const currentPublicProfile = useMemo(() => ({
    uid: user?.uid,
    displayName: user?.displayName || profile.displayName || 'Player',
    gameServer: profile.gameServer || '',
    allianceName: profile.allianceName || '',
    allianceTag: profile.allianceTag || '',
    photoURL: user?.photoURL || profile.photoURL || '',
  }), [profile, user]);
  const allVisibleProfiles = useMemo(() => [
    currentPublicProfile,
    ...publicProfiles,
  ].filter((item) => item.uid), [currentPublicProfile, publicProfiles]);
  const activeRoomMemberProfiles = useMemo(() => {
    if (activeRoom.type === 'global') {
      return allVisibleProfiles;
    }

    if (activeRoom.type === 'alliance') {
      return allVisibleProfiles.filter((item) => (
        String(item.gameServer || '') === String(activeRoom.gameServer || '')
        && String(item.allianceTag || '').toUpperCase() === String(activeRoom.allianceTag || '').toUpperCase()
      ));
    }

    if (activeRoom.type === 'private') {
      return allVisibleProfiles.filter((item) => activeRoom.memberUids?.[item.uid]);
    }

    return [];
  }, [activeRoom, allVisibleProfiles]);
  const mentionQuery = useMemo(() => getMentionQuery(draft), [draft]);
  const mentionSuggestions = useMemo(() => {
    if (mentionQuery === null) {
      return [];
    }

    return activeRoomMemberProfiles
      .filter((item) => cleanMentionName(item.displayName).toLowerCase().startsWith(mentionQuery))
      .slice(0, 8);
  }, [activeRoomMemberProfiles, mentionQuery]);
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

  const handleDeletePrivateRoom = async () => {
    if (!activeRoom?.id || activeRoom.type !== 'private') {
      return;
    }

    const confirmed = window.confirm(`Delete private chat "${activeRoom.title || 'Private Chat'}" for all members?`);
    if (!confirmed) {
      return;
    }

    setStatus('');

    try {
      await chatService.deletePrivateRoom(activeRoom.id);
      setActiveRoomId('global');
      setMessages([]);
      setStatus('Private chat deleted.');
    } catch (error) {
      setStatus(error.message || 'Private chat could not be deleted.');
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

  const handleAddEmoji = (emoji) => {
    setDraft((current) => `${current}${emoji}`);
    setEmojiOpen(false);
  };

  const handleSelectMention = (profileItem) => {
    const mentionName = cleanMentionName(profileItem.displayName);
    setDraft((current) => current.replace(/(^|\s)@([^\s@]*)$/, `$1@${mentionName} `));
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const hasUnreadMessages = (room) => {
    if (!room?.id || room.id === activeRoomId) return 0;
    const latest = getTimestampValue(room.lastMessageAt || room.updatedAt);
    return Boolean(latest && latest > (readByRoom[room.id] || 0));
  };

  const getRoomButtonClass = (room) => [
    'chat-room-button',
    activeRoomId === room?.id ? 'is-active' : '',
    hasUnreadMessages(room) ? 'has-unread' : '',
  ].filter(Boolean).join(' ');

  const totalUnreadRooms = rooms.filter((room) => hasUnreadMessages(room)).length;

  const getDisplayedMessageText = (message) => {
    if (message.uid === user.uid) {
      return message.text;
    }

    return message.translations?.[chatLanguage]
      || translatedMessages[`${message.id}:${chatLanguage}`]
      || message.text;
  };

  const getMessageAuthorProfile = (message) => allVisibleProfiles.find((item) => item.uid === message.uid) || {};

  const getMessagePhotoURL = (message) => message.photoURL || getMessageAuthorProfile(message).photoURL || '';

  const getMessageInitial = (message) => String(message.displayName || getMessageAuthorProfile(message).displayName || 'P').trim().slice(0, 1).toUpperCase();

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
              <h2>Rooms {totalUnreadRooms ? <span className="chat-room-total-badge">{totalUnreadRooms}</span> : null}</h2>
              <button className={getRoomButtonClass(liveGlobalRoom)} type="button" onClick={() => setActiveRoomId('global')}>
                <MessageCircle size={17} />
                <span>Global</span>
                <small>All signed-in users</small>
                {hasUnreadMessages(liveGlobalRoom) ? <strong className="chat-unread-badge">New message</strong> : null}
              </button>
              {allianceRoom ? (
                <button className={getRoomButtonClass(liveAllianceRoom)} type="button" onClick={() => setActiveRoomId(allianceRoom.id)} translate="no">
                  <ShieldCheck size={17} />
                  <span>{allianceRoom.title}</span>
                  <small>Your server and alliance tag</small>
                  {hasUnreadMessages(liveAllianceRoom) ? <strong className="chat-unread-badge">New message</strong> : null}
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
                <button className={getRoomButtonClass(room)} key={room.id} type="button" onClick={() => setActiveRoomId(room.id)}>
                  <LockKeyhole size={17} />
                  <span>{room.title || 'Private Chat'}</span>
                  <small>{room.memberCount || Object.keys(room.memberUids || {}).length || 1} members</small>
                  {hasUnreadMessages(room) ? <strong className="chat-unread-badge">New message</strong> : null}
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
              <div className="chat-room-heading-actions">
                {activeRoom.type === 'private' ? <small>{activeRoom.invitePolicy === 'allMembers' ? 'Members can invite' : 'Creator invites only'}</small> : null}
                {canDeleteActiveRoom ? (
                  <button className="chat-delete-room-button" type="button" onClick={handleDeletePrivateRoom}>
                    <Trash2 size={16} /> Delete chat
                  </button>
                ) : null}
              </div>
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
                  <div className={getMessagePhotoURL(message) ? 'chat-message-avatar has-photo' : 'chat-message-avatar'} translate="no">
                    {getMessagePhotoURL(message) ? <img src={getMessagePhotoURL(message)} alt="" /> : getMessageInitial(message)}
                  </div>
                  <div className="chat-message-body">
                    <header translate="no">
                      <strong>{message.senderLabel || message.displayName || 'Player'}</strong>
                      {message.createdAt ? <time>{formatChatTime(message.createdAt)}</time> : null}
                    </header>
                    <p>{renderMessageText(getDisplayedMessageText(message), activeRoomMemberProfiles)}</p>
                  </div>
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
              <div className="chat-compose-field">
                <textarea
                  id="chat-message"
                  ref={textareaRef}
                  maxLength={800}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Write to ${activeRoom.title || 'this chat'}...`}
                  rows={3}
                  value={draft}
                />
                <button className="chat-emoji-toggle" type="button" onClick={() => setEmojiOpen((value) => !value)} aria-expanded={emojiOpen} aria-label="Choose emoji">
                  <SmilePlus size={19} />
                </button>
                {emojiOpen ? (
                  <div className="chat-emoji-picker" translate="no">
                    {chatEmojiOptions.map((emoji) => (
                      <button key={emoji} type="button" onClick={() => handleAddEmoji(emoji)}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : null}
                {mentionSuggestions.length ? (
                  <div className="chat-mention-picker" translate="no">
                    {mentionSuggestions.map((mentionProfile) => (
                      <button key={mentionProfile.uid} type="button" onClick={() => handleSelectMention(mentionProfile)}>
                        <Users size={15} />
                        <span>{cleanMentionName(mentionProfile.displayName)}</span>
                        <small>{formatUserOption(mentionProfile)}</small>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
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

