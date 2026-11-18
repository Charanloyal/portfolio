import { useEffect, useState } from 'react';
import { profile } from '../data/profile.ts';
import { useActiveSection, useScrolledPast } from '../hooks/useScroll.ts';
import { CloseIcon, DownloadIcon, MenuIcon } from './Icons.tsx';

const NAV = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const;

const NAV_IDS = NAV.map((n) => n.id);

export function Header() {
  const active = useActiveSection(NAV_IDS);
  const scrolled = useScrolledPast(12);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            CR
          </span>
          <span className="brand-name">{profile.name}</span>
        </a>

        <nav aria-label="Primary" className={`nav${open ? ' is-open' : ''}`} id="primary-nav">
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
          <a className="btn btn-ghost btn-sm" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            <DownloadIcon size={15} />
            Résumé
          </a>
        </nav>

        <button
          type="button"
          className="icon-btn nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
