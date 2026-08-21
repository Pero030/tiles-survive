import { LockKeyhole, MessageCircle, Plus, Search, Send, Settings, ShieldCheck, SmilePlus, Trash2, UserPlus, Users } from 'lucide-react';
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
  const [allianceSubRooms, setAllianceSubRooms] = useState([]);
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
  const [allianceAction, setAllianceAction] = useState(false);
  const [allianceInviteCode, setAllianceInviteCode] = useState('');
  const [roomCategory, setRoomCategory] = useState('alliance');
  const [alliancePanel, setAlliancePanel] = useState('');
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => authService.subscribe(setUser), []);

  useEffect(() => {
    if (!user) {
      setProfile({});
      setPrivateRooms([]);
      setAllianceSubRooms([]);
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
  const allianceRoomSnapshot = allianceRoom ? publicRoomSnapshots[allianceRoom.id] : null;
  const liveAllianceRoom = allianceRoomSnapshot ? { ...allianceRoom, ...allianceRoomSnapshot } : null;
  const rooms = useMemo(() => [
    liveGlobalRoom,
    ...(liveAllianceRoom ? [liveAllianceRoom, ...allianceSubRooms] : []),
    ...privateRooms,
  ], [liveGlobalRoom, liveAllianceRoom, allianceSubRooms, privateRooms]);
  const activeRoom = rooms.find((room) => room.id === activeRoomId) || liveGlobalRoom;
  const allianceAccessState = chatService.getAllianceAccessState(liveAllianceRoom || allianceRoom, user, profile);
  const canUseActiveRoom = chatService.canUseRoom(activeRoom, user, profile);
  const canInviteActiveRoom = chatService.canInviteToRoom(activeRoom, user);
  const canDeleteActiveRoom = chatService.canDeleteRoom(activeRoom, user);
  const allianceManagementRoom = (activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') && liveAllianceRoom ? liveAllianceRoom : activeRoom;
  const canManageAllianceActiveRoom = chatService.canManageAllianceRoom(allianceManagementRoom, user);
  const canChangeAllianceRoles = chatService.canChangeAllianceRoles(allianceManagementRoom, user);
  const canCreateAllianceSubRoom = chatService.canCreateAllianceSubRoom(liveAllianceRoom, user);
  const allianceSubRoomLimitReached = allianceSubRooms.length >= 5;
  const isAllianceRoomActive = activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub';
  const isMainAllianceRoomActive = activeRoom.type === 'alliance';
  const isAllianceSubRoomActive = activeRoom.type === 'allianceSub';

  useEffect(() => {
    if (!rooms.some((room) => room.id === activeRoomId)) {
      setActiveRoomId('global');
    }
  }, [activeRoomId, rooms]);
  useEffect(() => {
    if (roomCategory === 'alliance' && liveAllianceRoom && activeRoom.type !== 'alliance' && activeRoom.type !== 'allianceSub') {
      setActiveRoomId(liveAllianceRoom.id);
      return;
    }

    if (roomCategory === 'global' && activeRoomId !== 'global') {
      setActiveRoomId('global');
      return;
    }

    if (roomCategory === 'private' && activeRoom.type !== 'private') {
      const firstPrivateRoom = privateRooms[0];
      if (firstPrivateRoom) {
        setActiveRoomId(firstPrivateRoom.id);
      }
    }
  }, [activeRoom.type, activeRoomId, liveAllianceRoom, privateRooms, roomCategory]);

  useEffect(() => {
    if (!user || !liveAllianceRoom?.id) {
      setAllianceSubRooms([]);
      return undefined;
    }

    return chatService.subscribeToAllianceSubRooms(
      liveAllianceRoom.id,
      (rooms) => {
        setAllianceSubRooms(rooms);
        setStatus('');
      },
      (error) => setStatus(error.message || 'Could not load alliance sub chats.'),
    );
  }, [user, liveAllianceRoom?.id]);
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
    if (!user || !activeRoom?.id || !canUseActiveRoom) {
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
  }, [user, activeRoom?.id, canUseActiveRoom]);

  useEffect(() => {
    if (!user?.uid || !activeRoom?.id) {
      return;
    }

    const newestMessageAt = messages.reduce((newest, message) => Math.max(newest, getTimestampValue(message.createdAt)), 0);
    const newestReadAt = Math.max(newestMessageAt, getTimestampValue(activeRoom.lastMessageAt));

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

    if (activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') {
      return allVisibleProfiles.filter((item) => activeRoom.memberUids?.[item.uid]);
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
  const pendingAllianceRequests = useMemo(() => Object.values(allianceManagementRoom.joinRequests || {})
    .filter((request) => request?.status === 'pending'), [allianceManagementRoom.joinRequests]);
  const allianceMemberProfiles = useMemo(() => allVisibleProfiles
    .filter((item) => allianceManagementRoom.memberUids?.[item.uid]), [allianceManagementRoom.memberUids, allVisibleProfiles]);

  const filteredProfiles = useMemo(() => {
    const searchValue = userSearch.trim().toLowerCase();
    const profiles = searchValue
      ? publicProfiles.filter((item) => getSearchText(item).includes(searchValue))
      : publicProfiles;
    return profiles.slice(0, 18);
  }, [userSearch, publicProfiles]);
  const allianceInviteProfiles = useMemo(() => {
    const searchValue = userSearch.trim().toLowerCase();
    const server = String(allianceManagementRoom.gameServer || '').trim();
    const tag = String(allianceManagementRoom.allianceTag || '').trim().toUpperCase();
    const profiles = publicProfiles.filter((item) => {
      const sameServer = String(item.gameServer || '').trim() === server;
      const sameTag = String(item.allianceTag || '').trim().toUpperCase() === tag;
      const isMember = allianceManagementRoom.memberUids?.[item.uid] === true;
      const matchesSearch = !searchValue || getSearchText(item).includes(searchValue);
      return sameServer && sameTag && !isMember && matchesSearch;
    });
    return profiles.slice(0, 18);
  }, [allianceManagementRoom, publicProfiles, userSearch]);

  const toggleSelectedUser = (uid, targetSetter) => {
    targetSetter((current) => current.includes(uid) ? current.filter((item) => item !== uid) : [...current, uid]);
  };

  const handleCreateAllianceChat = async () => {
    setStatus('');
    setAllianceAction(true);

    try {
      const roomId = await chatService.createAllianceChat(profile);
      setActiveRoomId(roomId);
      setStatus('Alliance chat created. You are the owner for this chat.');
    } catch (error) {
      setStatus(error.message || 'Alliance chat could not be created.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleCreateAllianceSubRoom = async () => {
    setStatus('');
    setAllianceAction(true);

    try {
      const roomId = await chatService.createAllianceSubRoom(liveAllianceRoom);
      setAllianceSubRooms((current) => current.some((room) => room.id === roomId)
        ? current
        : [...current, {
          ...liveAllianceRoom,
          id: roomId,
          type: 'allianceSub',
          parentRoomId: liveAllianceRoom.id,
          title: `${liveAllianceRoom.title} - Chat ${current.length + 1}`,
          order: current.length + 1,
        }]);
      setActiveRoomId(roomId);
      setStatus('Alliance sub chat created.');
    } catch (error) {
      setStatus(error.message || 'Alliance sub chat could not be created.');
    } finally {
      setAllianceAction(false);
    }
  };
  const handleRequestAllianceAccess = async () => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.requestAllianceAccess(activeRoom, profile);
      setStatus('Join request sent to the alliance chat admins.');
    } catch (error) {
      setStatus(error.message || 'Join request could not be sent.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleApproveAllianceRequest = async (uid) => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.approveAllianceRequest(allianceManagementRoom.id, uid);
      setStatus('Alliance member approved.');
    } catch (error) {
      setStatus(error.message || 'Request could not be approved.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleRejectAllianceRequest = async (uid) => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.rejectAllianceRequest(allianceManagementRoom.id, uid);
      setStatus('Join request rejected.');
    } catch (error) {
      setStatus(error.message || 'Request could not be rejected.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleSetAllianceRole = async (uid, role) => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.setAllianceMemberRole(allianceManagementRoom.id, uid, role);
      setStatus(role === 'admin' ? 'Member is now an alliance chat admin.' : 'Member role updated.');
    } catch (error) {
      setStatus(error.message || 'Role could not be changed.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleRemoveAllianceMember = async (uid) => {
    const member = allianceMemberProfiles.find((item) => item.uid === uid);
    const confirmed = window.confirm(`Remove ${member?.displayName || 'this member'} from this alliance chat?`);
    if (!confirmed) return;

    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.removeAllianceMember(allianceManagementRoom.id, uid);
      setStatus('Member removed from alliance chat.');
    } catch (error) {
      setStatus(error.message || 'Member could not be removed.');
    } finally {
      setAllianceAction(false);
    }
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

  const handleAddAllianceMembers = async () => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.addAllianceMembers(allianceManagementRoom.id, inviteUserIds);
      setInviteUserIds([]);
      setStatus('Users added to alliance chat.');
    } catch (error) {
      setStatus(error.message || 'Users could not be added to alliance chat.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleGenerateAllianceInviteCode = async () => {
    setStatus('');
    setAllianceAction(true);

    try {
      const code = await chatService.generateAllianceInviteCode(allianceManagementRoom.id);
      setStatus('Invite code created: ' + code);
    } catch (error) {
      setStatus(error.message || 'Invite code could not be created.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleJoinAllianceByInviteCode = async (event) => {
    event.preventDefault();
    setStatus('');
    setAllianceAction(true);

    try {
      const roomId = await chatService.joinAllianceByInviteCode(allianceInviteCode, profile);
      setAllianceInviteCode('');
      setRoomCategory('alliance');
      setActiveRoomId(roomId);
      setStatus('Alliance chat joined.');
    } catch (error) {
      setStatus(error.message || 'Invite code could not be used.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleSetAllianceSubRoomAudience = async (audience) => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.setAllianceSubRoomAudience(activeRoom.id, audience);
      setAllianceSubRooms((current) => current.map((room) => room.id === activeRoom.id ? { ...room, audience } : room));
      setStatus(audience === 'leaders' ? 'Sub chat is now a leader chat.' : 'Sub chat is now a member chat.');
    } catch (error) {
      setStatus(error.message || 'Sub chat setting could not be changed.');
    } finally {
      setAllianceAction(false);
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
    const latest = getTimestampValue(room.lastMessageAt);
    return Boolean(latest && latest > (readByRoom[room.id] || 0));
  };

  const getRoomButtonClass = (room) => [
    'chat-room-button',
    activeRoomId === room?.id ? 'is-active' : '',
    hasUnreadMessages(room) ? 'has-unread' : '',
  ].filter(Boolean).join(' ');

  const totalUnreadRooms = rooms.filter((room) => hasUnreadMessages(room)).length;

  const handleSelectRoomCategory = (category) => {
    setRoomCategory(category);

    if (category === 'global') {
      setActiveRoomId('global');
    }

    if (category === 'alliance' && liveAllianceRoom) {
      setActiveRoomId(liveAllianceRoom.id);
    }
  };

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
      <section className="page-shell page-top chat-page notranslate" translate="no">
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
    <section className="page-shell page-top chat-page notranslate" translate="no">
      <div className="chat-shell chat-room-shell">
        <header className="chat-header">
          <span><MessageCircle size={28} /></span>
          <div>
            <p className="eyebrow">Community</p>
            <h1>Alliance Chat</h1>
            <p>Choose Global, your server alliance chat, or a private room.</p>
          </div>
        </header>

        <div className="chat-room-tabs" role="tablist" aria-label="Chat areas">
          <button className={roomCategory === 'alliance' ? 'is-active' : ''} type="button" onClick={() => handleSelectRoomCategory('alliance')}>
            <ShieldCheck size={20} />
            <span>Allianz</span>
          </button>
          <button className={roomCategory === 'global' ? 'is-active' : ''} type="button" onClick={() => handleSelectRoomCategory('global')}>
            <MessageCircle size={20} />
            <span>Global</span>
            {hasUnreadMessages(liveGlobalRoom) ? <strong>{'!'}</strong> : null}
          </button>
          <button className={roomCategory === 'private' ? 'is-active' : ''} type="button" onClick={() => handleSelectRoomCategory('private')}>
            <LockKeyhole size={20} />
            <span>Privat</span>
            {privateRooms.some((room) => hasUnreadMessages(room)) ? <strong>{privateRooms.filter((room) => hasUnreadMessages(room)).length}</strong> : null}
          </button>
        </div>
        <div className="chat-room-layout">
          <aside className="chat-room-sidebar">

            {roomCategory === 'alliance' ? (
              <div className="chat-room-group">
                <h2>Alliance</h2>
                {liveAllianceRoom ? (
                  <>
                    <button className={getRoomButtonClass(liveAllianceRoom)} type="button" onClick={() => setActiveRoomId(liveAllianceRoom.id)} translate="no">
                      <ShieldCheck size={17} />
                      <span>{liveAllianceRoom.title}</span>
                      <small>{allianceAccessState === 'member' ? 'Approved members only' : allianceAccessState === 'pending' ? 'Request pending' : 'Approval required'}</small>
                      {hasUnreadMessages(liveAllianceRoom) ? <strong className="chat-unread-badge">New message</strong> : null}
                    </button>
                    <div className="chat-alliance-subrooms">
                      {allianceSubRooms.map((room) => (
                        <button className={getRoomButtonClass(room)} key={room.id} type="button" onClick={() => setActiveRoomId(room.id)} translate="no">
                          <MessageCircle size={15} />
                          <span>{room.title}</span>
                          <small>Alliance sub chat</small>
                          {hasUnreadMessages(room) ? <strong className="chat-unread-badge">New message</strong> : null}
                        </button>
                      ))}
                      {canCreateAllianceSubRoom && !allianceSubRoomLimitReached ? (
                        <button className="chat-add-subroom-button" type="button" onClick={handleCreateAllianceSubRoom} disabled={allianceAction} aria-label="Create alliance sub chat">
                          <Plus size={34} />
                        </button>
                      ) : null}
                      {canCreateAllianceSubRoom && allianceSubRoomLimitReached ? <small className="chat-subroom-limit">Maximum 5 sub chats</small> : null}
                    </div>
                  </>
                ) : allianceRoom ? (
                  <div className="chat-room-note">
                    <strong translate="no">{allianceRoom.title}</strong>
                    <span>Not created yet.</span>
                    <button className="chat-room-inline-action" type="button" onClick={handleCreateAllianceChat} disabled={allianceAction}>
                      {allianceAction ? 'Creating...' : 'Create alliance chat'}
                    </button>
                  </div>
                ) : (
                  <div className="chat-room-note">
                    Add server and alliance tag in your profile to unlock Alliance chat.
                  </div>
                )}
              </div>
            ) : null}

            {roomCategory === 'global' ? (
              <div className="chat-room-group">
                <h2>Global</h2>
                <button className={getRoomButtonClass(liveGlobalRoom)} type="button" onClick={() => setActiveRoomId('global')}>
                  <MessageCircle size={17} />
                  <span>Global</span>
                  <small>All signed-in users</small>
                  {hasUnreadMessages(liveGlobalRoom) ? <strong className="chat-unread-badge">New message</strong> : null}
                </button>
              </div>
            ) : null}

            {roomCategory === 'private' ? (
              <>
                <div className="chat-room-group">
                  <h2>Private</h2>
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
              </>
            ) : null}
          </aside>

          <main className="chat-main-panel">
            <div className="chat-room-heading">
              <div>
                <span>{activeRoom.type === 'global' ? 'Global chat' : activeRoom.type === 'alliance' ? 'Alliance chat' : activeRoom.type === 'allianceSub' ? 'Alliance sub chat' : 'Private chat'}</span>
                <h2 translate={activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub' ? 'no' : undefined}>{activeRoom.title || 'Private Chat'}</h2>
              </div>
              <div className="chat-room-heading-actions">
                {(activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') && canUseActiveRoom ? (
                  <>
                    {canManageAllianceActiveRoom ? (
                      <button className={alliancePanel === 'settings' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setAlliancePanel((current) => current === 'settings' ? '' : 'settings')}>
                        <Settings size={16} /> Settings
                      </button>
                    ) : null}
                    {canManageAllianceActiveRoom && isMainAllianceRoomActive ? (
                      <button className={alliancePanel === 'invite' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setAlliancePanel((current) => current === 'invite' ? '' : 'invite')}>
                        <UserPlus size={16} /> Invite
                      </button>
                    ) : null}
                    <button className={alliancePanel === 'members' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setAlliancePanel((current) => current === 'members' ? '' : 'members')}>
                      <Users size={16} /> Members
                    </button>
                  </>
                ) : null}
                {activeRoom.type === 'private' ? <small>{activeRoom.invitePolicy === 'allMembers' ? 'Members can invite' : 'Creator invites only'}</small> : null}
                {canDeleteActiveRoom ? (
                  <button className="chat-delete-room-button" type="button" onClick={handleDeletePrivateRoom}>
                    <Trash2 size={16} /> Delete chat
                  </button>
                ) : null}
              </div>
            </div>

            {(activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') && canUseActiveRoom && alliancePanel ? (
              <div className="chat-alliance-panel">
                {alliancePanel === 'invite' && canManageAllianceActiveRoom ? (
                  <>
                    <div>
                      <h3><UserPlus size={17} /> Invite</h3>
                      <p>Add users directly, approve join requests, or create an invite code.</p>
                    </div>
                    <div className="chat-invite-code-box" translate="no">
                      <span>Invite code</span>
                      <strong>{allianceManagementRoom.inviteCode || 'None created yet'}</strong>
                      <button type="button" onClick={handleGenerateAllianceInviteCode} disabled={allianceAction}>Create code</button>
                    </div>
                    <UserPicker
                      filteredProfiles={allianceInviteProfiles}
                      selectedUserIds={inviteUserIds}
                      setUserSearch={setUserSearch}
                      title="Invite users"
                      toggleUser={(uid) => toggleSelectedUser(uid, setInviteUserIds)}
                      userSearch={userSearch}
                    />
                    <button className="user-auth-secondary" type="button" onClick={handleAddAllianceMembers} disabled={!inviteUserIds.length || allianceAction}>
                      <UserPlus size={17} /> Add
                    </button>
                    <div className="chat-user-picker">
                      <label>Join requests</label>
                      <div className="chat-user-options">
                        {pendingAllianceRequests.length ? pendingAllianceRequests.map((request) => (
                          <div className="chat-member-row" key={request.uid} translate="no">
                            <span>{request.senderLabel || request.displayName || 'Player'}</span>
                            <button type="button" onClick={() => handleApproveAllianceRequest(request.uid)} disabled={allianceAction}>Approve</button>
                            <button type="button" onClick={() => handleRejectAllianceRequest(request.uid)} disabled={allianceAction}>Reject</button>
                          </div>
                        )) : <p>No pending requests.</p>}
                      </div>
                    </div>
                  </>
                ) : null}

                {alliancePanel === 'settings' && canManageAllianceActiveRoom ? (
                  <>
                    <div>
                      <h3><Settings size={17} /> Settings</h3>
                      <p>{isAllianceSubRoomActive ? 'Set the sub chat type. Roles are managed in the main alliance chat.' : 'Give owner/admin rights or remove members.'}</p>
                    </div>
                    {isAllianceSubRoomActive ? (
                      <div className="chat-subroom-setting">
                        <label htmlFor="alliance-subroom-audience">Sub chat type</label>
                        <select id="alliance-subroom-audience" value={activeRoom.audience === 'leaders' ? 'leaders' : 'members'} onChange={(event) => handleSetAllianceSubRoomAudience(event.target.value)} disabled={allianceAction}>
                          <option value="members">Member chat</option>
                          <option value="leaders">Leader Chat</option>
                        </select>
                      </div>
                    ) : null}
                    {isMainAllianceRoomActive ? (
                      <div className="chat-user-picker">
                        <label>Permissions</label>
                        <div className="chat-user-options">
                          {allianceMemberProfiles.length ? allianceMemberProfiles.map((member) => {
                            const role = allianceManagementRoom.memberRoles?.[member.uid] || 'member';
                            const isSystemOwner = allianceManagementRoom.ownerUid === member.uid;
                            return (
                              <div className="chat-member-row" key={member.uid} translate="no">
                                <span>{formatUserOption(member)} - {isSystemOwner ? 'owner' : role}</span>
                                {canChangeAllianceRoles && !isSystemOwner ? (
                                  <>
                                    <button type="button" onClick={() => handleSetAllianceRole(member.uid, role === 'owner' ? 'member' : 'owner')} disabled={allianceAction}>
                                      {role === 'owner' ? 'Remove owner' : 'Make owner'}
                                    </button>
                                    <button type="button" onClick={() => handleSetAllianceRole(member.uid, role === 'admin' ? 'member' : 'admin')} disabled={allianceAction}>
                                      {role === 'admin' ? 'Remove admin' : 'Make admin'}
                                    </button>
                                  </>
                                ) : null}
                                {!isSystemOwner ? <button type="button" onClick={() => handleRemoveAllianceMember(member.uid)} disabled={allianceAction}>Remove</button> : null}
                              </div>
                            );
                          }) : <p>No members loaded yet.</p>}
                          {allianceMemberProfiles.length > 0 && allianceMemberProfiles.every((member) => allianceManagementRoom.ownerUid === member.uid) ? (
                            <p>There is no other member you can make owner/admin yet. Invite someone or approve a join request first.</p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {alliancePanel === 'members' ? (
                  <>
                    <div>
                      <h3><Users size={17} /> Members</h3>
                      <p>Approved members.</p>
                    </div>
                    <div className="chat-member-list" translate="no">
                      {allianceMemberProfiles.length ? allianceMemberProfiles.map((member) => (
                        <span className="chat-member-pill" key={member.uid}>
                          <span className={member.photoURL ? 'chat-member-pill-avatar has-photo' : 'chat-member-pill-avatar'}>
                            {member.photoURL ? <img src={member.photoURL} alt="" /> : String(member.displayName || 'P').trim().slice(0, 1).toUpperCase()}
                          </span>
                          <strong>{member.displayName || 'Player'}</strong>
                        </span>
                      )) : <span>No members loaded yet.</span>}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {(activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') && !canUseActiveRoom ? (
              <div className="chat-invite-panel">
                <div>
                  <h3><ShieldCheck size={17} /> Protected alliance chat</h3>
                  <p>
                    {allianceAccessState === 'canCreate'
                      ? 'This alliance chat does not exist yet. Create it only if you should manage access for this alliance.'
                      : allianceAccessState === 'pending'
                        ? 'Your join request is waiting for an alliance chat owner or admin.'
                        : allianceAccessState === 'profileMismatch'
                          ? 'Your profile server or alliance tag does not match this chat.'
                          : 'Only approved members can read or write in this alliance chat.'}
                  </p>
                </div>
                {allianceAccessState === 'canCreate' ? (
                  <button className="user-auth-primary" type="button" onClick={handleCreateAllianceChat} disabled={allianceAction}>
                    <ShieldCheck size={17} /> {allianceAction ? 'Creating...' : 'Create alliance chat'}
                  </button>
                ) : null}
                {allianceAccessState === 'canRequest' ? (
                  <button className="user-auth-primary" type="button" onClick={handleRequestAllianceAccess} disabled={allianceAction}>
                    <UserPlus size={17} /> {allianceAction ? 'Sending...' : 'Request access'}
                  </button>
                ) : null}
                {allianceAccessState !== 'canCreate' ? (
                  <form className="chat-invite-code-form" onSubmit={handleJoinAllianceByInviteCode}>
                    <label htmlFor="alliance-invite-code">Invite code</label>
                    <div>
                      <input
                        id="alliance-invite-code"
                        maxLength={12}
                        onChange={(event) => setAllianceInviteCode(event.target.value.toUpperCase())}
                        placeholder="CODE"
                        type="text"
                        value={allianceInviteCode}
                      />
                      <button className="user-auth-secondary" type="submit" disabled={!allianceInviteCode.trim() || allianceAction}>
                        Join
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            ) : null}

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

            {canUseActiveRoom ? <div className="chat-message-list" ref={listRef} aria-live="polite">
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
            </div> : null}

            {status ? <strong className="chat-status">{status}</strong> : null}

            {canUseActiveRoom ? <form className="chat-compose" onSubmit={handleSubmit}>
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
            </form> : null}
          </main>
        </div>
      </div>
    </section>
  );
}























