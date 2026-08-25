import { ArrowLeft, Ban, Bell, BellOff, ImagePlus, LockKeyhole, MessageCircle, Plus, Search, Send, Settings, ShieldCheck, SmilePlus, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../features/auth/authService.js';
import { chatService } from '../features/chat/chatService.js';
import { uploadChatImageToR2 } from '../services/chatImages.js';
import { friendService } from '../services/friendService.js';
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
const deleteConfirmationWords = ['delete', 'loeschen', 'loschen', 'löschen'];
const isDeleteConfirmationWord = (value) => deleteConfirmationWords.includes(String(value || '').trim().toLowerCase());

const getTimestampValue = (timestamp) => timestamp?.toMillis?.() || 0;
const getDirectPrivateKeyForUsers = (firstUid, secondUid) => [firstUid, secondUid].filter(Boolean).sort().join('_');
const getDirectRoomOtherUid = (room, uid) => Object.keys(room?.memberUids || {}).find((memberUid) => memberUid !== uid) || '';

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

const getStoredGlobalNotifications = (uid) => {
  if (typeof window === 'undefined' || !uid) return true;
  return window.localStorage.getItem(`tiles-survive-global-notifications-${uid}`) !== 'off';
};

const storeGlobalNotifications = (uid, enabled) => {
  if (typeof window === 'undefined' || !uid) return;
  window.localStorage.setItem(`tiles-survive-global-notifications-${uid}`, enabled ? 'on' : 'off');
};

const getStoredIgnoredUsers = (uid) => {
  if (typeof window === 'undefined' || !uid) return {};

  try {
    return JSON.parse(window.localStorage.getItem(`tiles-survive-chat-ignored-${uid}`) || '{}');
  } catch {
    return {};
  }
};

const storeIgnoredUsers = (uid, ignoredUsers) => {
  if (typeof window === 'undefined' || !uid) return;
  window.localStorage.setItem(`tiles-survive-chat-ignored-${uid}`, JSON.stringify(ignoredUsers));
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
        {filteredProfiles.length ? filteredProfiles.map((profile) => {
          const displayName = profile.displayName || 'Player';
          const server = profile.gameServer ? `#${profile.gameServer}` : '';
          const alliance = profile.allianceTag ? `[${profile.allianceTag}]` : '';
          const meta = [server, alliance].filter(Boolean).join(' ');
          const initial = String(displayName).trim().slice(0, 1).toUpperCase();

          return (
            <button
              className={selectedUserIds.includes(profile.uid) ? 'is-selected' : ''}
              key={profile.uid}
              type="button"
              onClick={() => toggleUser(profile.uid)}
              translate="no"
            >
              <span className={profile.photoURL ? 'chat-picker-avatar has-photo' : 'chat-picker-avatar'}>
                {profile.photoURL ? <img src={profile.photoURL} alt="" /> : initial}
              </span>
              <span className="chat-picker-user-copy">
                <strong>{displayName}</strong>
                {meta ? <small>{meta}</small> : null}
              </span>
            </button>
          );
        }) : <p>No users found.</p>}
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(() => getStoredChatLanguage());
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [readByRoom, setReadByRoom] = useState(() => getStoredReadState(authService.getCurrentUser()?.uid));
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] = useState(() => getStoredGlobalNotifications(authService.getCurrentUser()?.uid));
  const [ignoredUsers, setIgnoredUsers] = useState(() => getStoredIgnoredUsers(authService.getCurrentUser()?.uid));
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [friendAction, setFriendAction] = useState('');
  const [memberAction, setMemberAction] = useState('');
  const [muteMinutes, setMuteMinutes] = useState('15');
  const [muteHours, setMuteHours] = useState('');
  const [pendingDirectPrivateRoomId, setPendingDirectPrivateRoomId] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [privateTitle, setPrivateTitle] = useState('');
  const [privateSettingsTitle, setPrivateSettingsTitle] = useState('');
  const [privateSettingsInvitePolicy, setPrivateSettingsInvitePolicy] = useState('ownerOnly');
  const [invitePolicy, setInvitePolicy] = useState('ownerOnly');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [inviteUserIds, setInviteUserIds] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [allianceAction, setAllianceAction] = useState(false);
  const [allianceInviteCode, setAllianceInviteCode] = useState('');
  const [allianceChatName, setAllianceChatName] = useState('');
  const [allianceRoleName, setAllianceRoleName] = useState('');
  const [allianceRolePermission, setAllianceRolePermission] = useState('member');
  const [allianceDeleteConfirmation, setAllianceDeleteConfirmation] = useState('');
  const [roomCategory, setRoomCategory] = useState('alliance');
  const [roomListOpen, setRoomListOpen] = useState(true);
  const [globalPanel, setGlobalPanel] = useState('');
  const [alliancePanel, setAlliancePanel] = useState('');
  const [privatePanel, setPrivatePanel] = useState('');
  const [privateBuilderOpen, setPrivateBuilderOpen] = useState(false);
  const [allianceSubBuilderOpen, setAllianceSubBuilderOpen] = useState(false);
  const [allianceSubTitle, setAllianceSubTitle] = useState('');
  const [draggedAllianceSubRoomId, setDraggedAllianceSubRoomId] = useState('');
  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);

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
    setGlobalNotificationsEnabled(getStoredGlobalNotifications(user?.uid));
    setIgnoredUsers(getStoredIgnoredUsers(user?.uid));
    setSelectedChatUser(null);
    setFriendAction('');
    setPendingDirectPrivateRoomId('');
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
  const activeRoomFallback = roomCategory === 'private' && activeRoomId !== 'global' ? {
    id: activeRoomId,
    type: 'private',
    title: 'Private Chat',
    ownerUid: user?.uid,
    memberUids: user?.uid ? { [user.uid]: true } : {},
    memberPermissions: user?.uid ? { [user.uid]: { canInvite: true, canKick: true } } : {},
  } : liveGlobalRoom;
  const activeRoom = rooms.find((room) => room.id === activeRoomId) || activeRoomFallback;
  const isCreatePanelOpen = privateBuilderOpen || allianceSubBuilderOpen;
  const isRoomPanelOpen = Boolean(globalPanel || alliancePanel || privatePanel);
  const hasActiveChatRoom = Boolean(activeRoom?.id) && !isCreatePanelOpen && !isRoomPanelOpen;
  const allianceAccessState = chatService.getAllianceAccessState(liveAllianceRoom || allianceRoom, user, profile);
  const canUseActiveRoom = chatService.canUseRoom(activeRoom, user, profile);
  const canWriteActiveRoom = chatService.canWriteRoom(activeRoom, user, profile);
  const isDirectPrivateRoom = activeRoom?.isDirectPrivate === true || activeRoom?.id === pendingDirectPrivateRoomId;
  const canInviteActiveRoom = !isDirectPrivateRoom && chatService.canInviteToRoom(activeRoom, user);
  const canKickActiveRoom = !isDirectPrivateRoom && chatService.canKickFromRoom(activeRoom, user);
  const selectedDirectPrivateRoom = useMemo(() => {
    if (!user?.uid || !selectedChatUser?.uid) return null;
    const directKey = getDirectPrivateKeyForUsers(user.uid, selectedChatUser.uid);
    return privateRooms.find((room) => room.isDirectPrivate === true && room.directKey === directKey) || null;
  }, [privateRooms, selectedChatUser?.uid, user?.uid]);
  const canDeleteActiveRoom = !isDirectPrivateRoom && chatService.canDeleteRoom(activeRoom, user);
  const allianceManagementRoom = (activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') && liveAllianceRoom ? liveAllianceRoom : activeRoom;
  const canManageAllianceActiveRoom = chatService.canManageAllianceRoom(allianceManagementRoom, user);
  const canChangeAllianceRoles = chatService.canChangeAllianceRoles(allianceManagementRoom, user);
  const canCreateAllianceSubRoom = chatService.canCreateAllianceSubRoom(liveAllianceRoom, user);
  const canDeleteAllianceActiveRoom = chatService.canDeleteAllianceRoom(allianceManagementRoom, user);
  const allianceRoleOptions = useMemo(() => [
    { id: 'member', name: 'Member', permission: 'member', system: true },
    { id: 'admin', name: 'Admin', permission: 'admin', system: true },
    { id: 'owner', name: 'Owner', permission: 'owner', system: true },
    ...Object.entries(allianceManagementRoom.allianceRoles || {})
      .map(([id, role]) => ({
        id,
        name: String(role?.name || id).trim() || id,
        permission: role?.permission === 'owner' ? 'owner' : role?.permission === 'admin' ? 'admin' : 'member',
        system: false,
      }))
      .sort((first, second) => first.name.localeCompare(second.name)),
  ], [allianceManagementRoom.allianceRoles]);
  const getAllianceRoleOption = (roleId) => allianceRoleOptions.find((role) => role.id === roleId) || allianceRoleOptions[0];
  const getAllianceMessageAuthor = (message) => {
    if (activeRoom.type !== 'alliance' && activeRoom.type !== 'allianceSub') {
      return message.senderLabel || message.displayName || 'Player';
    }

    const roleId = allianceManagementRoom.memberRoles?.[message.uid] || (allianceManagementRoom.ownerUid === message.uid ? 'owner' : 'member');
    const roleName = getAllianceRoleOption(roleId).name || 'Member';
    const profileName = String(message.displayName || 'Player').trim() || 'Player';
    return `${roleName} ${profileName}`;
  };
  const allianceSubRoomLimitReached = allianceSubRooms.length >= 5;
  const isAllianceRoomActive = activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub';
  const isMainAllianceRoomActive = activeRoom.type === 'alliance';
  const isAllianceSubRoomActive = activeRoom.type === 'allianceSub';
  const canConfirmAllianceDelete = isDeleteConfirmationWord(allianceDeleteConfirmation);

  useEffect(() => {
    if (!activeRoomId) return;

    if (!rooms.some((room) => room.id === activeRoomId)) {
      setActiveRoomId(roomCategory === 'private' ? '' : 'global');
    }
  }, [activeRoomId, roomCategory, rooms]);
  useEffect(() => {
    if (roomCategory === 'alliance' && liveAllianceRoom && activeRoom.type !== 'alliance' && activeRoom.type !== 'allianceSub') {
      setActiveRoomId(liveAllianceRoom.id);
      return;
    }

    if (roomCategory === 'global' && activeRoomId !== 'global') {
      setActiveRoomId('global');
      return;
    }
  }, [activeRoom.type, activeRoomId, liveAllianceRoom, roomCategory]);

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
    if (activeRoom?.type === 'alliance' || activeRoom?.type === 'allianceSub') {
      setAllianceChatName(activeRoom.title || '');
    } else {
      setAllianceChatName('');
    }
    setAllianceDeleteConfirmation('');
  }, [activeRoom?.id, activeRoom?.title, activeRoom?.type]);
  useEffect(() => {
    if (activeRoom?.type === 'private') {
      setPrivateSettingsTitle(activeRoom.title || '');
      setPrivateSettingsInvitePolicy(activeRoom.invitePolicy === 'allMembers' ? 'allMembers' : 'ownerOnly');
    } else {
      setPrivatePanel('');
      setPrivateSettingsTitle('');
      setPrivateSettingsInvitePolicy('ownerOnly');
    }
  }, [activeRoom?.id, activeRoom?.invitePolicy, activeRoom?.title, activeRoom?.type]);

  useLayoutEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, activeRoom?.id]);

  useEffect(() => () => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }
  }, [selectedImagePreview]);

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
  const canSubmitMessage = Boolean(trimmedDraft || selectedImage);
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
  const visibleMessages = useMemo(() => messages.filter((message) => (
    message.type === 'system' || !message.uid || message.uid === user?.uid || ignoredUsers[message.uid] !== true
  )), [ignoredUsers, messages, user?.uid]);
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
  const filteredAllianceMemberProfiles = useMemo(() => {
    const searchValue = memberSearch.trim().toLowerCase();
    return searchValue
      ? allianceMemberProfiles.filter((item) => getSearchText(item).includes(searchValue))
      : allianceMemberProfiles;
  }, [allianceMemberProfiles, memberSearch]);
  const filteredActiveRoomMemberProfiles = useMemo(() => {
    const searchValue = memberSearch.trim().toLowerCase();
    return searchValue
      ? activeRoomMemberProfiles.filter((item) => getSearchText(item).includes(searchValue))
      : activeRoomMemberProfiles;
  }, [activeRoomMemberProfiles, memberSearch]);

  const getDirectRoomOtherProfile = (room) => {
    if (room?.isDirectPrivate !== true || !user?.uid) return null;

    const otherUid = getDirectRoomOtherUid(room, user.uid);
    const otherProfile = allVisibleProfiles.find((item) => item.uid === otherUid);
    return otherProfile || {
      uid: otherUid,
      displayName: room.directMemberNames?.[otherUid] || room.title || 'Player',
      photoURL: '',
    };
  };

  const getRoomDisplayTitle = (room) => {
    const directProfile = getDirectRoomOtherProfile(room);
    if (directProfile) {
      return directProfile.displayName || room.title || 'Private Chat';
    }

    return room?.title || 'Private Chat';
  };

  const activeRoomDisplayTitle = getRoomDisplayTitle(activeRoom);

  const filteredProfiles = useMemo(() => {
    const searchValue = userSearch.trim().toLowerCase();
    const profiles = searchValue
      ? publicProfiles.filter((item) => getSearchText(item).includes(searchValue))
      : publicProfiles;
    return profiles.slice(0, 18);
  }, [userSearch, publicProfiles]);
  const privateInviteProfiles = useMemo(() => {
    const searchValue = userSearch.trim().toLowerCase();
    const profiles = publicProfiles.filter((item) => {
      const isMember = activeRoom.type === 'private' && activeRoom.memberUids?.[item.uid] === true;
      const matchesSearch = !searchValue || getSearchText(item).includes(searchValue);
      return !isMember && matchesSearch;
    });
    return profiles.slice(0, 18);
  }, [activeRoom, publicProfiles, userSearch]);

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

  const handleCreateAllianceSubRoom = async (event) => {
    event.preventDefault();
    const cleanedTitle = allianceSubTitle.trim();
    if (!cleanedTitle) {
      setStatusTone('error');
      setStatus('Enter a sub chat name first.');
      return;
    }

    setStatus('');
    setStatusTone('info');
    setAllianceAction(true);

    try {
      const roomId = await chatService.createAllianceSubRoom(liveAllianceRoom, cleanedTitle);
      setAllianceSubRooms((current) => current.some((room) => room.id === roomId)
        ? current
        : [...current, {
          ...liveAllianceRoom,
          id: roomId,
          type: 'allianceSub',
          parentRoomId: liveAllianceRoom.id,
          title: cleanedTitle,
          order: current.length + 1,
        }]);
      setAllianceSubTitle('');
      setAllianceSubBuilderOpen(false);
      setActiveRoomId(roomId);
      setStatus('Alliance sub chat created.');
    } catch (error) {
      setStatus(error.message || 'Alliance sub chat could not be created.');
    } finally {
      setAllianceAction(false);
    }
  };
  const handleAllianceSubRoomDrop = async (targetRoomId) => {
    if (!draggedAllianceSubRoomId || draggedAllianceSubRoomId === targetRoomId || !liveAllianceRoom?.id || !canCreateAllianceSubRoom) {
      setDraggedAllianceSubRoomId('');
      return;
    }

    const currentIndex = allianceSubRooms.findIndex((room) => room.id === draggedAllianceSubRoomId);
    const targetIndex = allianceSubRooms.findIndex((room) => room.id === targetRoomId);
    if (currentIndex < 0 || targetIndex < 0) {
      setDraggedAllianceSubRoomId('');
      return;
    }

    const nextRooms = [...allianceSubRooms];
    const [draggedRoom] = nextRooms.splice(currentIndex, 1);
    nextRooms.splice(targetIndex, 0, draggedRoom);
    const orderedRooms = nextRooms.map((room, index) => ({ ...room, order: index + 1 }));

    setDraggedAllianceSubRoomId('');
    setAllianceSubRooms(orderedRooms);
    setStatus('');
    setStatusTone('info');

    try {
      await chatService.reorderAllianceSubRooms(liveAllianceRoom.id, orderedRooms.map((room) => room.id));
      setStatusTone('success');
      setStatus('Sub chat order saved.');
    } catch (error) {
      setStatusTone('error');
      setStatus(error.message || 'Sub chat order could not be saved.');
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

  const handleSaveAllianceRole = async (event) => {
    event.preventDefault();
    const roleName = allianceRoleName.trim();
    if (!roleName) {
      setStatus('Enter a role name first.');
      return;
    }

    setStatus('');
    setAllianceAction(true);
    try {
      await chatService.setAllianceCustomRole(allianceManagementRoom.id, roleName, {
        name: roleName,
        permission: allianceRolePermission,
      });
      setAllianceRoleName('');
      setAllianceRolePermission('member');
      setStatus('Alliance role saved.');
    } catch (error) {
      setStatus(error.message || 'Alliance role could not be saved.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleDeleteAllianceRole = async (roleId) => {
    const role = getAllianceRoleOption(roleId);
    const confirmed = window.confirm('Delete role ' + role.name + '? Members with this role become Member.');
    if (!confirmed) return;

    setStatus('');
    setAllianceAction(true);
    try {
      await chatService.deleteAllianceCustomRole(allianceManagementRoom.id, roleId);
      setStatus('Alliance role deleted.');
    } catch (error) {
      setStatus(error.message || 'Alliance role could not be deleted.');
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

  const handleRenameAllianceChat = async (event) => {
    event.preventDefault();
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.renameAllianceRoom(activeRoom.id, allianceChatName);
      setStatus('Chat name updated.');
    } catch (error) {
      setStatus(error.message || 'Chat name could not be changed.');
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
    const cleanedTitle = privateTitle.trim();
    if (!cleanedTitle) {
      setStatusTone('error');
      setStatus('Enter a room name first.');
      return;
    }

    setStatus('');
    setStatusTone('info');
    setCreatingRoom(true);

    try {
      const roomId = await chatService.createPrivateRoom({
        title: cleanedTitle,
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
  const handleUpdatePrivateSettings = async (event) => {
    event.preventDefault();
    setStatus('');
    setCreatingRoom(true);

    try {
      await chatService.updatePrivateRoomSettings(activeRoom.id, {
        title: privateSettingsTitle,
        invitePolicy: privateSettingsInvitePolicy,
      });
      setStatus('Private chat settings saved.');
    } catch (error) {
      setStatus(error.message || 'Private chat settings could not be saved.');
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleSetPrivateMemberPermission = async (uid, nextPermissions) => {
    setStatus('');
    setCreatingRoom(true);

    try {
      await chatService.updatePrivateMemberPermissions(activeRoom.id, uid, nextPermissions);
      setStatus('Private member rights saved.');
    } catch (error) {
      setStatus(error.message || 'Private member rights could not be saved.');
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleRemovePrivateMember = async (uid) => {
    const member = activeRoomMemberProfiles.find((item) => item.uid === uid);
    const confirmed = window.confirm(`Remove ${member?.displayName || 'this member'} from this private chat?`);
    if (!confirmed) return;

    setStatus('');
    setCreatingRoom(true);

    try {
      await chatService.removeMemberFromPrivateRoom(activeRoom.id, uid);
      setStatus('Member removed from private chat.');
    } catch (error) {
      setStatus(error.message || 'Member could not be removed from private chat.');
    } finally {
      setCreatingRoom(false);
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

  const handleSetAllianceSubRoomWriteAccess = async (memberCanWrite) => {
    setStatus('');
    setAllianceAction(true);

    try {
      await chatService.setAllianceSubRoomWriteAccess(activeRoom.id, memberCanWrite);
      setAllianceSubRooms((current) => current.map((room) => room.id === activeRoom.id ? { ...room, memberCanWrite } : room));
      setStatus(memberCanWrite ? 'Members can now write in this sub chat.' : 'Members can now only read this sub chat.');
    } catch (error) {
      setStatus(error.message || 'Sub chat write setting could not be changed.');
    } finally {
      setAllianceAction(false);
    }
  };

  const handleDeleteAllianceRoom = async () => {
    if (!activeRoom?.id || (activeRoom.type !== 'alliance' && activeRoom.type !== 'allianceSub')) {
      return;
    }

    setStatus('');
    setAllianceAction(true);

    try {
      if (activeRoom.type === 'allianceSub') {
        await chatService.deleteAllianceSubRoom(activeRoom.id, allianceDeleteConfirmation);
        setAllianceSubRooms((current) => current.filter((room) => room.id !== activeRoom.id));
        setActiveRoomId(liveAllianceRoom?.id || 'global');
        setStatus('Alliance sub chat deleted.');
      } else {
        await chatService.deleteAllianceRoom(activeRoom.id, allianceDeleteConfirmation);
        setAllianceSubRooms([]);
        setActiveRoomId('global');
        setRoomCategory('global');
        setStatus('Alliance chat and all sub chats deleted.');
      }

      setAlliancePanel('');
      setAllianceDeleteConfirmation('');
      setMessages([]);
    } catch (error) {
      setStatus(error.message || 'Alliance chat could not be deleted.');
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

    if (!trimmedDraft && !selectedImage) {
      return;
    }

    setSending(true);
    try {
      const image = selectedImage
        ? {
          url: await uploadChatImageToR2({ file: selectedImage, roomId: activeRoom.id }),
          name: selectedImage.name,
          type: selectedImage.type,
          size: selectedImage.size,
        }
        : null;
      await chatService.sendMessage(activeRoom, trimmedDraft, image || undefined);
      setDraft('');
      setSelectedImage(null);
      setSelectedImagePreview('');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } catch (error) {
      setStatus(error.message || 'Message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  const handleSelectImage = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setStatus('Chat image must be smaller than 8 MB.');
      event.target.value = '';
      return;
    }

    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }

    setSelectedImage(file);
    setSelectedImagePreview(URL.createObjectURL(file));
    setStatus('');
  };

  const handleClearSelectedImage = () => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }
    setSelectedImage(null);
    setSelectedImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
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

  const handleToggleGlobalNotifications = () => {
    setGlobalNotificationsEnabled((current) => {
      const next = !current;
      storeGlobalNotifications(user?.uid, next);
      return next;
    });
  };

  const handleOpenChatUser = (message) => {
    if (!message?.uid || message.uid === '__system__') return;
    const profileItem = allVisibleProfiles.find((item) => item.uid === message.uid);
    setFriendAction('');
    setSelectedChatUser({
      uid: message.uid,
      displayName: profileItem?.displayName || message.displayName || message.senderLabel || 'Player',
      senderLabel: message.senderLabel || profileItem?.displayName || message.displayName || 'Player',
      gameServer: profileItem?.gameServer || '',
      allianceTag: profileItem?.allianceTag || '',
      photoURL: getMessagePhotoURL(message) || profileItem?.photoURL || '',
    });
  };

  const handleOpenMemberProfile = (profileItem) => {
    if (!profileItem?.uid) return;
    setFriendAction('');
    setMemberAction('');
    setSelectedChatUser({
      uid: profileItem.uid,
      displayName: profileItem.displayName || 'Player',
      senderLabel: formatUserOption(profileItem),
      gameServer: profileItem.gameServer || '',
      allianceTag: profileItem.allianceTag || '',
      photoURL: profileItem.photoURL || '',
    });
  };
  const handleToggleIgnoredUser = (uid) => {
    if (!uid || uid === user?.uid) return;

    setIgnoredUsers((current) => {
      const next = { ...current };
      if (next[uid]) {
        delete next[uid];
      } else {
        next[uid] = true;
      }
      storeIgnoredUsers(user?.uid, next);
      return next;
    });
    setSelectedChatUser(null);
  };


  const canManageSelectedAllianceMember = Boolean(
    selectedChatUser?.uid
      && selectedChatUser.uid !== user?.uid
      && (activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub')
      && canManageAllianceActiveRoom
      && allianceManagementRoom.memberUids?.[selectedChatUser.uid]
      && allianceManagementRoom.ownerUid !== selectedChatUser.uid,
  );
  const canKickSelectedPrivateMember = Boolean(
    selectedChatUser?.uid
      && selectedChatUser.uid !== user?.uid
      && activeRoom.type === 'private'
      && !isDirectPrivateRoom
      && canKickActiveRoom
      && activeRoom.memberUids?.[selectedChatUser.uid]
      && activeRoom.ownerUid !== selectedChatUser.uid,
  );
  const selectedAllianceMuteUntil = Number(selectedChatUser?.uid ? allianceManagementRoom.mutedUntilByUid?.[selectedChatUser.uid] || 0 : 0);
  const selectedAllianceMemberMuted = Boolean(selectedChatUser?.uid && (selectedAllianceMuteUntil > Date.now() || allianceManagementRoom.mutedUids?.[selectedChatUser.uid] === true));
  const formatAllianceMuteUntil = (timestamp) => {
    const value = Number(timestamp || 0);
    if (!value || value <= Date.now()) return '';
    return new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  };

  const handleManageRemoveSelectedMember = async () => {
    if (!selectedChatUser?.uid) return;
    setMemberAction('remove');
    try {
      if (canManageSelectedAllianceMember) {
        await handleRemoveAllianceMember(selectedChatUser.uid);
      } else if (canKickSelectedPrivateMember) {
        await handleRemovePrivateMember(selectedChatUser.uid);
      }
      setSelectedChatUser(null);
    } finally {
      setMemberAction('');
    }
  };

  const handleToggleSelectedAllianceMute = async () => {
    if (!canManageSelectedAllianceMember || !selectedChatUser?.uid) return;
    const hours = Math.max(0, Number(muteHours || 0));
    const minutes = Math.max(0, Number(muteMinutes || 0));
    const durationMinutes = Math.round((hours * 60) + minutes);
    if (!selectedAllianceMemberMuted && durationMinutes <= 0) {
      setStatus('Enter how long this member should be muted.');
      return;
    }

    setMemberAction('mute');
    try {
      await chatService.setAllianceMemberMuted(allianceManagementRoom.id, selectedChatUser.uid, {
        muted: !selectedAllianceMemberMuted,
        durationMinutes,
        displayName: selectedChatUser.displayName || selectedChatUser.senderLabel || 'Member',
      });
      setStatus(selectedAllianceMemberMuted ? 'Alliance member can write again.' : 'Alliance member muted.');
    } catch (error) {
      setStatus(error.message || 'Alliance member mute could not be changed.');
    } finally {
      setMemberAction('');
    }
  };

  const handleUnmuteAllianceMember = async (member) => {
    if (!canManageAllianceActiveRoom || !member?.uid) return;
    setMemberAction('unmute-' + member.uid);
    try {
      await chatService.setAllianceMemberMuted(allianceManagementRoom.id, member.uid, {
        muted: false,
        displayName: member.displayName || 'Member',
      });
      setStatus('Alliance member can write again.');
    } catch (error) {
      setStatus(error.message || 'Alliance member mute could not be removed.');
    } finally {
      setMemberAction('');
    }
  };
  const handleCreateDirectPrivateChat = async () => {
    if (!selectedChatUser?.uid || selectedChatUser.uid === user?.uid) return;

    setFriendAction('private-chat');
    try {
      const titleName = selectedChatUser.displayName || selectedChatUser.senderLabel || 'Private Chat';
      const roomId = await chatService.createOrOpenDirectPrivateRoom({
        targetUid: selectedChatUser.uid,
        targetName: titleName,
      });
      setRoomCategory('private');
      setActiveRoomId(roomId);
      setPendingDirectPrivateRoomId(roomId);
      setPrivatePanel('');
      setSelectedChatUser(null);
      setStatusTone('success');
      setStatus('Private chat opened.');
    } catch (error) {
      setStatusTone('error');
      setStatus(error?.message || 'Private chat could not be created.');
    } finally {
      setFriendAction('');
    }
  };

  const handleSendFriendRequest = async () => {
    if (!selectedChatUser?.uid || selectedChatUser.uid === user?.uid) return;

    setFriendAction('sending');
    try {
      await friendService.sendFriendRequest(selectedChatUser);
      setStatusTone('success');
      setStatus('Friend request sent.');
      setSelectedChatUser(null);
    } catch (error) {
      setStatusTone('error');
      setStatus(error?.message || 'Friend request could not be sent.');
    } finally {
      setFriendAction('');
    }
  };

  const hasUnreadMessages = (room) => {
    if (!room?.id || room.id === activeRoomId) return 0;
    if (room.id === 'global' && !globalNotificationsEnabled) return 0;
    const latest = getTimestampValue(room.lastMessageAt);
    return Boolean(latest && latest > (readByRoom[room.id] || 0));
  };

  const getRoomButtonClass = (room) => [
    'chat-room-button',
    activeRoomId === room?.id ? 'is-active' : '',
    hasUnreadMessages(room) ? 'has-unread' : '',
  ].filter(Boolean).join(' ');

  const totalUnreadRooms = rooms.filter((room) => hasUnreadMessages(room)).length;
  const isRoomDetailOpen = roomCategory === 'global' || (!roomListOpen && (Boolean(activeRoomId) || privateBuilderOpen || allianceSubBuilderOpen));

  const handleBackToRoomList = () => {
    setRoomListOpen(true);
    setGlobalPanel('');
    setAlliancePanel('');
    setPrivatePanel('');
    setPrivateBuilderOpen(false);
    setAllianceSubBuilderOpen(false);
    setSelectedChatUser(null);
  };

  const handleSelectRoomCategory = (category) => {
    setRoomCategory(category);
    setGlobalPanel('');
    setAlliancePanel('');
    setPrivatePanel('');
    setPrivateBuilderOpen(false);
    setAllianceSubBuilderOpen(false);
    setSelectedChatUser(null);
    setRoomListOpen(category !== 'global');

    if (category === 'private') {
      setActiveRoomId('');
      setMessages([]);
      return;
    }

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

        <div className="chat-room-tabs" role="tablist" aria-label="Chat areas">
          <button className={roomCategory === 'alliance' ? 'is-active' : ''} type="button" onClick={() => handleSelectRoomCategory('alliance')}>
            <ShieldCheck size={20} />
            <span>Alliance</span>
          </button>
          <button className={roomCategory === 'global' ? 'is-active' : ''} type="button" onClick={() => handleSelectRoomCategory('global')}>
            <MessageCircle size={20} />
            <span>Global</span>
            {hasUnreadMessages(liveGlobalRoom) ? <strong>{'!'}</strong> : null}
          </button>
          <button className={roomCategory === 'private' ? 'is-active' : ''} type="button" onClick={() => handleSelectRoomCategory('private')}>
            <LockKeyhole size={20} />
            <span>Private</span>
            {privateRooms.some((room) => hasUnreadMessages(room)) ? <strong>{privateRooms.filter((room) => hasUnreadMessages(room)).length}</strong> : null}
          </button>
        </div>
        <div className={[
          'chat-room-layout',
          roomCategory === 'global' ? 'is-global' : '',
          isRoomDetailOpen ? 'is-detail-open' : 'is-list-open',
        ].filter(Boolean).join(' ')}>
          {roomCategory !== 'global' ? <aside className="chat-room-sidebar">

            {roomCategory === 'alliance' ? (
              <div className="chat-room-group">
                <h2>Alliance</h2>
                {liveAllianceRoom ? (
                  <>
                    <button className={getRoomButtonClass(liveAllianceRoom)} type="button" onClick={() => { setActiveRoomId(liveAllianceRoom.id); setRoomListOpen(false); }}>
                      <ShieldCheck size={17} />
                      <span>{liveAllianceRoom.title}</span>
                      {hasUnreadMessages(liveAllianceRoom) ? <strong className="chat-unread-badge">New message</strong> : null}
                    </button>
                    <div className="chat-alliance-subrooms">
                      {allianceSubRooms.map((room) => (
                        <button
                          className={`${getRoomButtonClass(room)}${draggedAllianceSubRoomId === room.id ? ' is-dragging' : ''}`}
                          draggable={canCreateAllianceSubRoom}
                          key={room.id}
                          onClick={() => { setActiveRoomId(room.id); setRoomListOpen(false); }}
                          onDragEnd={() => setDraggedAllianceSubRoomId('')}
                          onDragOver={(event) => { if (canCreateAllianceSubRoom) event.preventDefault(); }}
                          onDragStart={(event) => {
                            if (!canCreateAllianceSubRoom) return;
                            setDraggedAllianceSubRoomId(room.id);
                            event.dataTransfer.effectAllowed = 'move';
                            event.dataTransfer.setData('text/plain', room.id);
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            handleAllianceSubRoomDrop(room.id);
                          }}
                          title={canCreateAllianceSubRoom ? 'Drag to reorder' : undefined}
                          type="button"
                        >
                          <MessageCircle size={15} />
                          <span>{room.title}</span>
                          {hasUnreadMessages(room) ? <strong className="chat-unread-badge">New message</strong> : null}
                        </button>
                      ))}
                      {canCreateAllianceSubRoom && !allianceSubRoomLimitReached ? (
                        <button className="chat-add-subroom-button" type="button" onClick={() => { setAllianceSubBuilderOpen(true); setAlliancePanel(''); setRoomListOpen(false); }} disabled={allianceAction} aria-label="Create alliance sub chat">
                          <Plus size={34} />
                        </button>
                      ) : null}
                      {canCreateAllianceSubRoom && allianceSubRoomLimitReached ? <small className="chat-subroom-limit">Maximum 5 sub chats</small> : null}
                    </div>
                  </>
                ) : allianceRoom ? (
                  <div className="chat-room-note">
                    <strong>{allianceRoom.title}</strong>
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


            {roomCategory === 'private' ? (
              <>
                <div className="chat-room-group chat-private-room-group">
                  <h2>Private</h2>
                  {!privateBuilderOpen ? (
                    <button className="chat-create-room-button chat-private-create-button" type="button" onClick={() => { setActiveRoomId(''); setMessages([]); setPrivateBuilderOpen(true); setPrivatePanel(''); setSelectedChatUser(null); setRoomListOpen(false); }}>
                      <Plus size={24} />
                      <span>New private chat</span>
                    </button>
                  ) : null}

                  <div className="chat-private-room-list">
                    {privateRooms.length ? privateRooms.map((room) => {
                      const directProfile = getDirectRoomOtherProfile(room);
                      const directInitial = String(directProfile?.displayName || 'P').trim().slice(0, 1).toUpperCase();
                      const memberCount = room.memberCount || Object.keys(room.memberUids || {}).length || 1;

                      return (
                        <button className={getRoomButtonClass(room)} key={room.id} type="button" onClick={() => { setActiveRoomId(room.id); setPrivateBuilderOpen(false); setPrivatePanel(''); setRoomListOpen(false); }}>
                          {directProfile ? (
                            <span className={directProfile.photoURL ? 'chat-room-direct-avatar has-photo' : 'chat-room-direct-avatar'} translate="no">
                              {directProfile.photoURL ? <img src={directProfile.photoURL} alt="" /> : directInitial}
                            </span>
                          ) : <LockKeyhole size={17} />}
                          <span>{getRoomDisplayTitle(room)}</span>
                          <small>{memberCount} members</small>
                          {hasUnreadMessages(room) ? <strong className="chat-unread-badge">New message</strong> : null}
                        </button>
                      );
                    }) : <p className="chat-room-note">No private chats yet.</p>}
                  </div>
                </div>
              </>
            ) : null}
          </aside> : null}

          <main className="chat-main-panel">
            <div className="chat-room-heading">
              {roomCategory !== 'global' && isRoomDetailOpen ? (
                <button className="chat-mobile-back-button" type="button" onClick={handleBackToRoomList} aria-label="Back to chat list">
                  <ArrowLeft size={17} />
                  <span>Chats</span>
                </button>
              ) : null}
              <div>
                <span>{activeRoom.type === 'global' ? 'Global chat' : activeRoom.type === 'alliance' ? 'Alliance chat' : activeRoom.type === 'allianceSub' ? 'Alliance sub chat' : 'Private chat'}</span>
                <h2>{privateBuilderOpen ? 'New private chat' : allianceSubBuilderOpen ? 'New alliance sub chat' : roomCategory === 'private' && !activeRoomId ? 'Private' : activeRoomDisplayTitle}</h2>
              </div>
              <div className="chat-room-heading-actions">
                {activeRoom.type === 'global' && canUseActiveRoom ? (
                  <button className={globalPanel === 'settings' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setGlobalPanel((current) => current === 'settings' ? '' : 'settings')}>
                    <Settings size={16} /> Settings
                  </button>
                ) : null}
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
                {activeRoom.type === 'private' && canUseActiveRoom && !isDirectPrivateRoom ? (
                  <>
                    {canDeleteActiveRoom ? (
                      <button className={privatePanel === 'settings' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setPrivatePanel((current) => current === 'settings' ? '' : 'settings')}>
                        <Settings size={16} /> Settings
                      </button>
                    ) : null}
                    {canInviteActiveRoom ? (
                      <button className={privatePanel === 'invite' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setPrivatePanel((current) => current === 'invite' ? '' : 'invite')}>
                        <UserPlus size={16} /> Invite
                      </button>
                    ) : null}
                    <button className={privatePanel === 'members' ? 'chat-heading-action is-active' : 'chat-heading-action'} type="button" onClick={() => setPrivatePanel((current) => current === 'members' ? '' : 'members')}>
                      <Users size={16} /> Members
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {selectedChatUser ? (
              <div className="chat-user-popover chat-member-profile-card">
                <button className="chat-user-popover-close" type="button" onClick={() => setSelectedChatUser(null)} aria-label="Close user actions">
                  <X size={20} />
                </button>
                <div className={selectedChatUser.photoURL ? 'chat-user-card-avatar has-photo' : 'chat-user-card-avatar'} translate="no">
                  {selectedChatUser.photoURL ? <img src={selectedChatUser.photoURL} alt="" /> : String(selectedChatUser.displayName || 'P').trim().slice(0, 1).toUpperCase()}
                </div>
                <div className="chat-user-card-info" translate="no">
                  <strong>{selectedChatUser.displayName || 'Player'}</strong>
                  <span>{selectedChatUser.allianceTag ? `[${selectedChatUser.allianceTag}]` : 'No alliance tag'}</span>
                  <span>{selectedChatUser.gameServer ? `#${selectedChatUser.gameServer}` : 'No server'}</span>
                </div>
                {selectedChatUser.uid !== user?.uid ? (
                  <div className="chat-user-card-actions">
                    <button className="chat-friend-request-button" type="button" onClick={handleSendFriendRequest} disabled={friendAction === 'sending' || friendAction === 'private-chat'}>
                      <UserPlus size={15} /> {friendAction === 'sending' ? 'Sending...' : 'Add friend'}
                    </button>
                    <button className="chat-create-private-button" type="button" onClick={handleCreateDirectPrivateChat} disabled={friendAction === 'sending' || friendAction === 'private-chat'}>
                      <MessageCircle size={15} /> {friendAction === 'private-chat' ? 'Opening...' : selectedDirectPrivateRoom ? 'Chat' : 'Create chat'}
                    </button>
                    <button className={ignoredUsers[selectedChatUser.uid] ? 'chat-ignore-button is-ignored' : 'chat-ignore-button'} type="button" onClick={() => handleToggleIgnoredUser(selectedChatUser.uid)}>
                      <Ban size={15} /> {ignoredUsers[selectedChatUser.uid] ? 'Stop ignoring' : 'Ignore person'}
                    </button>
                    {(canManageSelectedAllianceMember || canKickSelectedPrivateMember) ? (
                      <div className="chat-manage-actions">
                        <strong>Manage</strong>
                        {canManageSelectedAllianceMember ? (
                          <div className="chat-mute-duration-box">
                            {selectedAllianceMemberMuted ? (
                              <button className="chat-manage-button" type="button" onClick={handleToggleSelectedAllianceMute} disabled={memberAction === 'mute'}>
                                Unmute alliance member
                              </button>
                            ) : (
                              <>
                                <span>Mute duration</span>
                                <div className="chat-mute-duration-fields">
                                  <label>
                                    <input type="number" min="0" max="168" value={muteHours} onChange={(event) => setMuteHours(event.target.value)} />
                                    <span>Hours</span>
                                  </label>
                                  <label>
                                    <input type="number" min="0" max="59" value={muteMinutes} onChange={(event) => setMuteMinutes(event.target.value)} />
                                    <span>Minutes</span>
                                  </label>
                                </div>
                                <button className="chat-manage-button" type="button" onClick={handleToggleSelectedAllianceMute} disabled={memberAction === 'mute'}>
                                  Mute alliance member
                                </button>
                              </>
                            )}
                          </div>
                        ) : null}
                        <button className="chat-manage-button is-danger" type="button" onClick={handleManageRemoveSelectedMember} disabled={memberAction === 'remove'}>
                          {canManageSelectedAllianceMember ? 'Remove from alliance' : 'Kick from private chat'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
            {activeRoom.type === 'global' && canUseActiveRoom && globalPanel === 'settings' ? (
              <div className="chat-alliance-panel chat-room-panel-full">
                <div>
                  <h3><Settings size={17} /> Global settings</h3>
                  <p>Control notifications for the global chat.</p>
                </div>
                <button className={globalNotificationsEnabled ? 'chat-notification-toggle is-on' : 'chat-notification-toggle'} type="button" onClick={handleToggleGlobalNotifications}>
                  {globalNotificationsEnabled ? <Bell size={17} /> : <BellOff size={17} />}
                  <span>{globalNotificationsEnabled ? 'Global notifications on' : 'Global notifications off'}</span>
                </button>
              </div>
            ) : null}

            {(activeRoom.type === 'alliance' || activeRoom.type === 'allianceSub') && canUseActiveRoom && alliancePanel ? (
              <div className="chat-alliance-panel chat-room-panel-full">
                {alliancePanel === 'invite' && canManageAllianceActiveRoom ? (
                  <>
                    <div>
                      <h3><UserPlus size={17} /> Invite</h3>
                      <p>Add users directly, approve join requests, or create an invite code.</p>
                    </div>
                    <div className="chat-invite-code-box">
                      <span>Invite code</span>
                      {allianceManagementRoom.inviteCode ? (
                        <strong translate="no">{allianceManagementRoom.inviteCode}</strong>
                      ) : (
                        <strong>None created yet</strong>
                      )}
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
                          <div className="chat-member-row" key={request.uid}>
                            <span translate="no">{request.senderLabel || request.displayName || 'Player'}</span>
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
                    <form className="chat-name-setting" onSubmit={handleRenameAllianceChat}>
                      <label htmlFor="alliance-chat-name">Chat name</label>
                      <div>
                        <input
                          id="alliance-chat-name"
                          maxLength={60}
                          onChange={(event) => setAllianceChatName(event.target.value)}
                          placeholder={activeRoom.title || 'Alliance chat'}
                          type="text"
                          value={allianceChatName}
                        />
                        <button type="submit" disabled={allianceAction || !allianceChatName.trim() || allianceChatName.trim() === (activeRoom.title || '').trim()}>
                          Save
                        </button>
                      </div>
                    </form>
                    {isAllianceSubRoomActive ? (
                      <>
                        <div className="chat-subroom-setting">
                          <label htmlFor="alliance-subroom-audience">Sub chat type</label>
                          <select id="alliance-subroom-audience" value={activeRoom.audience === 'leaders' ? 'leaders' : 'members'} onChange={(event) => handleSetAllianceSubRoomAudience(event.target.value)} disabled={allianceAction}>
                            <option value="members">Member chat</option>
                            <option value="leaders">Leader chat</option>
                          </select>
                        </div>
                        <div className="chat-subroom-setting">
                          <label htmlFor="alliance-subroom-writing">Member writing</label>
                          <select id="alliance-subroom-writing" value={activeRoom.memberCanWrite === false ? 'readOnly' : 'canWrite'} onChange={(event) => handleSetAllianceSubRoomWriteAccess(event.target.value === 'canWrite')} disabled={allianceAction}>
                            <option value="canWrite">Members can write</option>
                            <option value="readOnly">Members can only read</option>
                          </select>
                        </div>
                      </>
                    ) : null}
                    {isMainAllianceRoomActive && canChangeAllianceRoles ? (
                      <div className="chat-role-manager">
                        <div>
                          <h3><ShieldCheck size={17} /> Roles</h3>
                          <p>Create alliance roles and choose whether the role acts as Owner, Admin, or Member.</p>
                        </div>
                        <form className="chat-role-form" onSubmit={handleSaveAllianceRole}>
                          <input type="text" value={allianceRoleName} onChange={(event) => setAllianceRoleName(event.target.value)} placeholder="Role name" maxLength={32} />
                          <select value={allianceRolePermission} onChange={(event) => setAllianceRolePermission(event.target.value)}>
                            <option value="member">Member rights</option>
                            <option value="admin">Admin rights</option>
                            <option value="owner">Owner rights</option>
                          </select>
                          <button type="submit" disabled={allianceAction || !allianceRoleName.trim()}>Save role</button>
                        </form>
                        <div className="chat-role-list">
                          {allianceRoleOptions.filter((role) => !role.system).length ? allianceRoleOptions.filter((role) => !role.system).map((role) => (
                            <div className="chat-role-item" key={role.id}>
                              <span translate="no">{role.name}</span>
                              <small>{role.permission === 'owner' ? 'Owner rights' : role.permission === 'admin' ? 'Admin rights' : 'Member rights'}</small>
                              <button type="button" onClick={() => { setAllianceRoleName(role.name); setAllianceRolePermission(role.permission); }} disabled={allianceAction}>Edit</button>
                              <button type="button" onClick={() => handleDeleteAllianceRole(role.id)} disabled={allianceAction}>Delete</button>
                            </div>
                          )) : <p>No custom roles yet.</p>}
                        </div>
                      </div>
                    ) : null}

                    {isMainAllianceRoomActive ? (
                      <div className="chat-user-picker">
                        <label>Permissions</label>
                        <div className="chat-user-options">
                          {allianceMemberProfiles.length ? allianceMemberProfiles.map((member) => {
                            const isSystemOwner = allianceManagementRoom.ownerUid === member.uid;
                            const role = allianceManagementRoom.memberRoles?.[member.uid] || (isSystemOwner ? 'owner' : 'member');
                            const roleOption = getAllianceRoleOption(role);
                            const muteUntilLabel = formatAllianceMuteUntil(allianceManagementRoom.mutedUntilByUid?.[member.uid]);
                            return (
                              <div className="chat-member-row" key={member.uid}>
                                <span translate="no">{formatUserOption(member)} - {roleOption.name}{isSystemOwner ? ' (chat owner)' : ' (' + roleOption.permission + ')'}{muteUntilLabel ? ' - muted until ' + muteUntilLabel : ''}</span>
                                {muteUntilLabel && !isSystemOwner ? <button type="button" onClick={() => handleUnmuteAllianceMember(member)} disabled={allianceAction || memberAction === 'unmute-' + member.uid}>Unmute</button> : null}
                                {canChangeAllianceRoles ? (
                                  <select value={role} onChange={(event) => handleSetAllianceRole(member.uid, event.target.value)} disabled={allianceAction}>
                                    {allianceRoleOptions.map((roleOptionItem) => (
                                      <option key={roleOptionItem.id} value={roleOptionItem.id}>{roleOptionItem.name} - {roleOptionItem.permission}</option>
                                    ))}
                                  </select>
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
                    {canDeleteAllianceActiveRoom ? (
                      <div className="chat-danger-zone">
                        <div>
                          <h4><Trash2 size={17} /> {isMainAllianceRoomActive ? 'Delete alliance chat' : 'Delete sub chat'}</h4>
                          <p>
                            {isMainAllianceRoomActive
                              ? 'This deletes the main alliance chat, all sub chats, every message, invite code, join request, and all chat memberships for this alliance.'
                              : 'This deletes only this sub chat and its messages. The main alliance chat and other sub chats stay untouched.'}
                          </p>
                        </div>
                        <label htmlFor="alliance-delete-confirmation">Type Delete or Löschen to confirm</label>
                        <div>
                          <input
                            id="alliance-delete-confirmation"
                            onChange={(event) => setAllianceDeleteConfirmation(event.target.value)}
                            placeholder="Delete"
                            type="text"
                            value={allianceDeleteConfirmation}
                          />
                          <button type="button" onClick={handleDeleteAllianceRoom} disabled={allianceAction || !canConfirmAllianceDelete}>
                            <Trash2 size={16} /> Accept
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {alliancePanel === 'members' ? (
                  <>
                    <div>
                      <h3><Users size={17} /> Members</h3>
                      <p>{allianceMemberProfiles.length} members.</p>
                    </div>
                    <div className="chat-member-tools">
                      <label className="chat-user-search" htmlFor="alliance-member-search">
                        <Search size={16} />
                        <input id="alliance-member-search" onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search members" type="search" value={memberSearch} />
                      </label>
                      <span>{filteredAllianceMemberProfiles.length} / {allianceMemberProfiles.length}</span>
                    </div>
                    <div className="chat-member-list is-compact">
                      {filteredAllianceMemberProfiles.length ? filteredAllianceMemberProfiles.map((member) => (
                        <button className="chat-member-pill" key={member.uid} type="button" onClick={() => handleOpenMemberProfile(member)} translate="no">
                          <span className={member.photoURL ? 'chat-member-pill-avatar has-photo' : 'chat-member-pill-avatar'}>
                            {member.photoURL ? <img src={member.photoURL} alt="" /> : String(member.displayName || 'P').trim().slice(0, 1).toUpperCase()}
                          </span>
                          <strong>{member.displayName || 'Player'}</strong>
                        </button>
                      )) : <span>{allianceMemberProfiles.length ? 'No matching members.' : 'No members loaded yet.'}</span>}
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

            {activeRoom.type === 'private' && canUseActiveRoom && !isDirectPrivateRoom && privatePanel ? (
              <div className="chat-alliance-panel chat-room-panel-full">
                {privatePanel === 'settings' && canDeleteActiveRoom ? (
                  <>
                    <div>
                      <h3><Settings size={17} /> Settings</h3>
                      <p>Change the private chat name or invite rule.</p>
                    </div>
                    <form className="chat-name-setting" onSubmit={handleUpdatePrivateSettings}>
                      <label htmlFor="private-settings-title">Chat name</label>
                      <div>
                        <input
                          id="private-settings-title"
                          maxLength={60}
                          onChange={(event) => setPrivateSettingsTitle(event.target.value)}
                          placeholder={activeRoom.title || 'Private Chat'}
                          type="text"
                          value={privateSettingsTitle}
                        />
                        <button type="submit" disabled={creatingRoom || (!privateSettingsTitle.trim() && privateSettingsInvitePolicy === activeRoom.invitePolicy)}>
                          Save
                        </button>
                      </div>
                    </form>
                    <div className="chat-user-picker">
                      <label>Member rights</label>
                      <div className="chat-member-tools">
                        <label className="chat-user-search" htmlFor="private-rights-member-search">
                          <Search size={16} />
                          <input id="private-rights-member-search" onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search members" type="search" value={memberSearch} />
                        </label>
                        <span>{filteredActiveRoomMemberProfiles.length} / {activeRoomMemberProfiles.length}</span>
                      </div>
                      <div className="chat-user-options">
                        {filteredActiveRoomMemberProfiles.length ? filteredActiveRoomMemberProfiles.map((member) => {
                          const permissions = activeRoom.memberPermissions?.[member.uid] || {};
                          const isCreator = activeRoom.ownerUid === member.uid;
                          return (
                            <div className="chat-member-row" key={member.uid}>
                              <span translate="no">{member.displayName || 'Player'}{isCreator ? ' - creator' : ''}</span>
                              {!isCreator ? (
                                <>
                                  <button type="button" onClick={() => handleSetPrivateMemberPermission(member.uid, { ...permissions, canInvite: !permissions.canInvite })} disabled={creatingRoom}>
                                    {permissions.canInvite ? 'Remove invite right' : 'Can invite'}
                                  </button>
                                  <button type="button" onClick={() => handleSetPrivateMemberPermission(member.uid, { ...permissions, canKick: !permissions.canKick })} disabled={creatingRoom}>
                                    {permissions.canKick ? 'Remove kick right' : 'Can kick'}
                                  </button>
                                </>
                              ) : null}
                            </div>
                          );
                        }) : <p>{activeRoomMemberProfiles.length ? 'No matching members.' : 'No members loaded yet.'}</p>}
                      </div>
                    </div>
                    <div className="chat-danger-zone">
                      <div>
                        <h4><Trash2 size={17} /> Delete private chat</h4>
                        <p>This deletes the private chat and its messages for all members.</p>
                      </div>
                      <button className="chat-delete-room-button" type="button" onClick={handleDeletePrivateRoom}>
                        <Trash2 size={16} /> Delete chat
                      </button>
                    </div>
                  </>
                ) : null}

                {privatePanel === 'invite' && canInviteActiveRoom ? (
                  <>
                    <div>
                      <h3><UserPlus size={17} /> Invite</h3>
                      <p>Choose more people for this private chat.</p>
                    </div>
                    <UserPicker
                      filteredProfiles={privateInviteProfiles}
                      selectedUserIds={inviteUserIds}
                      setUserSearch={setUserSearch}
                      title="Add to chat"
                      toggleUser={(uid) => toggleSelectedUser(uid, setInviteUserIds)}
                      userSearch={userSearch}
                    />
                    <button className="user-auth-secondary" type="button" onClick={handleInviteUsers} disabled={!inviteUserIds.length}>
                      <UserPlus size={17} /> Add selected
                    </button>
                  </>
                ) : null}

                {privatePanel === 'members' ? (
                  <>
                    <div>
                      <h3><Users size={17} /> Members</h3>
                      <p>{activeRoomMemberProfiles.length} members.</p>
                    </div>
                    <div className="chat-member-tools">
                      <label className="chat-user-search" htmlFor="private-member-search">
                        <Search size={16} />
                        <input id="private-member-search" onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search members" type="search" value={memberSearch} />
                      </label>
                      <span>{filteredActiveRoomMemberProfiles.length} / {activeRoomMemberProfiles.length}</span>
                    </div>
                    <div className="chat-member-list is-compact">
                      {filteredActiveRoomMemberProfiles.length ? filteredActiveRoomMemberProfiles.map((member) => (
                        <button className="chat-member-pill" key={member.uid} type="button" onClick={() => handleOpenMemberProfile(member)} translate="no">
                          <span className={member.photoURL ? 'chat-member-pill-avatar has-photo' : 'chat-member-pill-avatar'}>
                            {member.photoURL ? <img src={member.photoURL} alt="" /> : String(member.displayName || 'P').trim().slice(0, 1).toUpperCase()}
                          </span>
                          <strong>{member.displayName || 'Player'}</strong>
                        </button>
                      )) : <span>{activeRoomMemberProfiles.length ? 'No matching members.' : 'No members loaded yet.'}</span>}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {privateBuilderOpen ? (
              <form className="chat-private-builder chat-create-panel" onSubmit={handleCreatePrivateRoom}>
                <div className="chat-builder-heading">
                  <h2><Plus size={17} /> New private chat</h2>
                  <button type="button" onClick={() => { setPrivateBuilderOpen(false); setPrivateTitle(''); setInvitePolicy('ownerOnly'); setSelectedUserIds([]); }} aria-label="Close private chat builder">
                    <X size={17} />
                  </button>
                </div>
                <label htmlFor="private-chat-title">Name</label>
                <input id="private-chat-title" value={privateTitle} onChange={(event) => setPrivateTitle(event.target.value)} placeholder="Strategy room" maxLength={60} required />
                <small className="chat-required-hint">A room name is required.</small>
                <UserPicker
                  filteredProfiles={privateInviteProfiles}
                  selectedUserIds={selectedUserIds}
                  setUserSearch={setUserSearch}
                  title="Invite users"
                  toggleUser={(uid) => toggleSelectedUser(uid, setSelectedUserIds)}
                  userSearch={userSearch}
                />
                <button className="user-auth-primary" type="submit" disabled={creatingRoom || !privateTitle.trim()}>
                  <Plus size={17} /> {creatingRoom ? 'Creating...' : 'Create private chat'}
                </button>
              </form>
            ) : null}

            {allianceSubBuilderOpen && canCreateAllianceSubRoom && !allianceSubRoomLimitReached ? (
              <form className="chat-private-builder chat-create-panel" onSubmit={handleCreateAllianceSubRoom}>
                <div className="chat-builder-heading">
                  <h2><Plus size={17} /> New alliance sub chat</h2>
                  <button type="button" onClick={() => { setAllianceSubBuilderOpen(false); setAllianceSubTitle(''); }} aria-label="Close alliance sub chat builder">
                    <X size={17} />
                  </button>
                </div>
                <label htmlFor="alliance-sub-chat-title">Name</label>
                <input id="alliance-sub-chat-title" value={allianceSubTitle} onChange={(event) => setAllianceSubTitle(event.target.value)} placeholder="Questions & Answers" maxLength={60} required />
                <small className="chat-required-hint">A sub chat name is required.</small>
                <button className="user-auth-primary" type="submit" disabled={allianceAction || !allianceSubTitle.trim()}>
                  <Plus size={17} /> {allianceAction ? 'Creating...' : 'Create sub chat'}
                </button>
              </form>
            ) : null}
            {hasActiveChatRoom && canUseActiveRoom ? <div className="chat-message-list" ref={listRef} aria-live="polite">
              {visibleMessages.length ? visibleMessages.map((message) => (message.type === 'system' ? (
                <article className="chat-message-system" key={message.id}>
                  <span translate="no">{getDisplayedMessageText(message)}</span>
                  {message.createdAt ? <time>{formatChatTime(message.createdAt)}</time> : null}
                </article>
              ) : (
                <article className={message.uid === user.uid ? 'chat-message is-own' : 'chat-message'} key={message.id}>
                  <button className={getMessagePhotoURL(message) ? 'chat-message-avatar has-photo' : 'chat-message-avatar'} type="button" onClick={() => handleOpenChatUser(message)} translate="no" aria-label="Open user actions">
                    {getMessagePhotoURL(message) ? <img src={getMessagePhotoURL(message)} alt="" /> : getMessageInitial(message)}
                  </button>
                  <div className="chat-message-body">
                    <header translate="no">
                      <button className="chat-message-author" type="button" onClick={() => handleOpenChatUser(message)}>{getAllianceMessageAuthor(message)}</button>
                      {message.createdAt ? <time>{formatChatTime(message.createdAt)}</time> : null}
                    </header>
                    {message.image?.url ? (
                      <a className="chat-message-image" href={message.image.url} target="_blank" rel="noreferrer" translate="no">
                        <img src={message.image.url} alt={message.image.name || 'Chat image'} loading="lazy" />
                      </a>
                    ) : null}
                    {getDisplayedMessageText(message) ? <p translate="no">{renderMessageText(getDisplayedMessageText(message), activeRoomMemberProfiles)}</p> : null}
                  </div>
                </article>
              ))) : (
                <div className="chat-empty-state">
                  <strong>No messages yet.</strong>
                  <p>Start the first conversation in this room.</p>
                </div>
              )}
            </div> : null}

            {status ? <strong className="chat-status">{status}</strong> : null}

            {hasActiveChatRoom && canUseActiveRoom && !canWriteActiveRoom ? (
              <div className="chat-read-only-note">
                <LockKeyhole size={18} />
                <span>Only alliance chat owner/admins can write in this sub chat. Members can read only.</span>
              </div>
            ) : null}

            {hasActiveChatRoom && canUseActiveRoom && canWriteActiveRoom ? <form className="chat-compose" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="chat-message">Message</label>
              <div className="chat-compose-field">
                <textarea
                  id="chat-message"
                  ref={textareaRef}
                  maxLength={800}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Write to ${activeRoomDisplayTitle || 'this chat'}...`}
                  rows={3}
                  value={draft}
                />
                <button className="chat-image-toggle" type="button" onClick={() => imageInputRef.current?.click()} aria-label="Choose image">
                  <ImagePlus size={19} />
                </button>
                <input ref={imageInputRef} className="sr-only" type="file" accept="image/*" onChange={handleSelectImage} />
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
                {selectedImagePreview ? (
                  <div className="chat-image-preview" translate="no">
                    <img src={selectedImagePreview} alt="Selected chat upload" />
                    <div>
                      <strong>{selectedImage?.name || 'Selected image'}</strong>
                      <span>{selectedImage?.size ? `${Math.ceil(selectedImage.size / 1024)} KB` : ''}</span>
                    </div>
                    <button type="button" onClick={handleClearSelectedImage} aria-label="Remove selected image">
                      <X size={16} />
                    </button>
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
              <button className="user-auth-primary" type="submit" disabled={sending || !canSubmitMessage}>
                <Send size={18} /> {sending ? 'Sending...' : 'Send'}
              </button>
            </form> : null}
          </main>
        </div>
      </div>
    </section>
  );
}





























