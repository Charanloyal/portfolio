import { describe, expect, it } from 'vitest';
import { TRACKS, catalogue, moreProjects, showcase } from '../src/data/projects.ts';
import { experience, impactMetrics, profile, skills } from '../src/data/profile.ts';

const GITHUB_PREFIX = 'https://github.com/Charanloyal/';

describe('project catalogue', () => {
  it('has unique ids', () => {
    const ids = catalogue.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links every project to a Charanloyal GitHub repository', () => {
    for (const p of catalogue) expect(p.github_url, p.id).toMatch(new RegExp(`^${GITHUB_PREFIX}`));
  });

  it('backs every metric with an evidence file reference', () => {
    for (const p of catalogue) {
      for (const m of p.metrics) {
        expect(m.evidence.trim().length, `${p.id}: ${m.label}`).toBeGreaterThan(10);
        expect(m.value.trim(), `${p.id}: ${m.label}`).not.toBe('');
      }
    }
  });

  it('uses deploy-relative paths for bundled images and demos', () => {
    for (const p of catalogue) {
      for (const path of [p.image, p.demo_url]) {
        if (path && !path.startsWith('https://')) expect(path, p.id).not.toMatch(/^\/|^\.\.|static\//);
      }
    }
  });

  it('rejects temporary tunnel demo URLs', () => {
    for (const p of catalogue) expect(p.demo_url ?? '', p.id).not.toContain('trycloudflare.com');
  });
});

describe('project showcase', () => {
  it('gives every showcase project a case study with a data flow, trade-offs and limitations', () => {
    for (const p of showcase) {
      expect(p.case_study.architecture.length, p.id).toBeGreaterThanOrEqual(3);
      expect(p.case_study.decisions.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.case_study.limitations.length, p.id).toBeGreaterThanOrEqual(1);
      expect(p.brief.problem && p.brief.approach, p.id).toBeTruthy();
    }
  });

  it('fills every role filter with at least three projects', () => {
    for (const track of TRACKS.filter((t) => t.id !== 'all')) {
      const count = showcase.filter((p) => p.tracks.includes(track.id as never)).length;
      expect(count, track.label).toBeGreaterThanOrEqual(3);
    }
  });

  it('shows outcomes on cards that have no measured metrics', () => {
    for (const p of showcase) {
      if (p.metrics.length === 0) expect(p.brief.outcomes.length, p.id).toBeGreaterThan(0);
    }
  });

  it('lists every other catalogue project under more repositories', () => {
    expect(showcase.length + moreProjects.length).toBe(catalogue.length);
  });
});

describe('profile', () => {
  it('points at the GitHub Pages site, not the retired Render deployment', () => {
    expect(profile.siteUrl).toBe('https://charanloyal.github.io/portfolio/');
    expect(JSON.stringify(profile)).not.toContain('onrender.com');
  });

  it('has valid contact emails', () => {
    for (const email of [profile.email, profile.secondaryEmail]) expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/);
  });

  it('cites a source for every headline metric', () => {
    for (const m of impactMetrics) expect(m.source.length, m.value).toBeGreaterThan(5);
  });

  it('lists experience with at least one outcome per role', () => {
    expect(experience.length).toBeGreaterThan(0);
    for (const role of experience) expect(role.bullets.length, role.org).toBeGreaterThan(0);
  });

  it('has no duplicate skills within a group', () => {
    for (const g of skills) expect(new Set(g.items).size, g.group).toBe(g.items.length);
  });
});
