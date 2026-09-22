/* ═══════════════════════════════════════════════════════════
   Marmik Soni — Portfolio Scripts
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── GSAP Setup ────────────────────────────────────────────
     ScrollTrigger is registered here once so all animations
     across the file can use it without repeating the call.
  ──────────────────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Bezier-based Fluid Scaling ────────────────────────────
     Maps --p from 0 (≤1024px) to 1 (≥2560px) using a custom
     cubic-bezier curve for non-linear, natural scaling.
  ──────────────────────────────────────────────────────────── */
  var MIN_W = 1024, MAX_W = 2560;
  var X1 = 0.35, Y1 = 0.15, X2 = 0.65, Y2 = 0.85;

  function bez(t, a, b) {
    var u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  }

  function bezSlope(t, a, b) {
    var u = 1 - t;
    return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
  }

  function ease(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var t = x, i;
    for (i = 0; i < 8; i++) {
      var err = bez(t, X1, X2) - x;
      if (Math.abs(err) < 1e-6) break;
      var s = bezSlope(t, X1, X2);
      if (Math.abs(s) < 1e-6) break;
      t -= err / s;
    }
    if (!(t >= 0 && t <= 1) || Math.abs(bez(t, X1, X2) - x) > 1e-4) {
      var lo = 0, hi = 1;
      t = x;
      for (i = 0; i < 30; i++) {
        if (bez(t, X1, X2) < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
    }
    return bez(t, Y1, Y2);
  }

  var root = document.documentElement, frame;

  function update() {
    var w = root.clientWidth || window.innerWidth;
    var p = ease((w - MIN_W) / (MAX_W - MIN_W));
    root.style.setProperty('--p', p.toFixed(4));
  }

  update();
  window.addEventListener('resize', function () {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  });

  /* ── DOMContentLoaded ──────────────────────────────────── */
  window.addEventListener('DOMContentLoaded', function () {

    /* ── Theme Toggler ────────────────────────────────────── */
    var btn = document.querySelector('.bar-theme');
    var text = btn.querySelector('.theme-text');

    btn.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      var newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      text.textContent = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
    });

    /* ── Editorial Parallax ───────────────────────────────── */
    var parallaxImages = document.querySelectorAll('.editorial-image img');
    var tickingParallax = false;

    function updateParallax() {
      parallaxImages.forEach(function (img) {
        var rect = img.parentElement.getBoundingClientRect();
        var windowHeight = window.innerHeight;

        if (rect.top <= windowHeight && rect.bottom >= 0) {
          var progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          var y = -15 + (progress * 15);
          img.style.transform = 'translateY(' + y + '%)';
        }
      });
      tickingParallax = false;
    }

    window.addEventListener('scroll', function () {
      if (!tickingParallax) {
        window.requestAnimationFrame(updateParallax);
        tickingParallax = true;
      }
    }, { passive: true });

    updateParallax();

    /* ── Services: Typographic Spotlight ───────────────────── */
    var listItems = Array.from(document.querySelectorAll('#services-list .service-item'));
    var previews = Array.from(document.querySelectorAll('#services-preview .preview-item'));
    var listContainer = document.getElementById('services-list');

    if (listItems.length && previews.length) {
      listItems.forEach(function (item) {
        // Desktop hover
        item.addEventListener('mouseenter', function () {
          if (window.innerWidth <= 1024) return;

          var index = item.getAttribute('data-index');
          previews.forEach(function (p) { p.classList.remove('is-active'); });
          if (previews[index]) {
            previews[index].classList.add('is-active');
          }
        });

        // Mobile accordion
        item.addEventListener('click', function () {
          if (window.innerWidth > 1024) return;

          var isExpanded = item.classList.contains('is-expanded');
          listItems.forEach(function (i) { i.classList.remove('is-expanded'); });
          if (!isExpanded) {
            item.classList.add('is-expanded');
          }
        });
      });

      listContainer.addEventListener('mouseleave', function () {
        previews.forEach(function (p) { p.classList.remove('is-active'); });
      });
    }
  });
})();
