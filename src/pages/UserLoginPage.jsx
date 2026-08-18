import { Apple, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { authService } from '../features/auth/authService.js';

const providerErrorHelp = 'Check that this sign-in provider is enabled in Firebase Authentication.';

const getFriendlyError = (error) => {
  const message = error?.message || 'Login failed.';

  if (message.includes('auth/operation-not-allowed')) return providerErrorHelp;
  if (message.includes('auth/unauthorized-domain')) return 'Add 127.0.0.1 and localhost to Firebase Authentication authorized domains.';
  if (message.includes('auth/admin-restricted-operation')) return 'This provider is restricted in Firebase Authentication.';
  if (message.includes('auth/popup-blocked')) return 'The browser blocked the popup. Use redirect login instead.';
  if (message.includes('auth/popup-closed-by-user')) return 'The login popup was closed before sign-in finished. Try the redirect button below.';
  if (message.includes('auth/invalid-phone-number')) return 'Enter the phone number with country code, for example +491701234567.';
  if (message.includes('auth/code-expired')) return 'The SMS code expired. Send a new code.';
  if (message.includes('auth/invalid-verification-code')) return 'The SMS code is not correct.';
  if (message.includes('auth/email-already-in-use')) return 'This email already has an account. Use Sign in instead.';
  if (message.includes('auth/weak-password')) return 'Password must have at least 6 characters.';
  if (message.includes('auth/invalid-credential')) return 'Email or password is not correct.';

  return message;
};

export default function UserLoginPage() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => authService.subscribe((nextUser) => {
    setUser(nextUser);
    if (nextUser) setStatus('');
  }), []);

  useEffect(() => {
    authService.completeRedirectLogin().catch((error) => {
      setStatus(getFriendlyError(error));
    });
  }, []);

  const userLabel = useMemo(() => user?.email || user?.phoneNumber || user?.displayName || 'Signed in user', [user]);

  const runAction = async (actionName, action) => {
    setBusy(actionName);
    setStatus('');

    try {
      await action();
    } catch (error) {
      setStatus(getFriendlyError(error));
    } finally {
      setBusy('');
    }
  };

  const handleSocialPopup = async (providerName, action) => {
    setBusy(`${providerName}-popup`);
    setStatus(`Opening ${providerName} popup...`);

    try {
      await action();
    } catch (error) {
      setStatus(getFriendlyError(error));
    } finally {
      setBusy('');
    }
  };

  const handleSocialRedirect = (providerName, action) => {
    setBusy(`${providerName}-redirect`);
    setStatus(`Redirecting to ${providerName}...`);

    action().catch((error) => {
      setBusy('');
      setStatus(getFriendlyError(error));
    });
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    await runAction('email', async () => {
      if (mode === 'register') {
        await authService.registerWithEmail(email, password);
      } else {
        await authService.signInWithEmail(email, password);
      }
      setPassword('');
    });
  };

  const handleSendPhoneCode = async (event) => {
    event.preventDefault();
    await runAction('phone-send', async () => {
      const result = await authService.sendPhoneCode(phoneNumber, 'phone-recaptcha');
      setConfirmationResult(result);
      setStatus('SMS code sent.');
    });
  };

  const handleConfirmPhoneCode = async (event) => {
    event.preventDefault();
    await runAction('phone-confirm', async () => {
      await authService.confirmPhoneCode(confirmationResult, phoneCode);
      setPhoneCode('');
    });
  };

  const handleLogout = async () => {
    await runAction('logout', async () => authService.signOut());
  };

  if (user) {
    return (
      <section className="user-auth-page">
        <div className="user-auth-card user-profile-card">
          <span className="user-auth-icon"><ShieldCheck size={30} /></span>
          <h1>Account Active</h1>
          <p translate="no">{userLabel}</p>
          <div className="user-profile-grid" translate="no">
            <span>UID</span>
            <strong>{user.uid}</strong>
            <span>Provider</span>
            <strong>{user.providerData?.[0]?.providerId || 'password'}</strong>
          </div>
          <button className="user-auth-primary" type="button" onClick={handleLogout} disabled={busy === 'logout'}>
            {busy === 'logout' ? 'Signing out...' : 'Sign Out'}
          </button>
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

        <div className="social-login-grid social-login-grid-wide">
          <button type="button" onClick={() => handleSocialPopup('Google', () => authService.signInWithGoogle())} disabled={Boolean(busy)}>
            <span className="provider-mark">G</span> Google Popup
          </button>
          <button type="button" onClick={() => handleSocialPopup('Apple', () => authService.signInWithApple())} disabled={Boolean(busy)}>
            <Apple size={19} /> Apple Popup
          </button>
          <button type="button" onClick={() => handleSocialRedirect('Google', () => authService.redirectWithGoogle())} disabled={Boolean(busy)}>
            <span className="provider-mark">G</span> Google Redirect
          </button>
          <button type="button" onClick={() => handleSocialRedirect('Apple', () => authService.redirectWithApple())} disabled={Boolean(busy)}>
            <Apple size={19} /> Apple Redirect
          </button>
        </div>

        <div className="phone-login-box">
          <div className="phone-login-heading">
            <Phone size={19} />
            <strong>Phone Login</strong>
          </div>
          <form className="user-auth-form" onSubmit={handleSendPhoneCode}>
            <label htmlFor="user-phone">Phone number</label>
            <input id="user-phone" autoComplete="tel" type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+491701234567" required />
            <button className="user-auth-secondary" type="submit" disabled={busy === 'phone-send'}>
              {busy === 'phone-send' ? 'Sending...' : 'Send SMS Code'}
            </button>
          </form>

          {confirmationResult ? (
            <form className="user-auth-form" onSubmit={handleConfirmPhoneCode}>
              <label htmlFor="user-phone-code">SMS code</label>
              <input id="user-phone-code" inputMode="numeric" value={phoneCode} onChange={(event) => setPhoneCode(event.target.value)} placeholder="123456" required />
              <button className="user-auth-primary" type="submit" disabled={busy === 'phone-confirm'}>
                {busy === 'phone-confirm' ? 'Checking...' : 'Confirm Phone Login'}
              </button>
            </form>
          ) : null}
        </div>

        {status ? <strong className="user-auth-status">{status}</strong> : null}
        <div id="phone-recaptcha" />
      </div>
    </section>
  );
}