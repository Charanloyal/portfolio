import { useEffect, useState } from 'react';
import { profile } from '../data/profile.ts';
import { useActiveSection, useScrolledPast } from '../hooks/useScroll.ts';
import { CloseIcon, GitHubIcon, LinkedInIcon, MenuIcon } from './Icons.tsx';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const;

const NAV_IDS = NAV.map((n) => n.id);

export function FloatingNav() {
  const active = useActiveSection(NAV_IDS);
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav-shell${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav-pill">
        <a href="#about" className="brand">
          <span className="brand-mark mono" aria-hidden="true">
            CR
          </span>
          <span className="brand-name">{profile.shortName}</span>
        </a>

        <nav aria-label="Primary" id="primary-nav" className="nav-links">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span className="nav-divider" aria-hidden="true" />
        <div className="nav-icons">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <GitHubIcon size={17} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
            <LinkedInIcon size={16} />
          </a>
        </div>

        <button
          type="button"
          className="icon-btn nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </div>
    </header>
  );
}
