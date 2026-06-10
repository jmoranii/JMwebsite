/* cascade.js — the ball cascade.
   A new facet ball arcs in from a screen edge as each story beat
   reaches mid-screen (alternating sides) and joins a real juggling
   pattern at the bottom that never stops:
     1 ball  — bounces
     2 balls — go around in a circle (shower)
     3 balls — cascade
     4 balls — fountain (a crossing pair in each hand)
   "I don't drop balls." */
(function () {
    'use strict';
    window.JM = window.JM || {};

    var BALLS = ['--c-engineer', '--c-analyst', '--c-builder', '--c-human'];
    var TRAY_W = 160;

    JM.initCascade = function () {
        var tray = document.getElementById('tray');
        if (!tray) return;
        var landed = [false, false, false, false];
        var inPattern = [];   /* ball elements, in arrival order */
        var rafId = null;

        function makeBall(i) {
            var b = document.createElement('div');
            b.className = 'ball2';
            b.style.setProperty('--ball', 'var(' + BALLS[i] + ')');
            return b;
        }

        /* ---------- the juggle engine ----------
           Parametric positions per pattern; amplitudes kept small so
           the corner stays charming rather than busy. x/y are offsets
           from tray bottom-center, in px (y negative = up). */
        var T = 2400; /* ms per cycle */
        function pose(n, k, t) {
            var th = (2 * Math.PI * t) / T;
            switch (n) {
                case 1: /* bounce */
                    return { x: 0, y: -22 * Math.abs(Math.sin(th)) };
                case 2: /* shower: both balls around one circle, opposite phases */
                    var a2 = th + k * Math.PI;
                    return { x: 26 * Math.cos(a2), y: -14 - 12 * Math.sin(a2) };
                case 3: /* cascade: one arched path, three phases */
                    var a3 = th + (k * 2 * Math.PI) / 3;
                    return { x: 30 * Math.cos(a3), y: -24 * Math.abs(Math.sin(a3)) };
                default: /* fountain: two balls per hand, hands mirrored */
                    var hand = k % 2;                 /* 0 = right, 1 = left */
                    var dir = hand === 0 ? 1 : -1;
                    var ph = th * 1.15 + (k < 2 ? 0 : Math.PI);
                    return {
                        x: dir * 24 + dir * 10 * Math.cos(ph),
                        y: -14 - 13 * (1 + Math.sin(ph)) / 2 - 4 * Math.abs(Math.sin(ph))
                    };
            }
        }

        function frame(now) {
            var n = inPattern.length;
            for (var k = 0; k < n; k++) {
                var p = pose(n, k, now % T);
                inPattern[k].style.transform =
                    'translate(' + (p.x - 14) + 'px,' + p.y + 'px)';
            }
            rafId = requestAnimationFrame(frame);
        }
        function startEngine() {
            if (rafId === null && !JM.reducedMotion() && inPattern.length) {
                rafId = requestAnimationFrame(frame);
            }
        }
        JM.onReducedMotionChange(function (e) {
            if (e.matches && rafId !== null) {
                cancelAnimationFrame(rafId); rafId = null;
                inPattern.forEach(function (b, k) {
                    b.style.transform = 'translate(' + ((k - inPattern.length / 2) * 36) + 'px, 0)';
                });
            } else { startEngine(); }
        });

        function joinPattern(i) {
            var b = makeBall(i);
            tray.appendChild(b);
            inPattern.push(b);
            if (JM.reducedMotion()) {
                /* static, evenly spaced row */
                inPattern.forEach(function (bb, k) {
                    bb.style.transform = 'translate(' + ((k - (inPattern.length - 1) / 2) * 36 - 14) + 'px, 0)';
                });
            } else {
                startEngine();
            }
        }

        function toss(i) {
            if (landed[i]) return;
            landed[i] = true;
            if (JM.reducedMotion()) { joinPattern(i); return; }

            var slotX = window.innerWidth / 2;
            var fromRight = (i % 2 === 1);
            var sx = fromRight ? (window.innerWidth - slotX + 60) + 'px' : (-slotX - 60) + 'px';
            var dur = 900 + i * 90;

            var flight = document.createElement('div');
            flight.className = 'flight';
            flight.style.transform = 'translateX(' + slotX + 'px)';
            flight.style.setProperty('--sx', sx);
            flight.style.setProperty('--fdur', dur + 'ms');
            var fx = document.createElement('div'); fx.className = 'fx';
            var fy = document.createElement('div'); fy.className = 'fy';
            fy.appendChild(makeBall(i)); fx.appendChild(fy); flight.appendChild(fx);
            document.body.appendChild(flight);

            /* three animations end together and animationend bubbles —
               handle exactly one (fx-move), then detach */
            function onEnd(e) {
                if (e.animationName !== 'fx-move') return;
                fx.removeEventListener('animationend', onEnd);
                flight.remove();
                joinPattern(i);
            }
            fx.addEventListener('animationend', onEnd);
        }

        /* trigger when a beat sits mid-screen (not at first sight) —
           the -38% margins make a center band; catch-up still lands
           every earlier ball on jump-scrolls */
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    var upto = +e.target.dataset.ball;
                    for (var j = 0; j <= upto; j++) toss(j);
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
        document.querySelectorAll('.beat-block[data-ball]').forEach(function (s) { io.observe(s); });

        /* footer backstop: plain visibility, lands everything */
        var ioFoot = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    for (var j = 0; j < 4; j++) toss(j);
                    ioFoot.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('footer[data-ball]').forEach(function (s) { ioFoot.observe(s); });
    };
})();
