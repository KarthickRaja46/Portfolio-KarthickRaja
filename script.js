/* ============================================================
   THEME SYSTEM
============================================================ */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');
const RESUME_ASSET_PATH = 'assets/Karthick_Raja_BI_Resume.pdf';
const THEME_COLORS = {
  light: '#fdfdfc',
  dark: '#0a0a0b'
};
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

document.querySelectorAll('[data-resume-link]').forEach(link => {
  link.setAttribute('href', RESUME_ASSET_PATH);
});

function setTheme(theme, persist = true) {
  if (!html || !themeIcon) return;

  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeIcon.className = 'ti ti-sun';
  } else {
    // Light is the default in :root
    html.setAttribute('data-theme', 'light');
    themeIcon.className = 'ti ti-moon';
  }

  if (themeBtn) {
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  // Keep both light/dark theme-color metas in sync (for browsers that ignore media)
  const color = THEME_COLORS[theme] || THEME_COLORS.light;
  themeColorMetas.forEach(meta => {
    if (!meta.hasAttribute('media')) meta.setAttribute('content', color);
  });

  if (persist) {
    try { localStorage.setItem('theme', theme); } catch (_) { /* storage may be blocked */ }
  }
}

// Initialize theme: saved preference -> system preference -> light
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (_) { /* ignore */ }
setTheme(savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light'), false);

// Toggle on button click
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Follow system theme changes when the user hasn't explicitly chosen one
if (prefersDarkScheme.addEventListener) {
  prefersDarkScheme.addEventListener('change', e => {
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch (_) { /* ignore */ }
    if (!stored) setTheme(e.matches ? 'dark' : 'light', false);
  });
}




/* ============================================================
   TYPING ANIMATION
============================================================ */
const typedEl = document.getElementById('typedText');
const roles = ['Data Analyst', 'ETL Developer', 'Computer Science Student', 'ML Enthusiast'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  if (!typedEl) return;
  if (prefersReducedMotion) {
    typedEl.textContent = roles[0];
    return;
  }
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }
  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typeSpeed = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500;
  }
  setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);


/* ============================================================
   NAV — SCROLL HIDE/SHOW + SCROLLED STATE
============================================================ */
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
let lastScrollY = 0;

function syncActiveNavLinks(sectionId) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function updateActiveSectionFromScroll(scrollY) {
  let activeSectionId = sections[0]?.id || 'home';

  sections.forEach(sec => {
    const top = sec.offsetTop - 130;
    const bottom = top + sec.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      activeSectionId = sec.id;
    }
  });

  syncActiveNavLinks(activeSectionId);
}

window.addEventListener('scroll', () => {
  if (scrollFrameRequested) return;
  scrollFrameRequested = true;
  window.requestAnimationFrame(() => {
    scrollFrameRequested = false;
    handleScroll();
  });
}, { passive: true });

function handleScroll() {
  if (!nav) return;

  const y = window.scrollY;

  // Frosted glass background after 20px
  nav.classList.toggle('scrolled', y > 20);

  // Hide nav on scroll down, reveal on scroll up
  if (y > lastScrollY + 8 && y > 80) {
    nav.classList.add('hidden');
  } else if (y < lastScrollY || y < 80) {
    nav.classList.remove('hidden');
  }

  lastScrollY = y;

  // Back-to-top button visibility
  const backTopBtn = document.getElementById('backTop');
  if (backTopBtn) {
    backTopBtn.classList.toggle('show', y > 500);
  }

  // Scroll spy — highlight active nav link
  updateActiveSectionFromScroll(y);
}

let scrollFrameRequested = false;

updateActiveSectionFromScroll(window.scrollY);


/* ============================================================
   BACK TO TOP
============================================================ */
const backTop = document.getElementById('backTop');
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}


/* ============================================================
   MOBILE MENU
============================================================ */
const mobileMenu  = document.getElementById('mobileMenu');
const hamburger   = document.getElementById('hamburger');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    openMobileMenu();
  });
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileMenu);
}

const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    closeMobileMenu();
  }
});


/* ============================================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      closeMobileMenu();
    }
  });
});


/* ============================================================
   PROJECT ACCORDION
============================================================ */
function toggleProject(header) {
  const item   = header.closest('.project-item');
  if (!item) return;
  
  const body   = item.querySelector('.project-body');
  const icon   = header.querySelector('.project-arrow i');
  
  if (!body || !icon) return;
  
  const isOpen = body.classList.contains('open');

  // Close all open panels first
  document.querySelectorAll('.project-body.open').forEach(b => {
    b.classList.remove('open');
    const headerEl = b.closest('.project-item')?.querySelector('.project-header');
    if (headerEl) {
      headerEl.setAttribute('aria-expanded', 'false');
    }
    const arrowIcon = b.closest('.project-item')?.querySelector('.project-arrow i');
    if (arrowIcon) {
      arrowIcon.style.transform = '';
    }
  });

  // Open clicked panel (if it was closed)
  if (!isOpen) {
    body.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
    icon.style.transform = 'rotate(180deg)';
  } else {
    header.setAttribute('aria-expanded', 'false');
  }
}

// Keyboard support for project accordion headers
document.querySelectorAll('.project-header').forEach(header => {
  header.addEventListener('click', () => {
    toggleProject(header);
  });
});

/* ============================================================
   PROJECT FILTER BAR
============================================================ */
const projectFilterButtons = document.querySelectorAll('.projects-filter-btn');
const projectItems = document.querySelectorAll('.project-item');
const projectsEmpty = document.getElementById('projectsEmpty');

function closeProjectItem(item) {
  const body = item.querySelector('.project-body');
  const header = item.querySelector('.project-header');
  const arrowIcon = item.querySelector('.project-arrow i');

  if (body) body.classList.remove('open');
  if (header) header.setAttribute('aria-expanded', 'false');
  if (arrowIcon) arrowIcon.style.transform = '';
}

function setActiveFilterButton(activeBtn) {
  projectFilterButtons.forEach(btn => {
    const isActive = btn === activeBtn;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function applyProjectFilter(filterKey) {
  let visibleCount = 0;

  projectItems.forEach(item => {
    const tag = (item.getAttribute('data-project-tag') || '').toLowerCase();
    const visible = filterKey === 'all' || tag === filterKey;

    if (visible) {
      item.classList.remove('is-filter-hidden');
      visibleCount += 1;
    } else {
      closeProjectItem(item);
      item.classList.add('is-filter-hidden');
    }
  });

  if (projectsEmpty) {
    projectsEmpty.classList.toggle('show', visibleCount === 0);
  }
}

function getFilterKeyFromUrl() {
  const allowed = new Set(['all', 'ai', 'api', 'excel', 'sql']);

  // Supports URLs like #projects?tag=ai
  const hash = window.location.hash || '';
  if (hash.startsWith('#projects?')) {
    const hashQuery = hash.slice('#projects?'.length);
    const params = new URLSearchParams(hashQuery);
    const hashTag = (params.get('tag') || '').toLowerCase();
    if (allowed.has(hashTag)) return hashTag === 'sql' ? 'api' : hashTag;
  }

  // Also supports URLs like ?tag=ai#projects
  const searchParams = new URLSearchParams(window.location.search);
  const searchTag = (searchParams.get('tag') || '').toLowerCase();
  if (allowed.has(searchTag)) return searchTag === 'sql' ? 'api' : searchTag;

  return 'all';
}

function updateProjectsUrl(filterKey) {
  const nextHash = filterKey === 'all' ? '#projects' : `#projects?tag=${filterKey}`;
  if (window.location.hash !== nextHash) {
    history.replaceState(null, '', nextHash);
  }
}

function applyFilterAndOpenFirstVisible(filterKey) {
  applyProjectFilter(filterKey);

  const firstVisibleHeader = document.querySelector('.project-item:not(.is-filter-hidden) .project-header');
  if (firstVisibleHeader) {
    toggleProject(firstVisibleHeader);
  }
}

projectFilterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterKey = btn.getAttribute('data-filter') || 'all';
    setActiveFilterButton(btn);
    applyFilterAndOpenFirstVisible(filterKey);
    updateProjectsUrl(filterKey);
  });
});

// Apply initial filter from URL and auto-open first visible project
const initialFilterKey = getFilterKeyFromUrl();
const initialActiveButton = document.querySelector(`.projects-filter-btn[data-filter="${initialFilterKey}"]`) || document.querySelector('.projects-filter-btn[data-filter="all"]');
if (initialActiveButton) {
  setActiveFilterButton(initialActiveButton);
}
applyFilterAndOpenFirstVisible(initialFilterKey);

// Ensure shared #projects?tag=* links still land on Projects section
if ((window.location.hash || '').startsWith('#projects')) {
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    window.setTimeout(() => {
      projectsSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }, 0);
  }
}

/* ============================================================
   COPY EMAIL QUICK ACTION
============================================================ */
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyToast = document.getElementById('copyToast');

function showCopyToast(message) {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.classList.add('show');
  window.setTimeout(() => {
    copyToast.classList.remove('show');
  }, 1700);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'karthiikarthii46@gmail.com';

    try {
      await navigator.clipboard.writeText(email);
      showCopyToast('Email copied');
    } catch (err) {
      showCopyToast('Copy failed, use email link');
    }
  });
}


/* ============================================================
   FADE-UP SCROLL ANIMATIONS (IntersectionObserver)
============================================================ */
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
} else {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    // Stagger children in the same parent
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
    fadeObserver.observe(el);
  });
}


/* ============================================================
   PARALLAX HERO ORBS (subtle)
============================================================ */
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');

if (orb1 && orb2 && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      orb1.style.transform = `translateY(${y * 0.14}px)`;
      orb2.style.transform = `translateY(${y * -0.09}px)`;
    }
  }, { passive: true });
}



document.querySelectorAll('img[data-hide-on-error]').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
});

document.querySelectorAll('img[data-fallback-parent-bg]').forEach(img => {
  img.addEventListener('error', () => {
    const parent = img.parentElement;
    if (parent) {
      parent.style.background = 'var(--bg-elevated)';
    }
  });
});

/* ============================================================
   FOOTER YEAR
============================================================ */
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}
