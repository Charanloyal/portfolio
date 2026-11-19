import { profile } from '../data/profile.ts';
import { useCopy } from '../hooks/useToast.ts';
import { useScrolledPast } from '../hooks/useScroll.ts';
import { ArrowUpIcon, CopyIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons.tsx';
import { Section } from './Section.tsx';

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  document.getElementById('top')?.focus({ preventScroll: true });
}

export function Contact() {
  const copy = useCopy();
  const subject = encodeURIComponent('Opportunity for B. Charan Kumar Reddy');

  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      title={
        <>
          Let's talk about your team. <em>I reply within a day.</em>
        </>
      }
      intro={`I'm looking for ${profile.targetRoles.join(', ').replace(/, ([^,]*)$/, ' and $1')} roles at product companies and Global Capability Centers. Graduating ${profile.education.period.replace('Expected ', '')}; ${profile.mobility.toLowerCase()}.`}
    >
      <div className="contact-grid">
        <div className="contact-card glass">
          <p className="eyebrow mono">Email</p>
          <a className="contact-email" href={`mailto:${profile.email}?subject=${subject}`}>
            {profile.email}
          </a>
          <div className="contact-actions">
            <a className="btn btn-primary" href={`mailto:${profile.email}?subject=${subject}`}>
              <MailIcon size={16} />
              Send an email
            </a>
            <button type="button" className="btn btn-ghost" onClick={() => copy(profile.email, 'Email copied to clipboard')}>
              <CopyIcon size={16} />
              Copy address
            </button>
          </div>
          <p className="muted small">
            Also reachable at{' '}
            <a className="text-link" href={`mailto:${profile.secondaryEmail}`}>
              {profile.secondaryEmail}
            </a>
          </p>
        </div>

        <ul className="contact-links">
          <li>
            <a className="contact-link glass" href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon size={20} />
              <span>
                <strong>LinkedIn</strong>
                <span className="mono">in/b-charan-kumar-reddy</span>
              </span>
            </a>
          </li>
          <li>
            <a className="contact-link glass" href={profile.links.github} target="_blank" rel="noreferrer">
              <GitHubIcon size={20} />
              <span>
                <strong>GitHub</strong>
                <span className="mono">{profile.links.github.replace('https://', '')}</span>
              </span>
            </a>
          </li>
          <li>
            <a className="contact-link glass" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <DownloadIcon size={20} />
              <span>
                <strong>Résumé</strong>
                <span className="mono">Google Drive · PDF</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}

export function Footer() {
  const showTop = useScrolledPast(800);
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript and Vite; deployed to GitHub Pages
          with GitHub Actions.
        </p>
        <nav aria-label="Footer" className="footer-links">
          <a href={`mailto:${profile.email}`} aria-label="Email">
            <MailIcon />
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <button type="button" className="icon-btn" onClick={scrollToTop} aria-label="Back to top">
            <ArrowUpIcon />
          </button>
        </nav>
      </div>
      <button
        type="button"
        className={`to-top glass${showTop ? ' is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}
