/* jamesmoran v3 — bespoke page behaviour. The engine is untouched.
   1. folio: the chapter title in the margin
   2. the props: the title's four periods lift off, one per chapter, fall into
      the tray, and are juggled there: a cascade that fills up, then a four-ball fountain
   3. the peak: a playable Rolfe Legends 2, loaded only on request
   4. the footer year (the résumé is a plain link to a PDF) */
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
  /* The title's periods lift off one per chapter, fall into a pair of unseen hands in the tray,
     and are juggled there for the rest of the page. The juggle is a small siteswap simulation,
     not a drawn loop: one gravity for everything, parabolic flights, and a scooping carry in the
     hand between each catch and the next throw (the dwell). One, two, and three balls are the
     same cascade filling up; the fourth ball turns it into a four-ball fountain. A new ball is
     always caught on the beat, in a slot the pattern has free. */
  var tray = document.getElementById('tray');
  var props = {};
  Array.prototype.forEach.call(document.querySelectorAll('.prop[data-prop]'), function (el) {
    props[el.getAttribute('data-prop')] = { el: el, dot: el.querySelector('.prop__dot') };
  });
  var landed = {}, rafId = null, holding = false;
  /* the sign-off on the last page repeats the four words; its periods are where the balls come home */
  var homes = {}, atHome = {}, closeTimer = null, topTimer = null;
  Array.prototype.forEach.call(document.querySelectorAll('.sign__dot[data-home]'), function (el) {
    homes[el.getAttribute('data-home')] = el;
    if (!reduce.matches) el.classList.add('is-away');
  });
  var BALL = function () { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ball')) || 36; };

  var DWELL = 1.3;      /* beats a ball rests in the hand before it is thrown again */
  var CARRY = 0.42;     /* how much of the ball's speed the hand keeps through the scoop */
  var TAU = { cascade: 380, fountain: 300 };   /* ms per beat */
  var LOOK = 620;       /* ms: a throw is decided this far ahead, before its ball reaches the hand */
  var ENTER_MIN = 880;  /* ms: the shortest fall from the title into the pattern */

  var J = { balls: [], landAt: {}, next: 0, nextT: 0, tau: TAU.cascade, mode: 'cascade', started: false, G: null, land: null };   /* land: null, 'sign' (the last page), or 'title' (back at the top) */
  function geom() {
    var d = BALL();
    var F3 = (3 - DWELL) * TAU.cascade / 1000;                     /* a cascade flight, seconds */
    return { d: d, g: 8 * (2.6 * d) / (F3 * F3) };                 /* gravity: a cascade peaks 2.6 balls above the hands */
  }
  function side(hand) { return hand === 0 ? 1 : -1; }              /* hand 0 is on the right */
  function throwOf(mode) { return mode === 'fountain' ? 4 : 3; }   /* siteswap 3 crosses; 4 returns to the same hand */
  function hands(mode, d) {                                        /* centre of each hand, and half the width of its scoop */
    return mode === 'fountain' ? { w: 1.6 * d, e: 0.8 * d } : { w: 1.45 * d, e: 0.5 * d };
  }
  function beatTime(b) { return J.nextT + (b - J.next) * J.tau; }

  function makeBall(name) {
    var el = document.createElement('div');
    el.className = 'ball';
    el.setAttribute('data-prop', name);
    return el;
  }
  function verify() {
    tray.setAttribute('data-sc-verify-state', 'landed=' + J.balls.length + ' home=' + Object.keys(atHome).length + (holding ? ' hold' : ''));
    if (holding) tray.setAttribute('data-sc-verify-hold', 'true'); else tray.removeAttribute('data-sc-verify-hold');
  }

  /* decide the throw for beat b (at time T), for whichever ball is due to be thrown then */
  function resolve(b, T) {
    var ball = J.landAt[b];
    if (!ball) return;
    delete J.landAt[b];
    var dest = J.land === 'sign' ? homes[ball.name] : J.land === 'title' && props[ball.name] ? props[ball.name].dot : null;
    if (dest) { sendHome(ball, b, T, dest, J.land); return; }
    var G = J.G, h = throwOf(J.mode), hand = b % 2, to = (b + h) % 2, H = hands(J.mode, G.d);
    var F = (h - DWELL) * J.tau / 1000;
    var x0 = side(hand) * (H.w - H.e);                               /* thrown from the inside of the hand */
    var x1 = side(to) * (H.w + H.e);                                 /* caught on the outside */
    var vx = (x1 - x0) / F, vy = G.g * F / 2;
    var hold = ball.q[ball.q.length - 1];
    hold.t1 = T; hold.x1 = x0; hold.vx1 = vx; hold.vy1 = vy;
    var tc = T + F * 1000;
    ball.q.push({ k: 'fly', t0: T, t1: tc, x0: x0, x1: x1, F: F });
    ball.q.push({ k: 'hold', t0: tc, t1: T + h * J.tau, x0: x1, x1: side(to) * (H.w - H.e), vx0: vx, vy0: -vy, vx1: 0, vy1: vy });
    ball.nb = b + h;
    J.landAt[ball.nb] = ball;
  }

  /* the last throw: from the hand, across the page, into the ball's own period, in the sign-off
     on the last page or back in the title at the top */
  function homeOf(dot) {
    var tr = tray.getBoundingClientRect(), r = dot.getBoundingClientRect();
    return { x: r.left + r.width / 2 - tr.left, y: tr.top - (r.top + r.height / 2) - J.G.d / 2, size: r.width };
  }
  function sendHome(ball, b, T, dot, site) {
    var G = J.G, H = hands(J.mode, G.d), x0 = side(b % 2) * (H.w - H.e), to = homeOf(dot);
    var Tf = Math.min(1.25, Math.max(0.85, 0.7 + Math.sqrt((to.x - x0) * (to.x - x0) + to.y * to.y) / 1500));
    var hold = ball.q[ball.q.length - 1];
    hold.t1 = T; hold.x1 = x0;
    hold.vx1 = Math.max(Math.min((to.x - x0) / Tf, 700), -700);
    hold.vy1 = Math.min(to.y / Tf + G.g * Tf / 2, 900);
    ball.q.push({ k: 'land', t0: T, t1: T + Tf * 1000, T: Tf, x0: x0, dot: dot, site: site });
    ball.nb = Infinity;
  }

  /* where a ball is at time t: x to the right of the tray's centre, y above the hands, and a scale */
  function where(ball, t) {
    var q = ball.q, G = J.G;
    while (q.length > 1 && t >= q[0].t1) q.shift();
    var s = q[0], u, dt;
    if (s.k === 'fly') {
      dt = Math.min(Math.max((t - s.t0) / 1000, 0), s.F);
      return { x: s.x0 + (s.x1 - s.x0) * (dt / s.F), y: (G.g / 2) * dt * (s.F - dt), k: 1 };
    }
    if (s.k === 'land') {
      u = Math.min(Math.max((t - s.t0) / (s.T * 1000), 0), 1);
      var to = homeOf(s.dot), sh = u < 0.5 ? 0 : (u - 0.5) / 0.5;
      return { x: s.x0 + (to.x - s.x0) * u, y: to.y * u + (G.g / 2) * s.T * s.T * u * (1 - u),
               k: 1 - (1 - Math.max(to.size / G.d, 0.1)) * sh * sh * (3 - 2 * sh), done: u >= 1 };
    }
    if (s.k === 'enter') {
      dt = Math.min(Math.max((t - s.t0) / 1000, 0), s.T);
      u = dt / s.T;
      return { x: s.x0 + s.vx * dt, y: s.y0 + s.vy * dt - (G.g / 2) * dt * dt, k: s.k0 + (1 - s.k0) * Math.min(u / 0.6, 1) };
    }
    var D = Math.max((s.t1 - s.t0) / 1000, 0.001);
    u = Math.min(Math.max((t - s.t0) / (s.t1 - s.t0), 0), 1);
    var u2 = u * u, u3 = u2 * u;
    var h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2, c = CARRY * D;
    return { x: h00 * s.x0 + h10 * c * s.vx0 + h01 * s.x1 + h11 * c * s.vx1, y: h10 * c * s.vy0 + h11 * c * s.vy1, k: 1 };
  }
  function place(el, x, y, k) {
    var d = J.G.d;
    el.style.transform = 'translate(' + (x - d / 2).toFixed(2) + 'px,' + (-y - d).toFixed(2) + 'px)' + (k !== 1 ? ' scale(' + k.toFixed(3) + ')' : '');
  }
  function frame(now) {
    while (J.nextT - LOOK <= now) { resolve(J.next, J.nextT); J.next++; J.nextT += J.tau; }
    var arrived = null;
    for (var i = 0; i < J.balls.length; i++) {
      var p = where(J.balls[i], now);
      place(J.balls[i].el, p.x, p.y, p.k);
      if (p.done) (arrived = arrived || []).push(J.balls[i]);
    }
    if (arrived) arrived.forEach(arrive);
    if (J.balls.length) rafId = requestAnimationFrame(frame);
    else { rafId = null; J.started = false; J.landAt = {}; }
  }
  /* a ball reaches its period: the period fills, the ball is gone */
  function arrive(ball) {
    J.balls.splice(J.balls.indexOf(ball), 1);
    ball.el.remove();
    if (ball.q[ball.q.length - 1].site === 'title') {
      /* back in the title: the period is whole again, and the page is ready to start over */
      props[ball.name].el.classList.remove('is-lifted');
      props[ball.name].el.classList.add('is-landed');
      landed[ball.name] = false;
      verify();
      return;
    }
    var dot = homes[ball.name];
    dot.classList.remove('is-away');
    dot.classList.add('is-landed');
    atHome[ball.name] = true;
    verify();
    if (J.land !== 'sign') leaveHome(ball.name);       /* the reader left while it was in the air */
  }
  /* and back out again: the period empties and the ball rejoins the juggle */
  function leaveHome(name) {
    if (!atHome[name]) return;
    delete atHome[name];
    var dot = homes[name], r = dot.getBoundingClientRect();
    dot.classList.remove('is-landed');
    dot.classList.add('is-away');
    join(name, { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width });
  }
  function setClosing(on) {
    clearTimeout(closeTimer);
    if (reduce.matches) return;
    if (on) {
      closeTimer = setTimeout(function () {
        J.land = 'sign';
        tossUpTo('builder');                  /* arriving straight at the last page: bring in whatever never left the title */
      }, 450);
    } else if (J.land === 'sign') {
      J.land = null;
      ORDER.forEach(function (name, k) { setTimeout(function () { if (J.land !== 'sign') leaveHome(name); }, 240 * k); });
    }
  }
  /* back at the very top: the balls return to the title, and the page starts over from there */
  function setAtTop(on) {
    clearTimeout(topTimer);
    if (reduce.matches) return;
    if (on) topTimer = setTimeout(function () { if (J.land !== 'sign') J.land = 'title'; }, 350);
    else if (J.land === 'title') J.land = null;
  }
  function staticRow() {
    J.G = geom();
    J.balls.forEach(function (b, k) { place(b.el, (k - (J.balls.length - 1) / 2) * (J.G.d + 10), 0, 1); });
  }
  function startEngine() {
    if (rafId === null && !reduce.matches && J.balls.length) rafId = requestAnimationFrame(frame);
  }
  reduce.addEventListener('change', function (e) {
    if (e.matches) {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      staticRow();
      var lp = document.getElementById('clubs-loop'); if (lp) lp.pause(); /* the loop, too, not only the balls */
    } else if (J.balls.length) { restart(performance.now()); startEngine(); }
  });
  addEventListener('resize', function () { if (reduce.matches) staticRow(); else J.G = geom(); });

  /* would this schedule ever put two balls on one beat? */
  function clean(beats, mode) {
    var due = {}, i, b;
    for (i = 0; i < beats.length; i++) { if (due[beats[i]]) return false; due[beats[i]] = true; }
    for (b = J.next; b < J.next + 48; b++) {
      if (!due[b]) continue;
      delete due[b];
      if (due[b + throwOf(mode)]) return false;
      due[b + throwOf(mode)] = true;
    }
    return true;
  }
  /* the pattern for n balls, and the first beat a newcomer can be caught on */
  function plan(n, now) {
    var mode = n < 4 ? 'cascade' : 'fountain', tau = TAU[mode];
    var taken = J.balls.map(function (b) { return b.nb; });
    var first = J.next;
    while (J.nextT + (first - J.next) * tau - DWELL * tau < now + ENTER_MIN) first++;
    for (var b = first; b < first + 16; b++) if (clean(taken.concat([b]), mode)) return { mode: mode, beat: b };
    return { mode: mode, beat: first };
  }
  /* start again from rest (after reduced motion is switched off): every ball in a hand, one beat apart */
  function restart(now) {
    J.G = geom(); J.landAt = {}; J.next = 0; J.nextT = now + LOOK + 60; J.started = true;
    J.mode = J.balls.length < 4 ? 'cascade' : 'fountain'; J.tau = TAU[J.mode];
    var H = hands(J.mode, J.G.d);
    J.balls.forEach(function (ball, k) {
      var x = side(k % 2) * (H.w - H.e);
      ball.nb = k; J.landAt[k] = ball;
      ball.q = [{ k: 'hold', t0: now, t1: J.nextT + k * J.tau, x0: x, x1: x, vx0: 0, vy0: 0, vx1: 0, vy1: 0 }];
    });
  }

  function join(name, from) {
    var el = makeBall(name), now = performance.now();
    tray.appendChild(el);
    var ball = { el: el, name: name, q: [], nb: 0 };
    if (reduce.matches) { J.balls.push(ball); staticRow(); verify(); return; }
    if (!J.G) J.G = geom();
    if (!J.started) { J.started = true; J.next = 0; J.nextT = now + LOOK + 60; }
    var G = J.G, pl = plan(J.balls.length + 1, now);
    J.mode = pl.mode; J.tau = TAU[pl.mode];
    var H = hands(J.mode, G.d), T = beatTime(pl.beat), tc = T - DWELL * J.tau, hand = pl.beat % 2;
    var xc = side(hand) * (H.w + H.e), Te = Math.max((tc - now) / 1000, 0.2);
    /* the fall: from where the period sat, or from the top of the screen if the title has scrolled away */
    var tr = tray.getBoundingClientRect();
    var x0 = (from ? from.x : innerWidth / 2) - tr.left;
    var y0 = tr.top - (from ? Math.min(Math.max(from.y, -G.d), innerHeight + G.d) : -G.d);
    var vx = (xc - x0) / Te, vy = (-y0 + (G.g / 2) * Te * Te) / Te;
    var vyEnd = Math.max(vy - G.g * Te, -1.3 * G.g * ((3 - DWELL) * TAU.cascade / 1000) / 2);   /* a firm catch, not a crater */
    ball.q.push({ k: 'enter', t0: now, t1: tc, T: Te, x0: x0, y0: y0, vx: vx, vy: vy, k0: from ? Math.min(Math.max(from.size / G.d, 0.4), 1) : 0.6 });
    ball.q.push({ k: 'hold', t0: tc, t1: T, x0: xc, x1: side(hand) * (H.w - H.e), vx0: Math.max(Math.min(vx, 400), -400), vy0: vyEnd, vx1: 0, vy1: 0 });
    ball.nb = pl.beat; J.landAt[pl.beat] = ball;
    J.balls.push(ball);
    startEngine();
    verify();
  }

  function toss(name) {
    if (landed[name] || !props[name]) return;
    landed[name] = true;
    var pr = props[name];
    pr.el.classList.remove('is-landed');
    pr.el.classList.add('is-lifted');
    var r = pr.dot.getBoundingClientRect();
    join(name, { x: Math.min(Math.max(r.left + r.width / 2, 24), innerWidth - 24), y: r.top + r.height / 2, size: r.width });
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
        setTimeout(function () { tossUpTo(sec.getAttribute('data-prop-toss')); }, 420);   /* a no-op once tossed, until the top resets it */
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    Array.prototype.forEach.call(document.querySelectorAll('[data-prop-toss]'), function (sec) {
      ioT.observe(sec.querySelector('.chapter__title') || sec);
    });
    /* backstop: reaching the proof lands everything that is still in the sentence */
    var built = document.getElementById('built');
    if (built) {
      var ioB = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) tossUpTo('builder'); });
      }, { threshold: 0.15 });
      ioB.observe(built);
    }
    /* the close: the pattern resolves and holds */
    var colophon = document.getElementById('colophon');
    if (colophon) {
      var loop = document.getElementById('clubs-loop');
      var ioC = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          holding = e.isIntersecting && e.intersectionRatio > 0.6;
          document.body.classList.toggle('is-close', holding);
          verify();
          /* the clubs loop plays only while the last page is on screen, never under reduced motion */
          if (loop) {
            if (e.isIntersecting && !reduce.matches) { var pr = loop.play(); if (pr && pr.catch) pr.catch(function () {}); }
            else loop.pause();
          }
        });
      }, { threshold: [0, 0.6, 1] });
      ioC.observe(colophon.querySelector('[data-sc-stage]') || colophon);
      var titleH = document.querySelector('.title__h1');
      if (titleH) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { setAtTop(e.isIntersecting && e.intersectionRatio >= 0.99); });
        }, { threshold: [0, 0.5, 0.99, 1] }).observe(titleH);
      }
      var sign = document.getElementById('sign');
      if (sign) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { setClosing(e.isIntersecting && e.intersectionRatio >= 0.99); });
        }, { threshold: [0, 0.5, 0.99, 1] }).observe(sign);
      }
    }
  }
  verify();

  /* the turn holds on the finished diagram: tell the harness the silence is authored */
  var turn = document.querySelector('.chapter--turn');
  if (turn) {
    var lastHold = null;
    var tick = function () {
      var p = parseFloat(turn.style.getPropertyValue('--sc-p')) || 0;
      var hold = p > 0.62 && p < 0.93;
      if (hold !== lastHold) {
        lastHold = hold;
        if (hold) turn.setAttribute('data-sc-verify-hold', 'true'); else turn.removeAttribute('data-sc-verify-hold');
      }
    };
    addEventListener('scroll', tick, { passive: true }); tick();
  }

  /* the one scrub: the engine reveals the clip on a timer once its bytes arrive, whether or
     not they decode, and the decode error usually lands first. So: on error, take the reveal
     back, and keep watching the class the engine sets (on the act and on the video) so a
     reveal that arrives after the error is taken back too. */
  var scrub = document.querySelector('video[data-sc-scrub]');
  if (scrub && 'MutationObserver' in window) {
    var scrubAct = scrub.closest('[data-sc-act]');
    var unreveal = function () {
      if (!scrub.error) return;
      [scrub, scrubAct].forEach(function (el) {
        if (el && el.classList.contains('sc-has-clip')) el.classList.remove('sc-has-clip');
      });
    };
    scrub.addEventListener('error', unreveal);
    var mo = new MutationObserver(unreveal);
    mo.observe(scrub, { attributes: true, attributeFilter: ['class'] });
    if (scrubAct) mo.observe(scrubAct, { attributes: true, attributeFilter: ['class'] });
  }

  /* short viewports: v3.css un-pins the stages below 500px of height. The engine relays out on
     width changes (rotation) but skips height-only resizes on narrow and touch layouts, so a
     height-only crossing of that breakpoint would leave its cached section geometry stale.
     Ask the mounted engine to lay out again once the stylesheet has switched. */
  var shortMQ = matchMedia('(max-height: 500px)');
  shortMQ.addEventListener('change', function () {
    requestAnimationFrame(function () {
      (window.ScrollCraft && ScrollCraft.instances || []).forEach(function (inst) { inst.layout(); inst.read(); });
    });
  });

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

  /* the "me" pointer on the startup photo pulses each time the photo comes into view */
  var teamPhoto = document.querySelector('.chapter--startup .media');
  if (teamPhoto && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { teamPhoto.classList.toggle('is-seen', e.isIntersecting); });
    }, { threshold: 0.6 }).observe(teamPhoto);
  } else if (teamPhoto) teamPhoto.classList.add('is-seen');

  /* ----------------------------------------------------------- 4. year -- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
