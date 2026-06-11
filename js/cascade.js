/* cascade.js — the ball cascade.
   A new facet ball arcs in from a screen edge as each story beat
   reaches mid-screen (alternating sides) and joins a real juggling
   pattern at the bottom that never stops:
     1 ball  — bounces
     2 balls — siteswap 31 (shower: high parabola + quick pass under)
     3 balls — cascade
     4 balls — siteswap 5551
   "I don't drop balls." */
(function () {
    'use strict';
    window.JM = window.JM || {};

    /* arrival order matches the story beats: metal, the leap (human),
       health (analyst), AI era (builder) */
    var BALLS = ['--c-engineer', '--c-human', '--c-analyst', '--c-builder'];
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
        var T = 2400; /* ms per cycle (1- and 3-ball patterns) */
        function pose(n, k, t) {
            var th = (2 * Math.PI * t) / T;
            if (n === 1) { /* bounce */
                return { x: 0, y: -24 * Math.abs(Math.sin(th)) };
            }
            /* cascade: one arched path, three phases */
            var a3 = th + (k * 2 * Math.PI) / 3;
            return { x: 30 * Math.cos(a3), y: -26 * Math.abs(Math.sin(a3)) };
        }

        /* ---------- real siteswaps ----------
           Beat-based simulation: hands alternate each beat; a throw of
           height h lands h beats later (odd heights cross hands).
           2 balls -> 31 (shower: high parabola + quick pass under)
           4 balls -> 5551 (three high crossing 5s + the 1 hand-across) */
        var SS = null;
        function ssApex(h) { return h === 1 ? 10 : h === 3 ? 46 : 66; }
        function ssHandX(hand) { return hand === 0 ? 30 : -30; }
        function ssInit(now, n) {
            SS = {
                pattern: n >= 4 ? [5, 5, 5, 1] : [3, 1],
                tau: n >= 4 ? 300 : 340,
                forN: n,
                t0: now, beat: 0, landAt: {}, pool: inPattern.slice(), flights: new Map()
            };
        }
        function ssProcessBeats(now) {
            while (SS.t0 + SS.beat * SS.tau <= now) {
                var b = SS.beat;
                var h = SS.pattern[b % SS.pattern.length];
                var hand = b % 2;
                var ball = SS.landAt[b] || SS.pool.shift();
                delete SS.landAt[b];
                if (ball) {
                    var tB = SS.t0 + b * SS.tau;
                    SS.flights.set(ball, {
                        t0: tB, t1: SS.t0 + (b + h) * SS.tau,
                        x0: ssHandX(hand), x1: ssHandX((hand + h) % 2),
                        apex: ssApex(h)
                    });
                    SS.landAt[b + h] = ball;
                }
                SS.beat++;
            }
        }
        function ssPose(ball, now) {
            var f = SS.flights.get(ball);
            if (!f) return { x: 0, y: 0 };
            var u = Math.min(Math.max((now - f.t0) / (f.t1 - f.t0), 0), 1);
            return {
                x: f.x0 + (f.x1 - f.x0) * u,
                y: -6 - f.apex * 4 * u * (1 - u)
            };
        }

        function frame(now) {
            var n = inPattern.length;
            if (n === 2 || n >= 4) {
                if (!SS || SS.forN !== n) ssInit(now, n);
                ssProcessBeats(now);
                for (var k = 0; k < n; k++) {
                    var p = ssPose(inPattern[k], now);
                    inPattern[k].style.transform = 'translate(' + (p.x - 14) + 'px,' + p.y + 'px)';
                }
            } else {
                for (var j = 0; j < n; j++) {
                    var q = pose(n, j, now % T);
                    inPattern[j].style.transform = 'translate(' + (q.x - 14) + 'px,' + q.y + 'px)';
                }
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

        /* trigger when the beat's actual text block (not the tall
           wrapper) reaches the middle band of the screen, then hold
           half a beat before the throw */
        var TOSS_DELAY = 500;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    var block = e.target.closest('[data-ball]');
                    var upto = +block.dataset.ball;
                    setTimeout(function () {
                        for (var j = 0; j <= upto; j++) toss(j);
                    }, TOSS_DELAY);
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
        document.querySelectorAll('.beat-block[data-ball]').forEach(function (s) {
            io.observe(s.querySelector('.beat') || s);
        });

        /* footer backstop: plain visibility, lands everything */
        var ioFoot = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    setTimeout(function () {
                        for (var j = 0; j < 4; j++) toss(j);
                    }, TOSS_DELAY);
                    ioFoot.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('footer[data-ball]').forEach(function (s) { ioFoot.observe(s); });
    };
})();
