/* ============================================================
   THEME SYSTEM
============================================================ */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');
const RESUME_ASSET_PATH = 'assets/KARTHICK_RAJA_Data_Analyst.pdf';
const THEME_COLORS = {
  light: '#fcfbf9',
  dark: '#0c0a08'
};
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-resume-link]').forEach(link => {
  link.setAttribute('href', RESUME_ASSET_PATH);
});

function setTheme(theme, persist = true) {
  if (!html || !themeIcon) return;

  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeIcon.className = 'ti ti-sun';
  } else {
    html.setAttribute('data-theme', 'light');
    themeIcon.className = 'ti ti-moon';
  }

  if (themeBtn) {
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  const color = THEME_COLORS[theme] || THEME_COLORS.light;
  themeColorMetas.forEach(meta => {
    if (!meta.hasAttribute('media')) meta.setAttribute('content', color);
  });

  if (persist) {
    try { localStorage.setItem('theme', theme); } catch (_) { /* storage blocked */ }
  }
}

// Initialize theme preference
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (_) { /* ignore */ }
const defaultTheme = window.innerWidth <= 768 ? 'light' : 'light';
setTheme(savedTheme || defaultTheme, false);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}


/* ============================================================
   TYPING ANIMATION
============================================================ */
const typedEl = document.getElementById('typedText');
const roles = [
  'Power BI Developer',
  'Business Intelligence Analyst',
  'SQL & ETL Developer',
  'Microsoft Fabric Specialist',
  'DAX & Data Modeling'
];
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
    typeSpeed = 40;
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 90;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typeSpeed = 2200;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 400;
  }
  setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);


/* ============================================================
   SKILL BARS ANIMATION ON SCROLL
============================================================ */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (!skillFills.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    skillFills.forEach(fill => {
      fill.style.width = fill.getAttribute('data-progress') || '85%';
    });
    return;
  }

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach((fill, index) => {
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-progress') || '85%';
          }, index * 100);
        });
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsCard = document.querySelector('.skills-progress-card');
  if (skillsCard) {
    skillsObserver.observe(skillsCard);
  }
}
document.addEventListener('DOMContentLoaded', initSkillBars);


/* ============================================================
   NAV SCROLL SPY & FROSTED GLASS EFFECT
============================================================ */
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
let lastScrollY = 0;
let scrollFrameRequested = false;

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

  nav.classList.toggle('scrolled', y > 20);

  if (y > lastScrollY + 10 && y > 100) {
    nav.classList.add('hidden');
  } else if (y < lastScrollY || y < 100) {
    nav.classList.remove('hidden');
  }

  lastScrollY = y;

  const backTopBtn = document.getElementById('backTop');
  if (backTopBtn) {
    backTopBtn.classList.toggle('show', y > 500);
  }

  updateActiveSectionFromScroll(y);
}

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
   MOBILE NAVIGATION
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
  hamburger.addEventListener('click', openMobileMenu);
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
   SMOOTH SCROLL FOR ANCHOR LINKS
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
   PROJECT ACCORDIONS
============================================================ */
function toggleProject(header) {
  const item = header.closest('.project-item');
  if (!item) return;

  const body = item.querySelector('.project-body');
  const icon = header.querySelector('.project-arrow i');
  if (!body || !icon) return;

  const isOpen = body.classList.contains('open');

  // Close other open accordions
  document.querySelectorAll('.project-body.open').forEach(b => {
    b.classList.remove('open');
    const headerEl = b.closest('.project-item')?.querySelector('.project-header');
    if (headerEl) headerEl.setAttribute('aria-expanded', 'false');
    const arrowIcon = b.closest('.project-item')?.querySelector('.project-arrow i');
    if (arrowIcon) arrowIcon.style.transform = '';
  });

  if (!isOpen) {
    body.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
    icon.style.transform = 'rotate(180deg)';
  } else {
    header.setAttribute('aria-expanded', 'false');
  }
}

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

projectFilterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterKey = btn.getAttribute('data-filter') || 'all';
    setActiveFilterButton(btn);
    applyProjectFilter(filterKey);
  });
});


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
  }, 1800);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'karthickraja232205@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      showCopyToast('Email copied to clipboard!');
    } catch (err) {
      showCopyToast('Copy failed, please write to: ' + email);
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
    el.style.transitionDelay = `${(i % 4) * 0.06}s`;
    fadeObserver.observe(el);
  });
}


/* ============================================================
   IMAGE ERROR HANDLING
============================================================ */
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
