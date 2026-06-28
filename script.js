(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    theme: 'dark',
    selectedCategory: 'All',
    searchTerm: '',
    sortMode: 'soonest',
  };

  const events = [
    {
      id: 'tech-summit',
      name: 'Tech Summit: Future Builders',
      date: '2026-10-12',
      location: 'San Francisco',
      category: 'Tech',
      description:
        'Hands-on workshops, networking, and product talks with industry leaders. Meet builders, share ideas, and ship faster with practical sessions.',
      short: 'Workshops, networking, and product talks with industry leaders.',
      popularity: 96,
      featured: true,
      bannerKind: 'aurora',
    },
    {
      id: 'code-night',
      name: 'Code Night: Build in Public',
      date: '2026-09-08',
      location: 'Austin',
      category: 'Tech',
      description:
        'An evening of guided sessions where you build in public—small challenges, peer feedback, and lightning demos.',
      short: 'Guided build sessions with peer feedback and lightning demos.',
      popularity: 88,
      bannerKind: 'nebula',
    },
    {
      id: 'music-festival',
      name: 'Nightwave Music Festival',
      date: '2026-08-21',
      location: 'Seattle',
      category: 'Music',
      description:
        'A curated lineup of indie and electronic artists with immersive visuals, food vendors, and community vibes.',
      short: 'Curated indie + electronic lineup with immersive visuals.',
      popularity: 91,
      bannerKind: 'prism',
    },
    {
      id: 'startup-sessions',
      name: 'Startup Sessions: Pitch & Grow',
      date: '2026-11-03',
      location: 'Chicago',
      category: 'Education',
      description:
        'A practical series for founders: story, traction, and fundraising. Includes mentor office hours and mock pitch reviews.',
      short: 'Founder-focused education with mentors and mock pitch reviews.',
      popularity: 84,
      bannerKind: 'aurora',
    },
    {
      id: 'city-run',
      name: 'City Run for Good',
      date: '2026-07-30',
      location: 'Miami',
      category: 'Sports',
      description:
        'A family-friendly 5K and community walk supporting local nonprofits. Includes hydration stations and post-race celebrations.',
      short: 'Family-friendly 5K + walk supporting local nonprofits.',
      popularity: 76,
      bannerKind: 'prism',
    },
    {
      id: 'classical-salon',
      name: 'Classical Salon: Evening Strings',
      date: '2026-10-27',
      location: 'Boston',
      category: 'Music',
      description:
        'An intimate performance series featuring emerging ensembles—crafted acoustics, warm lighting, and curated program notes.',
      short: 'Intimate ensemble performance with curated program notes.',
      popularity: 79,
      bannerKind: 'nebula',
    },
    {
      id: 'sports-clinic',
      name: 'Performance Clinic: Train Smarter',
      date: '2026-09-18',
      location: 'Denver',
      category: 'Sports',
      description:
        'Coaching clinic focused on mobility, strength fundamentals, and recovery. Includes assessments and personalized plans.',
      short: 'Mobility + strength fundamentals with coaching assessments.',
      popularity: 82,
      bannerKind: 'aurora',
    },
    {
      id: 'design-workshop',
      name: 'Design Workshop: Systems that Scale',
      date: '2026-08-30',
      location: 'New York',
      category: 'Education',
      description:
        'Learn how to build design systems that scale: tokens, components, accessibility, and governance—plus teardown reviews.',
      short: 'Build scalable design systems with tokens, components, and governance.',
      popularity: 93,
      bannerKind: 'prism',
    },
  ];

  const registeredEventIds = new Set(['tech-summit', 'design-workshop', 'music-festival']);

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  function daysUntil(iso) {
    const today = new Date();
    const d = new Date(iso + 'T00:00:00');
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
  }

  function bannerGradient(kind) {
    switch (kind) {
      case 'nebula':
        return 'linear-gradient(135deg, rgba(109,91,255,.28), rgba(58,167,255,.14))';
      case 'prism':
        return 'linear-gradient(135deg, rgba(58,167,255,.24), rgba(46,233,166,.12))';
      default:
        return 'linear-gradient(135deg, rgba(109,91,255,.22), rgba(46,233,166,.12))';
    }
  }

  function createEventCard(e) {
    const registered = registeredEventIds.has(e.id);
    const chip = e.category;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'event-card';
    card.setAttribute('aria-label', `Open details for ${e.name}`);
    card.dataset.eventId = e.id;

    card.innerHTML = `
      <div class="card-top">
        <div class="category-chip"><span class="cat-dot" aria-hidden="true"></span>${chip}</div>
        <div class="meta-pill" style="gap:8px;">
          <span aria-hidden="true">★</span>
          <span>${e.popularity}</span>
        </div>
      </div>
      <div class="card-title">${e.name}</div>
      <div class="card-desc">${e.short}</div>
      <div class="card-meta">
        <div class="meta-pill">📅 <span>${formatDate(e.date)}</span></div>
        <div class="meta-pill">📍 <span>${e.location}</span></div>
        ${registered ? `<div class="meta-pill" style="border-color: rgba(46,233,166,.35); background: rgba(46,233,166,.12); color: rgba(190,255,234,.95);">✓ Registered</div>` : ''}
      </div>
    `;

    return card;
  }

  function getFilteredEvents() {
    const term = state.searchTerm.trim().toLowerCase();

    let list = events.filter((e) => {
      const catOk = state.selectedCategory === 'All' ? true : e.category === state.selectedCategory;
      const termOk =
        !term ||
        e.name.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term);
      return catOk && termOk;
    });

    if (state.sortMode === 'soonest') {
      list = list.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      list = list.slice().sort((a, b) => b.popularity - a.popularity);
    }

    return list;
  }

  function renderFeatured() {
    const featured = events.find((e) => e.featured) || events[0];
    $('#featuredTitle').textContent = featured.name;
    $('#featuredDate').textContent = formatDate(featured.date);
    $('#featuredLocation').textContent = featured.location;
    $('#featuredDesc').textContent = featured.short;

    const openFeatured = $('#openFeatured');
    openFeatured.onclick = () => openModal(featured.id);
    $('#saveFeatured').onclick = () => toggleToast('Saved to your favorites (UI-only).');

    const grid = $('#featuredGrid');
    const featuredEvents = events
      .filter((e) => e.id !== featured.id)
      .slice(0, 3);
    grid.innerHTML = '';
    featuredEvents.forEach((e) => {
      grid.appendChild(createEventCard(e));
    });
  }

  function renderEvents() {
    const grid = $('#eventsGrid');
    const empty = $('#emptyState');
    const list = getFilteredEvents();

    grid.innerHTML = '';

    if (list.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    list.forEach((e) => grid.appendChild(createEventCard(e)));
  }

  function syncCategoryUI() {
    $$('.cat', document).forEach((btn) => {
      const active = btn.dataset.cat === state.selectedCategory;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.classList.toggle('active', active);
    });
  }

  function setModalContent(e) {
    const modal = $('#eventModal');
    const category = $('#modalCategory');
    const banner = $('#modalBanner');
    const title = $('#modalTitle');
    const date = $('#modalDate');
    const location = $('#modalLocation');
    const desc = $('#modalDesc');

    category.textContent = e.category;
    banner.style.background = bannerGradient(e.bannerKind);
    banner.setAttribute('aria-hidden', 'false');
    title.textContent = e.name;
    date.textContent = formatDate(e.date);
    location.textContent = e.location;
    desc.textContent = e.description;

    $('#registerBtn').onclick = () => {
      toggleToast('Registered successfully (UI-only).');
      closeModal();
    };

    modal.dataset.eventId = e.id;
  }

  function openModal(eventId) {
    const e = events.find((x) => x.id === eventId);
    if (!e) return;

    setModalContent(e);
    $('#eventModal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setHeaderElevated(true);
  }

  function closeModal() {
    const modal = $('#eventModal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setHeaderElevated(v) {
    const header = $('.site-header');
    header.dataset.elevated = v ? 'true' : 'false';
  }

  let toastTimer = null;
  function toggleToast(message) {
    const toast = $('#createToast');
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2300);
  }

  function renderDashboard() {
    const totalEvents = events.length;
    const registered = registeredEventIds.size;
    const categories = new Set(events.map((e) => e.category)).size;

    $('#statTotal').textContent = String(totalEvents);
    $('#statRegistered').textContent = String(registered);
    $('#statCategories').textContent = String(categories);

    const list = events.filter((e) => registeredEventIds.has(e.id));

    const regList = $('#regList');
    regList.innerHTML = '';
    list
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((e) => {
        const item = document.createElement('div');
        item.className = 'reg-item';
        item.innerHTML = `
          <div class="reg-left">
            <div class="reg-name">${e.name}</div>
            <div class="reg-meta">${formatDate(e.date)} • ${e.location}</div>
          </div>
          <div class="meta-pill" style="border-color: rgba(46,233,166,.35); background: rgba(46,233,166,.12); color: rgba(190,255,234,.95);">✓ Registered</div>
        `;
        regList.appendChild(item);
      });

    // Highlights
    const highlights = $('#highlights');
    highlights.innerHTML = '';
    const upcoming = events
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((e) => daysUntil(e.date) >= -7) // recent/upcoming
      .slice(0, 3);

    upcoming.forEach((e) => {
      const hl = document.createElement('div');
      hl.className = 'hl hl';
      hl.innerHTML = `
        <div class="hl-top">
          <div class="hl-title">${e.name}</div>
          <div class="chip">${e.category}</div>
        </div>
        <div class="hl-desc">${e.short}</div>
      `;
      highlights.appendChild(hl);
    });
  }

  function initCategories() {
    syncCategoryUI();
    $$('.cat').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedCategory = btn.dataset.cat;
        syncCategoryUI();
        renderEvents();
      });
    });
  }

  function initTools() {
    $('#searchInput').addEventListener('input', (e) => {
      state.searchTerm = e.target.value || '';
      renderEvents();
    });

    $$('.seg-btn').forEach((b) => {
      b.addEventListener('click', () => {
        $$('.seg-btn').forEach((x) => x.classList.remove('is-active'));
        b.classList.add('is-active', 'is-active');
        state.sortMode = b.dataset.sort;
        renderEvents();
      });
    });
  }

  function initModal() {
    const modal = $('#eventModal');

    document.addEventListener('click', (e) => {
      const card = e.target.closest('.event-card');
      if (card && card.dataset.eventId) openModal(card.dataset.eventId);
    });

    modal.addEventListener('click', (e) => {
      if (e.target && e.target.matches('[data-close]')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Backdrop click
    const backdrop = $('.modal-backdrop', modal);
    if (backdrop) {
      backdrop.addEventListener('click', () => closeModal());
    }
  }

  function initHeaderMenu() {
    const burger = $('.burger');
    const menu = $('#mobileMenu');

    const toggle = () => {
      const hidden = menu.hasAttribute('hidden');
      if (hidden) {
        menu.hidden = false;
      } else {
        menu.hidden = true;
      }
    };

    if (burger) {
      burger.addEventListener('click', () => toggle());
    }

    $$('#mobileMenu a, #mobileMenu .btn', document).forEach((a) => {
      a.addEventListener('click', () => {
        if (!menu.hasAttribute('hidden')) menu.hidden = true;
      });
    });
  }

  function initThemeToggle() {
    const themeToggle = $('#themeToggle');

    const apply = () => {
      document.documentElement.setAttribute('data-theme', state.theme);
      try {
        localStorage.setItem('aurora-theme', state.theme);
      } catch (_) {}
    };

    const load = () => {
      try {
        const saved = localStorage.getItem('aurora-theme');
        if (saved === 'light' || saved === 'dark') state.theme = saved;
      } catch (_) {}
    };

    load();
    apply();

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        apply();
      });
    }
  }

  function initCreateForm() {
    const form = $('#createForm');
    const resetBtn = $('#resetCreate');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      toggleToast('Event submitted (UI-only).');
    });

    resetBtn?.addEventListener('click', () => {
      form.reset();
      toggleToast('Form reset.');
    });
  }

  // Fix segment active class toggle bug
  function patchSortUI() {
    $$('.seg-btn').forEach((b) => {
      if (b.dataset.sort === state.sortMode) b.classList.add('is-active');
    });
  }

  function applyScrollShadow() {
    const header = $('.site-header');
    const onScroll = () => {
      if (!header) return;
      const elevate = window.scrollY > 10;
      header.dataset.elevated = elevate ? 'true' : 'false';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    renderFeatured();
    initCategories();
    initTools();
    patchSortUI();
    renderEvents();
    initModal();
    initDashboard();
    initHeaderMenu();
    initThemeToggle();
    initCreateForm();
    applyScrollShadow();
  }

  function initDashboard() {
    renderDashboard();
  }

  init();
})();

