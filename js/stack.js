/* stack.js — deck-style sticky stack: cards pin inside one shared
   container and accumulate; each arrival nudges every earlier card
   slightly back (rAF + passive scroll; no animation-timeline — Safari). */
(function () {
    'use strict';
    window.JM = window.JM || {};

    JM.initStack = function () {
        var cards = Array.prototype.slice.call(document.querySelectorAll('.deck .stack-card'));
        if (!cards.length) return;
        var sticks = cards.map(function (c) {
            return parseFloat(getComputedStyle(c).top) || 76;
        });
        var ticking = false;

        function frame() {
            ticking = false;
            if (JM.reducedMotion()) return;
            var vh = window.innerHeight;
            for (var i = 0; i < cards.length - 1; i++) {
                var sumQ = 0;
                for (var j = i + 1; j < cards.length; j++) {
                    var r = cards[j].getBoundingClientRect();
                    /* q: 0 while card j is far below, 1 once it's pinned */
                    sumQ += Math.min(Math.max(1 - (r.top - sticks[j]) / (vh * 0.9), 0), 1);
                }
                var scale = Math.max(1 - sumQ * 0.022, 0.86);
                cards[i].style.transform = 'scale(' + scale.toFixed(4) + ')';
                cards[i].style.filter = 'brightness(' + Math.max(1 - sumQ * 0.03, 0.82).toFixed(3) + ')';
            }
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(frame); }
        }, { passive: true });
        frame();
    };
})();
