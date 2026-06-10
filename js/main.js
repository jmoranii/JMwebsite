/* main.js — init orchestration + small enhancements. */
(function () {
    'use strict';

    /* inline the architecture diagram so currentColor/var() theme it
       (an <img> can't inherit CSS custom properties). Falls back to
       an <img> when fetch isn't available (file:// viewing). */
    function inlineDiagrams() {
        document.querySelectorAll('[data-inline-svg]').forEach(function (el) {
            var url = el.getAttribute('data-inline-svg');
            fetch(url)
                .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
                .then(function (svg) { el.innerHTML = svg; })
                .catch(function () {
                    var img = document.createElement('img');
                    img.src = url;
                    img.alt = 'Architecture diagram: ~20 data sources flow through bronze, silver, and gold tiers with an AI-readable metadata layer queried by AI agents.';
                    el.appendChild(img);
                });
        });
    }

    /* restyle the fixed theme toggle once the colorful hero is gone */
    function watchHero() {
        var hero = document.querySelector('.hero');
        if (!hero || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            document.body.classList.toggle('past-hero', !entries[0].isIntersecting);
        }, { rootMargin: '-80px 0px 0px 0px', threshold: 0 });
        io.observe(hero);
    }

    function init() {
        JM.initTheme();
        JM.initCarousel();
        JM.initPortrait();
        JM.initReveal();
        JM.initStack();
        JM.initCascade();
        inlineDiagrams();
        watchHero();

        var year = document.getElementById('current-year');
        if (year) year.textContent = new Date().getFullYear();

        var printBtn = document.getElementById('print-cv');
        if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

        /* smooth-scroll anchors (v1 behavior) */
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var target = document.querySelector(a.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: JM.reducedMotion() ? 'auto' : 'smooth' });
                history.replaceState(null, '', a.getAttribute('href'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
