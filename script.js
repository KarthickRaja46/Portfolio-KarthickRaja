/* ============================================================
   THEME SYSTEM
============================================================ */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon';
  localStorage.setItem('theme', theme);
}

// Initialize theme: saved preference → system preference → default dark
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

// Toggle on button click
themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

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
  document.getElementById('backTop').classList.toggle('show', y > 500);

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
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   MOBILE MENU
============================================================ */
const mobileMenu  = document.getElementById('mobileMenu');
const hamburger   = document.getElementById('hamburger');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

mobileClose.addEventListener('click', closeMobileMenu);

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================================
   PROJECT ACCORDION
============================================================ */
function toggleProject(header) {
  const item   = header.closest('.project-item');
  const body   = item.querySelector('.project-body');
  const icon   = header.querySelector('.project-arrow i');
  const isOpen = body.classList.contains('open');

  // Close all open panels first
  document.querySelectorAll('.project-body.open').forEach(b => {
    b.classList.remove('open');
    b.closest('.project-item').querySelector('.project-arrow i').style.transform = '';
  });

  // Open clicked panel (if it was closed)
  if (!isOpen) {
    body.classList.add('open');
    icon.style.transform = 'rotate(180deg)';
  }
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
