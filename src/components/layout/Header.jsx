import { Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assetPath } from '../../utils/assetPath.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { authService } from '../../features/auth/authService.js';
import { GoogleTranslate } from './GoogleTranslate.jsx';

const navItems = [
  ['navHome', '/'],
  ['navEvents', '/events'],
  ['navHeroes', '/heroes'],
  ['navVillages', '/villages'],
  ['navAlliance', '/alliance'],
  ['navBuildings', '/buildings'],
  ['navWorldMap', '/world-map'],
  ['navPatches', '/patches'],
  ['navChat', '/chat'],
  ['navTips', '/tips'],
  ['navFaq', '/faq'],
];

const fixedNavLabels = {
  navEvents: 'Events',
  navFaq: 'FAQ',
  navChat: 'Chat',
  navProjectAegis: '🛡️ Project Aegis',
};

const externalNavItems = [
  ['navProjectAegis', 'https://ts.midnight-at-aurora.com/'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const { t } = useLanguage();

  useEffect(() => authService.subscribe(setUser), []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img className="brand-logo" src={assetPath('r2://brand/tiles-survive-guide-logo.png')} alt={t('brand')} />
        </NavLink>

        <nav className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
          {navItems.map(([label, to]) => {
            const fixedLabel = fixedNavLabels[label];

            return (
              <NavLink className={`nav-link nav-link-${label}`} key={to} to={to} onClick={() => setOpen(false)}>
                <span>{fixedLabel || t(label)}</span>
              </NavLink>
            );
          })}
          {externalNavItems.map(([label, href]) => (
            <a className={`nav-link nav-link-${label}`} href={href} key={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} translate="no">
              <span>{fixedNavLabels[label] || t(label)}</span>
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <NavLink className="account-link" to="/login" onClick={() => setOpen(false)} translate="no">
            <User size={18} />
            <span>{user ? 'Account' : 'Login'}</span>
          </NavLink>
          <GoogleTranslate />

          <button className="icon-button menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
