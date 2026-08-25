import { ChevronDown, Menu, MoreHorizontal, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assetPath } from '../../utils/assetPath.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { authService } from '../../features/auth/authService.js';
import { GoogleTranslate } from './GoogleTranslate.jsx';

const primaryNavItems = [
  ['navHome', '/'],
  ['navEvents', '/events'],
  ['navHeroes', '/heroes'],
  ['navAlliance', '/alliance'],
  ['navChat', '/chat'],
  ['navForum', '/forum'],
];

const moreNavItems = [
  ['navVillages', '/villages'],
  ['navBuildings', '/buildings'],
  ['navWorldMap', '/world-map'],
  ['navPatches', '/patches'],
  ['navTips', '/tips'],
  ['navFaq', '/faq'],
];

const fixedNavLabels = {
  navEvents: 'Events',
  navFaq: 'FAQ',
  navChat: 'Chat',
  navForum: 'Forum',
  navProjectAegis: 'Project Aegis',
};

const externalNavItems = [
  ['navProjectAegis', 'https://ts.midnight-at-aurora.com/'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const moreMenuRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => authService.subscribe(setUser), []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!moreMenuRef.current?.contains(event.target)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const getLabel = (label) => fixedNavLabels[label] || t(label);
  const closeMenus = () => {
    setOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" onClick={closeMenus}>
          <img className="brand-logo" src={assetPath('r2://brand/tiles-survive-guide-logo.png')} alt={t('brand')} />
        </NavLink>

        <nav className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
          {primaryNavItems.map(([label, to]) => (
            <NavLink className={`nav-link nav-link-${label}`} key={to} to={to} onClick={closeMenus}>
              <span>{getLabel(label)}</span>
            </NavLink>
          ))}

          <div className={moreOpen ? 'nav-more is-open' : 'nav-more'} ref={moreMenuRef}>
            <button
              className="nav-link nav-more-button"
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              <MoreHorizontal size={18} aria-hidden="true" />
              <span>More</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            <div className="nav-more-menu" role="menu">
              {moreNavItems.map(([label, to]) => (
                <NavLink className={`nav-more-link nav-link-${label}`} key={to} to={to} onClick={closeMenus} role="menuitem">
                  <span>{getLabel(label)}</span>
                </NavLink>
              ))}
              {externalNavItems.map(([label, href]) => (
                <a className={`nav-more-link nav-link-${label}`} href={href} key={href} target="_blank" rel="noreferrer" onClick={closeMenus} translate="no" role="menuitem">
                  <span>{getLabel(label)}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="header-actions">
          <NavLink className="account-link" to="/login" onClick={closeMenus} translate="no">
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
