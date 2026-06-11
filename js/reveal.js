/* reveal.js — word-by-word story reveal.
   Skipped entirely under reduced motion (no DOM fragmentation for
   assistive tech; the CSS override pins full opacity anyway). */
(function () {
    'use strict';
    window.JM = window.JM || {};

    JM.initReveal = function () {
        if (JM.reducedMotion()) return;
        var beats = document.querySelectorAll('.beat');
        beats.forEach(function (p) {
            if (p.children.length) return; /* don't split if inline markup appears */
            var words = p.textContent.trim().split(/\s+/);
            p.textContent = '';
            words.forEach(function (w, ix) {
                var s = document.createElement('span');
                s.textContent = w + ' ';
                s.style.transitionDelay = Math.min(ix * 54, 2700) + 'ms'; /* ~1/3 speed per James */
                p.appendChild(s);
            });
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
            });
        }, { threshold: 0.3 });
        beats.forEach(function (p) { io.observe(p); });
    };
})();
