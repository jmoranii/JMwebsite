/* cascade.js — the ball cascade.
   A new facet ball arcs in from a screen edge as each story beat is
   read (alternating sides), lands in a bottom-center cluster, and
   never stops moving — a perpetual phase-staggered mini-juggle.
   "I don't drop balls." */
(function () {
    'use strict';
    window.JM = window.JM || {};

    var BALLS = ['--c-engineer', '--c-analyst', '--c-builder', '--c-human'];
    var TRAY_W = 144;
    var SLOT_GAP = 38;

    JM.initCascade = function () {
        var tray = document.getElementById('tray');
        if (!tray) return;
        var landed = [false, false, false, false];

        /* tray balls sit at per-index slots (absolute), so arrival
           order can never misplace them */
        function staticBall(i) {
            var b = document.createElement('div');
            b.className = 'ball2';
            b.style.setProperty('--ball', 'var(' + BALLS[i] + ')');
            b.style.left = (i * SLOT_GAP) + 'px';
            /* stagger the perpetual mini-juggle into a cascade wave */
            b.style.animationDelay = '0ms, ' + (600 + i * 800) + 'ms';
            return b;
        }

        function toss(i) {
            if (landed[i]) return;
            landed[i] = true;
            if (JM.reducedMotion()) { tray.appendChild(staticBall(i)); return; }

            var trayLeft = (window.innerWidth - TRAY_W) / 2;
            var slotX = trayLeft + i * SLOT_GAP;
            var fromRight = (i % 2 === 1);
            var sx = fromRight
                ? (window.innerWidth - slotX + 60) + 'px'
                : (-slotX - 60) + 'px';
            var dur = 900 + i * 90;

            var flight = document.createElement('div');
            flight.className = 'flight';
            flight.style.transform = 'translateX(' + slotX + 'px)';
            flight.style.setProperty('--sx', sx);
            flight.style.setProperty('--fdur', dur + 'ms');
            var fx = document.createElement('div'); fx.className = 'fx';
            var fy = document.createElement('div'); fy.className = 'fy';
            var ball = staticBall(i);
            ball.style.left = '';
            ball.style.animationDelay = '';
            fy.appendChild(ball); fx.appendChild(fy); flight.appendChild(fx);
            document.body.appendChild(flight);

            /* three animations end simultaneously and animationend
               bubbles — handle exactly one (fx-move), then detach */
            function onEnd(e) {
                if (e.animationName !== 'fx-move') return;
                fx.removeEventListener('animationend', onEnd);
                flight.remove();
                tray.appendChild(staticBall(i));
            }
            fx.addEventListener('animationend', onEnd);
        }

        /* catch-up: a section trigger lands all earlier balls too, so
           jump-scrolls (End key, anchors, reduced-motion) never skip */
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    var upto = +e.target.dataset.ball;
                    for (var j = 0; j <= upto; j++) toss(j);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.35 });
        document.querySelectorAll('[data-ball]').forEach(function (s) { io.observe(s); });
    };
})();
