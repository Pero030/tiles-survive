import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoImage from '../../assets/brand/tiles-survive-logo.png';
import { useLanguage } from '../../context/LanguageContext.jsx';

const navItems = [
  ['navHome', '/'],
  ['navEvents', '/events'],
  ['navHeroes', '/heroes'],
  ['navVillages', '/villages'],
  ['navAlliance', '/alliance'],
  ['navBuildings', '/buildings'],
  ['navWorldMap', '/world-map'],
  ['navTips', '/tips'],
  ['navFaq', '/faq'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img className="brand-logo" src={logoImage} alt={t('brand')} />
        </NavLink>

        <button className="icon-button menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
          {navItems.map(([label, to]) => (
            <NavLink className={`nav-link nav-link-${label}`} key={to} to={to} onClick={() => setOpen(false)}>
              {t(label)}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
