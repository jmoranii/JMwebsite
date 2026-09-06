/* jamesmoran v3 — bespoke page behaviour. The engine is untouched.
   1. folio: the chapter title in the margin
   2. the props: the title's four periods lift off, one per chapter, arc to
      the tray, and juggle real siteswaps (1 bounce, 2 → 31, 3 cascade, 4 → 5551)
   3. the peak: a playable Rolfe Legends 2, loaded only on request
   4. the CV line prints */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var ORDER = ['engineer', 'human', 'analyst', 'builder']; /* story order */

  /* ---------------------------------------------------------- 1. folio -- */
  var folio = document.getElementById('folio-chapter');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  if (folio && chapters.length && 'IntersectionObserver' in window) {
    var setFolio = function (t) {
      if (folio.textContent === t) return;
      folio.classList.add('is-swapping');
      setTimeout(function () { folio.textContent = t; folio.classList.remove('is-swapping'); }, 200);
    };
    var ioF = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setFolio(e.target.getAttribute('data-chapter')); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    chapters.forEach(function (c) { ioF.observe(c); });
  }

  /* ---------------------------------------------------------- 2. props -- */
  var layer = document.getElementById('props');
  var tray = document.getElementById('tray');
  var props = {};
  Array.prototype.forEach.call(document.querySelectorAll('.prop[data-prop]'), function (el) {
    props[el.getAttribute('data-prop')] = { el: el, dot: el.querySelector('.prop__dot') };
  });
  var landed = {}, inPattern = [], rafId = null, holding = false;
  var BALL = function () { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ball')) || 28; };
  var TRAY_BOTTOM = function () { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tray-bottom')) || 26; };

  function makeBall(name) {
    var b = document.createElement('div');
    b.className = 'ball';
    b.setAttribute('data-prop', name);
    return b;
  }
  function verify() {
    tray.setAttribute('data-sc-verify-state', 'landed=' + inPattern.length + (holding ? ' hold' : ''));
    if (holding) tray.setAttribute('data-sc-verify-hold', 'true'); else tray.removeAttribute('data-sc-verify-hold');
  }

  /* the juggle: parametric 1 and 3, beat-simulated siteswaps for 2 and 4 */
  var T = 2400;
  function pose(n, k, t) {
    var th = (2 * Math.PI * t) / T;
    if (n === 1) return { x: 0, y: -24 * Math.abs(Math.sin(th)) };
    var a3 = th + (k * 2 * Math.PI) / 3;
    return { x: 30 * Math.cos(a3), y: -26 * Math.abs(Math.sin(a3)) };
  }
  var SS = null;
  function ssApex(h) { return h === 1 ? 10 : h === 3 ? 46 : 66; }
  function ssHandX(hand) { return hand === 0 ? 30 : -30; }
  function ssInit(now, n) {
    SS = { pattern: n >= 4 ? [5, 5, 5, 1] : [3, 1], tau: n >= 4 ? 300 : 340, forN: n,
           t0: now, beat: 0, landAt: {}, pool: inPattern.slice(), flights: new Map() };
  }
  function ssBeats(now) {
    while (SS.t0 + SS.beat * SS.tau <= now) {
      var b = SS.beat, h = SS.pattern[b % SS.pattern.length], hand = b % 2;
      var ball = SS.landAt[b] || SS.pool.shift();
      delete SS.landAt[b];
      if (ball) {
        SS.flights.set(ball, { t0: SS.t0 + b * SS.tau, t1: SS.t0 + (b + h) * SS.tau,
          x0: ssHandX(hand), x1: ssHandX((hand + h) % 2), apex: ssApex(h) });
        SS.landAt[b + h] = ball;
      }
      SS.beat++;
    }
  }
  function ssPose(ball, now) {
    var f = SS.flights.get(ball);
    if (!f) return { x: 0, y: 0 };
    var u = Math.min(Math.max((now - f.t0) / (f.t1 - f.t0), 0), 1);
    return { x: f.x0 + (f.x1 - f.x0) * u, y: -6 - f.apex * 4 * u * (1 - u) };
  }
  function place(b, x, y) {
    var s = BALL();
    b.style.transform = 'translate(' + (x - s / 2) + 'px,' + (y - s) + 'px)';
  }
  function frame(now) {
    var n = inPattern.length;
    if (n === 2 || n >= 4) {
      if (!SS || SS.forN !== n) ssInit(now, n);
      ssBeats(now);
      for (var k = 0; k < n; k++) { var p = ssPose(inPattern[k], now); place(inPattern[k], p.x, p.y); }
    } else {
      for (var j = 0; j < n; j++) { var q = pose(n, j, now % T); place(inPattern[j], q.x, q.y); }
    }
    rafId = requestAnimationFrame(frame);
  }
  function staticRow() {
    inPattern.forEach(function (b, k) { place(b, (k - (inPattern.length - 1) / 2) * 36, 0); });
  }
  function startEngine() {
    if (rafId === null && !reduce.matches && inPattern.length) rafId = requestAnimationFrame(frame);
  }
  reduce.addEventListener('change', function (e) {
    if (e.matches && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; staticRow(); }
    else startEngine();
  });

  function join(name) {
    var b = makeBall(name);
    tray.appendChild(b);
    inPattern.push(b);
    if (reduce.matches) staticRow(); else startEngine();
    verify();
  }

  function toss(name) {
    if (landed[name] || !props[name]) return;
    landed[name] = true;
    var pr = props[name];
    pr.el.classList.add('is-lifted');
    if (reduce.matches || !('animate' in Element.prototype)) { join(name); return; }

    var r = pr.dot.getBoundingClientRect();
    var s = BALL();
    var x0 = r.left + r.width / 2, y0 = r.top + r.height / 2;
    var x1 = innerWidth / 2, y1 = innerHeight - TRAY_BOTTOM() - s / 2;
    var fl = document.createElement('div'); fl.className = 'flight';
    var fy = document.createElement('div'); fy.className = 'flight__y';
    var b = makeBall(name); b.style.transform = 'translate(-50%,-50%)';
    fy.appendChild(b); fl.appendChild(fy); layer.appendChild(fl);

    var dur = 1050;
    var rise = Math.max(170, Math.abs(y1 - y0) * 0.32);
    var apex = Math.min(y0, y1) - rise;
    fl.animate([{ transform: 'translateX(' + x0 + 'px)' }, { transform: 'translateX(' + x1 + 'px)' }],
               { duration: dur, easing: 'linear', fill: 'forwards' });
    b.animate([{ transform: 'translate(-50%,-50%) scale(0.6)' }, { transform: 'translate(-50%,-50%) scale(1)' }],
              { duration: dur * 0.6, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
    var a = fy.animate([
      { transform: 'translateY(' + y0 + 'px)', easing: 'cubic-bezier(0.22, 0.9, 0.45, 1)' },
      { transform: 'translateY(' + apex + 'px)', offset: 0.46, easing: 'cubic-bezier(0.55, 0, 0.8, 0.25)' },
      { transform: 'translateY(' + y1 + 'px)' }
    ], { duration: dur, fill: 'forwards' });
    a.onfinish = function () { fl.remove(); join(name); };
  }

  /* toss up to and including this prop, in story order, spaced out */
  var queue = [], draining = false;
  function tossUpTo(name) {
    var upto = ORDER.indexOf(name);
    for (var i = 0; i <= upto; i++) if (!landed[ORDER[i]] && queue.indexOf(ORDER[i]) < 0) queue.push(ORDER[i]);
    drain();
  }
  function drain() {
    if (draining || !queue.length) return;
    draining = true;
    (function next() {
      var n = queue.shift();
      if (!n) { draining = false; return; }
      toss(n);
      setTimeout(next, 260);
    })();
  }

  if ('IntersectionObserver' in window && tray) {
    var ioT = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sec = e.target.closest('[data-prop-toss]');
        setTimeout(function () { tossUpTo(sec.getAttribute('data-prop-toss')); }, 420);
        ioT.unobserve(e.target);
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    Array.prototype.forEach.call(document.querySelectorAll('[data-prop-toss]'), function (sec) {
      ioT.observe(sec.querySelector('.chapter__title') || sec);
    });
    /* backstop: reaching the proof lands everything that is still in the sentence */
    var built = document.getElementById('built');
    if (built) {
      var ioB = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { tossUpTo('builder'); ioB.unobserve(e.target); } });
      }, { threshold: 0.15 });
      ioB.observe(built);
    }
    /* the close: the pattern resolves and holds */
    var colophon = document.getElementById('colophon');
    if (colophon) {
      var ioC = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          holding = e.isIntersecting && e.intersectionRatio > 0.6;
          document.body.classList.toggle('is-close', holding);
          verify();
        });
      }, { threshold: [0, 0.6, 1] });
      ioC.observe(colophon.querySelector('[data-sc-stage]') || colophon);
    }
  }
  verify();

  /* ----------------------------------------------------------- 3. peak -- */
  var phone = document.getElementById('phone');
  var play = document.getElementById('phone-play');
  var close = document.getElementById('phone-close');
  var GAME = 'https://jmoranii.github.io/rolfe-legends-2/';
  if (phone && play && close) {
    var frameEl = null;
    play.addEventListener('click', function () {
      if (frameEl) return;
      frameEl = document.createElement('iframe');
      frameEl.src = GAME;
      frameEl.title = 'Rolfe Legends 2: Defend the Farm, playable';
      frameEl.setAttribute('allow', 'fullscreen; autoplay');
      frameEl.setAttribute('loading', 'lazy');
      phone.appendChild(frameEl);
      phone.classList.add('is-playing');
      play.hidden = true; close.hidden = false;
      close.focus();
    });
    close.addEventListener('click', function () {
      if (frameEl) { frameEl.remove(); frameEl = null; }
      phone.classList.remove('is-playing');
      close.hidden = true; play.hidden = false;
      play.focus();
    });
  }

  /* ------------------------------------------------------------- 4. CV -- */
  var cv = document.getElementById('print-cv');
  if (cv) cv.addEventListener('click', function (e) { e.preventDefault(); window.print(); });
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
