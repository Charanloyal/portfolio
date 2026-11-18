import { useEffect, useState } from 'react';

/** Returns the id of the section currently nearest the top of the viewport. */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        const next = [...visible.entries()].sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
        setActive(next);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** True once the page has been scrolled past `offset` pixels. */
export function useScrolledPast(offset: number): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return past;
}
