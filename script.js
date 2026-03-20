/* ============================================================
   THEME SYSTEM
============================================================ */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  if (!html || !themeIcon) return;
  
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon';
  localStorage.setItem('theme', theme);
}

// Initialize theme: saved preference → system preference → default dark
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

// Toggle on button click
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Auto-follow system preference changes (if no saved preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});


/* ============================================================
   TYPING ANIMATION
============================================================ */
const words = ['Python Developer', 'Data Scientist', 'Data Analyst', 'ML Enthusiast'];
let wordIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typedText');

function type() {
  if (!typedEl) return;
  
  const current = words[wordIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 80);
  } else {
    typedEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      isDeleting   = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 45);
  }
}

type();


/* ============================================================
   NAV — SCROLL HIDE/SHOW + SCROLLED STATE
============================================================ */
const nav = document.getElementById('nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
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
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const top    = sec.offsetTop - 130;
    const bottom = top + sec.offsetHeight;
    if (y >= top && y < bottom) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`);
      });
    }
  });
}, { passive: true });


/* ============================================================
   BACK TO TOP
============================================================ */
const backTop = document.getElementById('backTop');
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   MOBILE MENU
============================================================ */
const mobileMenu  = document.getElementById('mobileMenu');
const hamburger   = document.getElementById('hamburger');
const mobileClose = document.getElementById('mobileClose');

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileMenu);
}

const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});


/* ============================================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProject(header);
    }
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
  const allowed = new Set(['all', 'ai', 'sql', 'excel']);

  // Supports URLs like #projects?tag=ai
  const hash = window.location.hash || '';
  if (hash.startsWith('#projects?')) {
    const hashQuery = hash.slice('#projects?'.length);
    const params = new URLSearchParams(hashQuery);
    const hashTag = (params.get('tag') || '').toLowerCase();
    if (allowed.has(hashTag)) return hashTag;
  }

  // Also supports URLs like ?tag=ai#projects
  const searchParams = new URLSearchParams(window.location.search);
  const searchTag = (searchParams.get('tag') || '').toLowerCase();
  if (allowed.has(searchTag)) return searchTag;

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
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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


/* ============================================================
   PARALLAX HERO ORBS (subtle)
============================================================ */
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');

if (orb1 && orb2) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      orb1.style.transform = `translateY(${y * 0.14}px)`;
      orb2.style.transform = `translateY(${y * -0.09}px)`;
    }
  }, { passive: true });
}
