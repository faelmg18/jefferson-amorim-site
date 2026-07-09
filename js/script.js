document.addEventListener('DOMContentLoaded', () => {

  // AOS init
  if (window.AOS) AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });

  // Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 250);
  });

  // Header scroll state
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    const toTop = document.getElementById('toTop');
    if (window.scrollY > 600) toTop.classList.add('is-visible');
    else toTop.classList.remove('is-visible');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
    });
  });

  // Back to top (scroll animado com easing, mais suave que o "smooth" nativo)
  const smoothScrollTo = (targetY, duration = 900) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Evita que o "scroll-behavior: smooth" do CSS brigue com o scroll manual por frame
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      window.scrollTo(0, startY + diff * easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
      else root.style.scrollBehavior = previousBehavior;
    };
    requestAnimationFrame(step);
  };

  document.getElementById('toTop').addEventListener('click', () => {
    smoothScrollTo(0);
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Cursor glow (desktop pointer only)
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  // Animated counters
  const counters = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const isYear = el.dataset.format === 'year';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = isYear ? current : current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));

  // Reviews carousel
  const track = document.getElementById('reviewsTrack');
  const dotsWrap = document.getElementById('reviewsDots');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');

  if (track && dotsWrap && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let index = 0;
    let autoplay;

    track.style.width = `${slides.length * 100}%`;
    slides.forEach(s => { s.style.width = `${100 / slides.length}%`; });

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ir para avaliação ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      const slideWidth = track.parentElement.clientWidth;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
    }

    function restartAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(() => goTo(index + 1), 6000);
    }

    prevBtn.addEventListener('click', () => { goTo(index - 1); restartAutoplay(); });
    nextBtn.addEventListener('click', () => { goTo(index + 1); restartAutoplay(); });
    window.addEventListener('resize', () => goTo(index));

    const slider = track.closest('.reviews-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', restartAutoplay);

    restartAutoplay();
  }

});
