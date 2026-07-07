/* Lightweight dependency-free slider used by the hero and photo sliders.
 *
 * Markup contract:
 *   <div data-slider data-autoplay="6000">
 *     <div class="...-track"> <slide/> <slide/> ... </div>
 *   </div>
 *
 * Features: swipe/drag (pointer events), arrows + dots (generated), keyboard
 * navigation, autoplay with pause on hover/focus/hidden tab, ARIA carousel
 * semantics, and prefers-reduced-motion support.
 */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function svgChevron(dir) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
      '<path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="' +
      (dir < 0 ? 'M15 4 L7 12 L15 20' : 'M9 4 L17 12 L9 20') + '"/></svg>';
  }

  function initSlider(root) {
    var track = root.firstElementChild;
    while (track && track.nodeType !== 1) track = track.nextElementSibling;
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;

    var index = 0;
    var autoplayMs = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
    var timer = null;
    var hovered = false;

    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.classList.add('js-slider');
    slides.forEach(function (s, i) {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
    });

    // Controls
    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'sl-arrow sl-prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = svgChevron(-1);

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'sl-arrow sl-next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = svgChevron(1);

    var dots = document.createElement('div');
    dots.className = 'sl-dots';
    var dotBtns = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sl-dot';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', function () { goTo(i); restart(); });
      dots.appendChild(b);
      return b;
    });

    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    root.appendChild(dots);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, j) { s.classList.toggle('active', j === index); });
      dotBtns.forEach(function (d, j) {
        d.classList.toggle('active', j === index);
        if (j === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1); restart(); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); restart(); });

    // Keyboard
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(index - 1); restart(); }
      if (e.key === 'ArrowRight') { goTo(index + 1); restart(); }
    });

    // Swipe / drag with pointer events
    var startX = null, deltaX = 0, width = 0, dragging = false;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startX = e.clientX;
      deltaX = 0;
      width = root.offsetWidth;
      dragging = true;
      track.style.transition = 'none';
      stop();
    });

    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      deltaX = e.clientX - startX;
      // resist edges slightly
      var pct = (-index * 100) + (deltaX / width) * 100;
      track.style.transform = 'translateX(' + pct + '%)';
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      track.style.transition = '';
      if (Math.abs(deltaX) > Math.max(40, width * 0.15)) {
        goTo(deltaX < 0 ? index + 1 : index - 1);
      } else {
        goTo(index);
      }
      restart();
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Prevent image ghost-drag
    track.querySelectorAll('img').forEach(function (img) {
      img.setAttribute('draggable', 'false');
    });

    // Autoplay
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function start() {
      if (!autoplayMs || reducedMotion || hovered || document.hidden) return;
      stop();
      timer = setInterval(function () { goTo(index + 1); }, autoplayMs);
    }
    function restart() { stop(); start(); }

    root.addEventListener('mouseenter', function () { hovered = true; stop(); });
    root.addEventListener('mouseleave', function () { hovered = false; start(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    goTo(0);
    start();
  }

  function init() {
    var sliders = document.querySelectorAll('[data-slider]');
    Array.prototype.forEach.call(sliders, initSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
