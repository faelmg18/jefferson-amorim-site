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

  // Back to top
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

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

});
