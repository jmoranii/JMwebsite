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
        var swipeGuard = false; /* set briefly after a swipe to swallow the trailing synthetic tap */
        /* distinguish keyboard focus (pause rotation) from mouse clicks
           (which would otherwise leave focus parked in the hero forever) */
        var keyboardFocus = false;
        document.addEventListener('keydown', function (e) { if (e.key === 'Tab') keyboardFocus = true; });
        document.addEventListener('pointerdown', function () { keyboardFocus = false; });

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

        document.getElementById('next').addEventListener('click', function (e) { navigate('next', true); if (e.detail) this.blur(); });
        document.getElementById('prev').addEventListener('click', function (e) { navigate('prev', true); if (e.detail) this.blur(); });

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
            if (swipeGuard) return; /* a swipe just fired — ignore the trailing tap */
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

        /* touch swipe (touchscreens): a horizontal flick navigates; vertical
           gestures fall through to page scroll, and taps are left alone so the
           slot click handlers still fire. left → next, right → prev. */
        var carousel = document.getElementById('carousel');
        if (carousel) {
            var SWIPE_MIN = 45; /* px of horizontal travel to register as a swipe */
            var sx = 0, sy = 0, tracking = false;
            carousel.addEventListener('touchstart', function (e) {
                if (e.touches.length !== 1) { tracking = false; return; } /* ignore pinch / multi-touch */
                sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
            }, { passive: true });
            carousel.addEventListener('touchmove', function (e) {
                if (tracking && e.touches.length > 1) tracking = false; /* became a pinch */
            }, { passive: true });
            carousel.addEventListener('touchend', function (e) {
                if (!tracking) return;
                tracking = false;
                var dx = e.changedTouches[0].clientX - sx;
                var dy = e.changedTouches[0].clientY - sy;
                if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.4) {
                    navigate(dx < 0 ? 'next' : 'prev', true);
                    swipeGuard = true;
                    setTimeout(function () { swipeGuard = false; }, 350);
                }
            }, { passive: true });
        }

        /* idle auto-toss: 6s, silent for screen readers, with a real
           pause control; never rotates under hover/focus/hidden */
        function bumpIdle() {
            if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
            if (paused || JM.reducedMotion()) return;
            idleTimer = setInterval(function () {
                if (document.hidden) return;
                /* pause only when actually engaging the cards/controls,
                   not whenever the mouse is anywhere on the page */
                if (JM.canHover && document.querySelector('.slot:hover, .nav:hover')) return;
                if (keyboardFocus && hero.contains(document.activeElement)) return;
                if (hero.getBoundingClientRect().bottom < 120) return; /* offscreen: skip */
                navigate('next', false);
            }, 6000);
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', function (e) {
                paused = !paused;
                pauseBtn.setAttribute('aria-pressed', String(paused));
                pauseBtn.setAttribute('aria-label', paused ? 'Resume automatic juggling' : 'Pause automatic juggling');
                pauseBtn.textContent = paused ? 'auto · off ▶' : 'auto · on ⏸';
                if (e.detail) pauseBtn.blur();
                bumpIdle();
            });
        }
        JM.onReducedMotionChange(function (e) {
            if (e.matches && pauseBtn) {
                paused = true;
                pauseBtn.setAttribute('aria-pressed', 'true');
                pauseBtn.textContent = 'auto · off ▶';
            }
            bumpIdle();
        });

        /* repaint with the right token values when the theme flips */
        document.addEventListener('jm:theme', function () { paint(false); });

        if (paused && pauseBtn) {
            pauseBtn.setAttribute('aria-pressed', 'true');
            pauseBtn.setAttribute('aria-label', 'Resume automatic juggling');
            pauseBtn.textContent = 'auto · off ▶';
        }
        paint(false);
        bumpIdle();
    };
})();
