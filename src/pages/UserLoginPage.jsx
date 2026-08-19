import { Apple, BadgeCheck, ImagePlus, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { authService } from '../features/auth/authService.js';
import { normalizeAdminEmail, subscribeToAdminAccess } from '../services/adminAccess.js';

const providerErrorHelp = 'Check that this sign-in provider is enabled in Firebase Authentication.';

const GoogleMark = () => (
  <svg aria-hidden="true" className="google-provider-mark" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
  </svg>
);

const getFriendlyError = (error) => {
  const message = error?.message || 'Action failed.';

  if (message.includes('auth/operation-not-allowed')) return providerErrorHelp;
  if (message.includes('auth/unauthorized-domain')) return 'This website domain must be added in Firebase Authentication authorized domains.';
  if (message.includes('auth/admin-restricted-operation')) return 'This provider is restricted in Firebase Authentication.';
  if (message.includes('auth/popup-blocked')) return 'The browser blocked the popup. Try again or allow popups for this site.';
  if (message.includes('auth/popup-closed-by-user')) return 'The login popup was closed before sign-in finished.';
  if (message.includes('auth/email-already-in-use')) return 'This email already has an account. Use Sign in instead.';
  if (message.includes('auth/weak-password')) return 'Password must have at least 6 characters.';
  if (message.includes('auth/requires-recent-login')) return 'For security, please sign out and sign in again before changing your password.';
  if (message.includes('Account does not exist')) return 'Account does not exist. Please use Register first.';
  if (message.includes('auth/user-not-found')) return 'Account does not exist. Please use Register first.';
  if (message.includes('auth/invalid-credential')) return 'Email or password is not correct, or this account does not exist yet.';

  return message;
};

export default function UserLoginPage() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [gameServer, setGameServer] = useState('');
  const [allianceName, setAllianceName] = useState('');
  const [allianceTag, setAllianceTag] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [statusTone, setStatusTone] = useState('error');
  const [busy, setBusy] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const previewURLRef = useRef('');

  useEffect(() => () => {
    if (previewURLRef.current) {
      URL.revokeObjectURL(previewURLRef.current);
    }
  }, []);

  useEffect(() => authService.subscribe((nextUser) => {
    setUser(nextUser);
    setDisplayName(nextUser?.displayName || '');
    setPhotoURL(nextUser?.photoURL || '');
    if (!nextUser) {
      setPhotoURL('');
      setGameServer('');
      setAllianceName('');
      setAllianceTag('');
      setProfileLoaded(false);
    }
    if (nextUser) setStatus('');
  }), []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    let isMounted = true;
    setProfileLoaded(false);
    authService.getCurrentUserProfile()
      .then((profile) => {
        if (isMounted) {
          setGameServer(profile?.gameServer || '');
          setAllianceName(profile?.allianceName || '');
          setAllianceTag(profile?.allianceTag || '');
          setPhotoURL(profile?.photoURL || user.photoURL || '');
          setProfileLoaded(true);
        }
      })
      .catch((error) => {
        setStatusTone('error');
        setStatus(getFriendlyError(error));
        setProfileLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.email) {
      setIsAdmin(false);
      return undefined;
    }

    return subscribeToAdminAccess(
      (data) => {
        const userEmail = normalizeAdminEmail(user.email);
        setIsAdmin(data.active !== false && data.emails.includes(userEmail));
      },
      () => setIsAdmin(false),
    );
  }, [user?.email]);

  useEffect(() => {
    authService.completeRedirectLogin().catch((error) => {
      setStatusTone('error');
      setStatus(getFriendlyError(error));
    });
  }, []);

  const userLabel = useMemo(() => user?.displayName || user?.email || 'Signed in user', [user]);
  const providerId = user?.providerData?.[0]?.providerId || 'password';
  const canChangePassword = providerId === 'password';

  const runAction = async (actionName, action, successMessage = '') => {
    setBusy(actionName);
    setStatus('');

    try {
      await action();
      if (successMessage) {
        setStatusTone('success');
        setStatus(successMessage);
      }
    } catch (error) {
      setStatusTone('error');
      setStatus(getFriendlyError(error));
    } finally {
      setBusy('');
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    await runAction('email', async () => {
      if (mode === 'register') {
        await authService.registerWithEmail(email, password);
        setStatusTone('success');
        setStatus('Verification email sent. Please check your inbox.');
      } else {
        await authService.signInWithEmail(email, password);
      }
      setPassword('');
    });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    await runAction('profile', async () => {
      const nextProfile = await authService.updateProfileSettings({ displayName, gameServer, allianceName, allianceTag });
      setGameServer(nextProfile.gameServer);
      setAllianceName(nextProfile.allianceName);
      setAllianceTag(nextProfile.allianceTag);
      setPhotoURL(nextProfile.photoURL || nextProfile.user.photoURL || '');
      setUser({ ...nextProfile.user });
    }, 'Profile saved.');
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await runAction('profile-image', async () => {
      const previousPhotoURL = photoURL;
      if (previewURLRef.current) {
        URL.revokeObjectURL(previewURLRef.current);
      }

      previewURLRef.current = URL.createObjectURL(file);
      setPhotoURL(previewURLRef.current);
      try {
        const nextProfile = await authService.uploadProfileImage(file);
        URL.revokeObjectURL(previewURLRef.current);
        previewURLRef.current = '';
        setPhotoURL(nextProfile.photoURL);
        setUser({ ...nextProfile.user });
        event.target.value = '';
      } catch (error) {
        URL.revokeObjectURL(previewURLRef.current);
        previewURLRef.current = '';
        setPhotoURL(previousPhotoURL);
        throw error;
      }
    }, 'Profile image saved.');
  };

  const handleGameServerChange = (event) => {
    setGameServer(event.target.value.replace(/\D/g, '').slice(0, 6));
  };

  const handleAllianceTagChange = (event) => {
    setAllianceTag(event.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8));
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    await runAction('password', async () => {
      await authService.updateUserPassword(newPassword);
      setNewPassword('');
    }, 'Password changed.');
  };

  const handleResendVerification = async () => {
    await runAction('verify-email', async () => authService.sendVerificationEmail(), 'Verification email sent again. Please check your inbox.');
  };

  const handleRefreshVerification = async () => {
    await runAction('refresh-user', async () => {
      const nextUser = await authService.reloadCurrentUser();
      setUser({ ...nextUser });
    }, 'Email status refreshed.');
  };

  const handleLogout = async () => {
    await runAction('logout', async () => authService.signOut());
  };

  if (user) {
    const isVerified = !user.email || user.emailVerified;

    return (
      <section className="user-auth-page">
        <div className="user-profile-shell">
          <section className="profile-hero-card">
            <div className={photoURL ? 'profile-avatar has-photo' : 'profile-avatar'} translate="no">
              {photoURL ? <img src={photoURL} alt="" /> : userLabel.slice(0, 1).toUpperCase()}
            </div>
            <div className="profile-hero-copy">
              <span className={isVerified ? 'profile-status-chip is-verified' : 'profile-status-chip is-unverified'}>
                {isVerified ? <BadgeCheck size={17} /> : <Mail size={17} />}
                {isVerified ? 'Verified account' : 'Email not verified'}
              </span>
              <div className="profile-name-row" translate="no">
                <h1>{userLabel}</h1>
                {isAdmin ? <span className="profile-admin-badge">Admin</span> : null}
              </div>
              <p translate="no">{user.email || 'Social account'}</p>
            </div>
          </section>

          {!isVerified ? (
            <section className="profile-panel verification-box">
              <strong>Please verify your email address.</strong>
              <p>Check your inbox and click the verification link. After confirming, refresh the status here.</p>
              <div>
                <button className="user-auth-secondary" type="button" onClick={handleResendVerification} disabled={Boolean(busy)}>
                  {busy === 'verify-email' ? 'Sending...' : 'Resend verification email'}
                </button>
                <button className="provider-login-button google-login-button" type="button" onClick={handleRefreshVerification} disabled={Boolean(busy)}>
                  {busy === 'refresh-user' ? 'Checking...' : 'Refresh status'}
                </button>
              </div>
            </section>
          ) : (
            <section className="profile-settings-grid">
              <form className="profile-panel profile-settings-card" onSubmit={handleSaveProfile}>
                <div className="profile-panel-heading">
                  <span><UserRound size={21} /></span>
                  <div>
                    <h2>Profile Settings</h2>
                    <p>Choose your public name, server, and alliance.</p>
                  </div>
                </div>
                <label htmlFor="profile-display-name">Display name</label>
                <input id="profile-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your name" maxLength={40} disabled={!profileLoaded} />
                <label htmlFor="profile-photo-upload">Profile image</label>
                <div className="profile-image-upload-row">
                  <div className={photoURL ? 'profile-image-preview has-photo' : 'profile-image-preview'} translate="no">
                    {photoURL ? <img src={photoURL} alt="" /> : userLabel.slice(0, 1).toUpperCase()}
                  </div>
                  <label className="profile-image-upload-button" htmlFor="profile-photo-upload">
                    <ImagePlus size={18} />
                    {busy === 'profile-image' ? 'Uploading...' : 'Upload image'}
                  </label>
                  <input id="profile-photo-upload" type="file" accept="image/*" onChange={handleProfileImageUpload} disabled={!profileLoaded || busy === 'profile-image'} />
                </div>
                <label htmlFor="profile-game-server">Game server</label>
                <div className="profile-server-input">
                  <span translate="no">#</span>
                  <input id="profile-game-server" inputMode="numeric" pattern="[0-9]*" value={gameServer} onChange={handleGameServerChange} placeholder={profileLoaded ? '867' : 'Loading...'} maxLength={6} disabled={!profileLoaded} />
                </div>
                <label htmlFor="profile-alliance-name">Alliance name</label>
                <input id="profile-alliance-name" value={allianceName} onChange={(event) => setAllianceName(event.target.value.slice(0, 48))} placeholder={profileLoaded ? 'EmpireARDA' : 'Loading...'} maxLength={48} disabled={!profileLoaded} />
                <label htmlFor="profile-alliance-tag">Alliance tag</label>
                <div className="profile-alliance-tag-input">
                  <span translate="no">[</span>
                  <input id="profile-alliance-tag" value={allianceTag} onChange={handleAllianceTagChange} placeholder={profileLoaded ? 'ADA' : 'Loading...'} maxLength={8} disabled={!profileLoaded} />
                  <span translate="no">]</span>
                </div>
                <button className="user-auth-primary" type="submit" disabled={!profileLoaded || busy === 'profile'}>
                  {!profileLoaded ? 'Loading profile...' : busy === 'profile' ? 'Saving...' : 'Save profile'}
                </button>
              </form>

              <form className="profile-panel profile-settings-card" onSubmit={handlePasswordChange}>
                <div className="profile-panel-heading">
                  <span><KeyRound size={21} /></span>
                  <div>
                    <h2>Password</h2>
                    <p>{canChangePassword ? 'Change your email login password.' : 'Password changes are only available for email accounts.'}</p>
                  </div>
                </div>
                <label htmlFor="profile-new-password">New password</label>
                <input id="profile-new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Minimum 6 characters" minLength={6} disabled={!canChangePassword} />
                <button className="user-auth-secondary" type="submit" disabled={!canChangePassword || busy === 'password'}>
                  {busy === 'password' ? 'Changing...' : 'Change password'}
                </button>
              </form>
            </section>
          )}

          <section className="profile-panel profile-details-card">
            <div className="user-profile-grid" translate="no">
              <span>UID</span>
              <strong>{user.uid}</strong>
              <span>Provider</span>
              <strong>{providerId}</strong>
              <span>Email verified</span>
              <strong>{user.email ? user.emailVerified ? 'Yes' : 'No' : 'No email'}</strong>
              <span>Game server</span>
              <strong>{gameServer ? `#${gameServer}` : 'Not set'}</strong>
              <span>Alliance</span>
              <strong>{allianceName ? `${allianceTag ? `[${allianceTag}] ` : ''}${allianceName}` : 'Not set'}</strong>
            </div>
            {status ? <strong className={statusTone === 'success' ? 'user-auth-status is-positive' : 'user-auth-status'}>{status}</strong> : null}
            <button className="user-auth-primary" type="button" onClick={handleLogout} disabled={busy === 'logout'}>
              {busy === 'logout' ? 'Signing out...' : 'Sign Out'}
            </button>
          </section>
        </div>
      </section>
    );
  }

  return (
    <section className="user-auth-page">
      <div className="user-auth-card">
        <span className="user-auth-icon"><ShieldCheck size={30} /></span>
        <h1>{mode === 'register' ? 'Create Account' : 'User Login'}</h1>
        <p>Sign in to save future favorites, comments, and guide settings.</p>

        <div className="auth-mode-tabs" role="tablist" aria-label="Login mode">
          <button className={mode === 'login' ? 'is-active' : ''} type="button" onClick={() => setMode('login')}>Sign In</button>
          <button className={mode === 'register' ? 'is-active' : ''} type="button" onClick={() => setMode('register')}>Register</button>
        </div>

        <form className="user-auth-form" onSubmit={handleEmailSubmit}>
          <label htmlFor="user-email">Email</label>
          <input id="user-email" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />

          <label htmlFor="user-password">Password</label>
          <input id="user-password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" required />

          <button className="user-auth-primary" type="submit" disabled={busy === 'email'}>
            <Mail size={18} /> {busy === 'email' ? 'Please wait...' : mode === 'register' ? 'Register with Email' : 'Sign in with Email'}
          </button>
        </form>

        <div className="provider-login-grid">
          <button className="provider-login-button google-login-button" type="button" onClick={() => runAction('google', () => authService.signInWithGoogle({ allowNewUser: mode === 'register' }))} disabled={Boolean(busy)}>
            <GoogleMark />
            <span>{mode === 'register' ? 'Register with Google' : 'Sign in with Google'}</span>
          </button>
          <button className="provider-login-button apple-login-button" type="button" onClick={() => runAction('apple', () => authService.signInWithApple({ allowNewUser: mode === 'register' }))} disabled={Boolean(busy)}>
            <Apple size={21} fill="currentColor" />
            <span>{mode === 'register' ? 'Register with Apple' : 'Sign in with Apple'}</span>
          </button>
        </div>

        {status ? <strong className={statusTone === 'success' ? 'user-auth-status is-positive' : 'user-auth-status'}>{status}</strong> : null}
      </div>
    </section>
  );
}
