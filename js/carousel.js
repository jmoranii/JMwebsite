/* carousel.js — the hero facet carousel.
   Four cards toss through the front along a parabolic arc; the hero
   background crossfades to the active facet's (deepened) color.
   Colors come from CSS custom properties — no duplicated values here. */
(function () {
    'use strict';
    window.JM = window.JM || {};

    var FACETS = [
        { name: 'Engineer', bg: '--bg-engineer' },
        { name: 'Analyst',  bg: '--bg-analyst' },
        { name: 'Builder',  bg: '--bg-builder' },
        { name: 'Human',    bg: '--bg-human' }
    ];

    JM.initCarousel = function () {
        var hero = document.querySelector('.hero');
        var slots = Array.prototype.slice.call(document.querySelectorAll('.slot'));
        var live = document.getElementById('live');
        var pauseBtn = document.getElementById('pause');
        if (!hero || !slots.length) return;

        var active = 0;
        var animating = false;
        var paused = JM.reducedMotion();
        var idleTimer = null;

        function paint(announce) {
            var f = FACETS[active];
            hero.style.backgroundColor = JM.cssVar(f.bg);
            slots.forEach(function (slot) {
                var i = +slot.dataset.index;
                slot.classList.remove('is-center', 'is-left', 'is-right', 'is-back', 'toss');
                var role = (i === active) ? 'is-center'
                    : (i === (active + 3) % 4) ? 'is-left'
                    : (i === (active + 1) % 4) ? 'is-right' : 'is-back';
                slot.classList.add(role);
                if (role === 'is-center') {
                    slot.removeAttribute('role');
                    slot.setAttribute('tabindex', '-1');
                    slot.setAttribute('aria-label', (i + 1) + ' of 4: ' + FACETS[i].name + ' (current)');
                } else {
                    slot.setAttribute('role', 'button');
                    slot.setAttribute('tabindex', '0');
                    slot.setAttribute('aria-label', 'Show facet: ' + FACETS[i].name);
                }
            });
            if (announce && live) live.textContent = f.name + ' — facet ' + (active + 1) + ' of 4';
        }

        function goTo(target, announce) {
            if (animating) return;
            target = ((target % 4) + 4) % 4;
            if (target === active) return;
            animating = true;
            active = target;
            paint(announce);
            if (!JM.reducedMotion()) {
                var center = slots.filter(function (s) { return +s.dataset.index === active; })[0];
                center.classList.add('toss');
            }
            setTimeout(function () { animating = false; }, JM.reducedMotion() ? 40 : 660);
        }
        function navigate(dir, announce) {
            goTo(dir === 'next' ? active + 1 : active - 1, announce);
            bumpIdle();
        }

        document.getElementById('next').addEventListener('click', function () { navigate('next', true); });
        document.getElementById('prev').addEventListener('click', function () { navigate('prev', true); });

        /* arrow keys: only while the hero is on screen, never in form fields */
        document.addEventListener('keydown', function (e) {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            if (hero.getBoundingClientRect().bottom < 80) return;
            e.preventDefault();
            navigate(e.key === 'ArrowRight' ? 'next' : 'prev', true);
        });

        function slotActivate(slot) {
            if (slot.classList.contains('is-left')) { navigate('prev', true); }
            else if (slot.classList.contains('is-right')) { navigate('next', true); }
            else if (slot.classList.contains('is-back')) { goTo(active + 2, true); bumpIdle(); }
        }
        slots.forEach(function (slot) {
            slot.addEventListener('click', function () { slotActivate(slot); });
            slot.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); slotActivate(slot); }
            });
        });

        /* idle auto-toss: 6s, silent for screen readers, with a real
           pause control; never rotates under hover/focus/hidden */
        function bumpIdle() {
            if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
            if (paused || JM.reducedMotion()) return;
            idleTimer = setInterval(function () {
                if (document.hidden) return;
                if (JM.canHover && hero.matches(':hover')) return;
                if (hero.contains(document.activeElement)) return;
                navigate('next', false);
            }, 6000);
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', function () {
                paused = !paused;
                pauseBtn.setAttribute('aria-pressed', String(paused));
                pauseBtn.setAttribute('aria-label', paused ? 'Resume automatic rotation' : 'Pause automatic rotation');
                pauseBtn.textContent = paused ? '▶' : '⏸';
                bumpIdle();
            });
        }
        JM.onReducedMotionChange(function (e) {
            if (e.matches && pauseBtn) {
                paused = true;
                pauseBtn.setAttribute('aria-pressed', 'true');
                pauseBtn.textContent = '▶';
            }
            bumpIdle();
        });

        /* repaint with the right token values when the theme flips */
        document.addEventListener('jm:theme', function () { paint(false); });

        paint(false);
        bumpIdle();
    };
})();
