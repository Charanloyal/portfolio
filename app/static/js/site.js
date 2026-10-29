(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* Toast */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2400);
  }

  /* Header border on scroll + back to top */
  const header = $("[data-header]");
  const backToTop = $("[data-back-to-top]");
  function onScroll() {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 8);
    backToTop && backToTop.classList.toggle("is-visible", y > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    const main = $("#main");
    main && main.focus({ preventScroll: true });
  });

  /* Mobile navigation */
  const navToggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");
  function setNav(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => setNav(navToggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        navToggle.focus();
      }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });
  }

  /* Active section in nav */
  const sectionLinks = new Map($$("[data-section-link]").map((a) => [a.dataset.sectionLink, a]));
  const sections = $$("[data-section]");
  if ("IntersectionObserver" in window && sections.length && sectionLinks.size) {
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let best = null, bestRatio = 0;
      visible.forEach((ratio, id) => { if (ratio > bestRatio) { best = id; bestRatio = ratio; } });
      sectionLinks.forEach((a, id) => {
        if (id === best) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.01, 0.5, 1] });
    sections.forEach((s) => io.observe(s));
  }

  /* Reveal on scroll */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => ro.observe(el));
  }

  /* Copy to clipboard */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        toast("Email address copied");
      } catch {
        window.prompt("Copy the email address:", text);
      }
    });
  });

  /* Project gallery: filter, search, sort, show more */
  const gallery = $("[data-gallery]");
  if (gallery) {
    const PAGE_SIZE = 9;
    const grid = $("[data-gallery-grid]", gallery);
    const items = $$(".gallery-item", grid);
    const search = $("[data-gallery-search]", gallery);
    const sortSel = $("[data-gallery-sort]", gallery);
    const statusSel = $("[data-gallery-status-filter]", gallery);
    const chips = $$("[data-filter]", gallery);
    const status = $("[data-gallery-status]", gallery);
    const empty = $("[data-gallery-empty]", gallery);
    const moreWrap = $("[data-gallery-more-wrap]", gallery);
    const moreBtn = $("[data-gallery-more]", gallery);
    const resetBtn = $("[data-gallery-reset]", gallery);
    const total = items.length;
    const chipLabel = (id) => {
      const chip = chips.find((c) => c.dataset.filter === id);
      return chip ? chip.firstChild.textContent.trim() : id;
    };

    const statusLabel = (id) => {
      const opt = statusSel && Array.from(statusSel.options).find((o) => o.value === id);
      return opt ? opt.textContent.replace(/\s*\(\d+\)$/, "").toLowerCase() : id;
    };

    const state = { filter: "all", status: "all", query: "", sort: "featured", expanded: false };

    const comparators = {
      featured: (a, b) => (+a.dataset.rank - +b.dataset.rank) || b.dataset.updated.localeCompare(a.dataset.updated),
      updated: (a, b) => b.dataset.updated.localeCompare(a.dataset.updated),
      alpha: (a, b) => a.dataset.title.localeCompare(b.dataset.title),
    };

    function render({ announce = true } = {}) {
      const tokens = state.query.toLowerCase().split(/\s+/).filter(Boolean);
      const matches = items
        .filter((el) => state.filter === "all" || el.dataset.categories.split(" ").includes(state.filter))
        .filter((el) => state.status === "all" || el.dataset.status === state.status)
        .filter((el) => tokens.every((t) => el.dataset.search.includes(t)))
        .sort(comparators[state.sort]);

      const sorted = [...items].sort(comparators[state.sort]);
      sorted.forEach((el) => grid.appendChild(el));

      const unfiltered = state.filter === "all" && state.status === "all" && !tokens.length;
      const paginate = unfiltered && !state.expanded;
      const shown = paginate ? matches.slice(0, PAGE_SIZE) : matches;
      const shownSet = new Set(shown);
      items.forEach((el) => { el.hidden = !shownSet.has(el); });

      empty.hidden = matches.length !== 0;
      const showMore = paginate && matches.length > PAGE_SIZE;
      moreWrap.hidden = !showMore;
      if (showMore) moreBtn.textContent = `Show all ${matches.length} projects`;

      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === state.filter)));

      if (announce) {
        let msg;
        if (!matches.length) msg = "No projects match.";
        else if (shown.length < matches.length) msg = `Showing ${shown.length} of ${matches.length} projects.`;
        else if (unfiltered) msg = `Showing all ${total} projects.`;
        else {
          const parts = [];
          if (state.status !== "all") parts.push(`marked ${statusLabel(state.status)}`);
          if (state.filter !== "all") parts.push(`in ${chipLabel(state.filter)}`);
          if (tokens.length) parts.push(`matching "${state.query.trim()}"`);
          msg = `${matches.length} ${matches.length === 1 ? "project" : "projects"} ${parts.join(" ")}.`;
        }
        status.textContent = msg;
      }
    }

    let searchTimer;
    search.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.query = search.value; render(); }, 120);
    });
    sortSel.addEventListener("change", () => { state.sort = sortSel.value; render(); });
    statusSel && statusSel.addEventListener("change", () => { state.status = statusSel.value; render(); });
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && search.value) { e.preventDefault(); search.value = ""; state.query = ""; render(); }
    });
    chips.forEach((chip) => chip.addEventListener("click", () => { state.filter = chip.dataset.filter; render(); }));
    moreBtn.addEventListener("click", () => {
      const firstHidden = items.find((el) => el.hidden);
      state.expanded = true;
      render();
      const link = firstHidden && firstHidden.querySelector(".card-title a");
      link && link.focus({ preventScroll: false });
    });
    function resetFilters() {
      state.filter = "all"; state.status = "all"; state.query = ""; search.value = "";
      if (statusSel) statusSel.value = "all";
    }
    resetBtn.addEventListener("click", () => {
      resetFilters();
      render();
      search.focus();
    });

    /* Skill chips jump to the gallery filtered by that technology */
    $$("[data-skill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        resetFilters();
        state.query = btn.dataset.skill;
        search.value = btn.dataset.skill;
        render();
        gallery.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        search.focus({ preventScroll: true });
      });
    });

    render();
  }
})();
