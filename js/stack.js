/* stack.js — sticky-stack cards: each later arrival nudges every
   earlier card backward (accumulated progress, rAF + passive scroll;
   no CSS animation-timeline — Safari). */
(function () {
    'use strict';
    window.JM = window.JM || {};

    JM.initStack = function () {
        var items = Array.prototype.slice.call(document.querySelectorAll('.stack-item'));
        var cards = items.map(function (w) { return w.querySelector('.stack-card'); });
        if (!items.length) return;
        var ticking = false;

        function frame() {
            ticking = false;
            if (JM.reducedMotion()) return;
            var vh = window.innerHeight;
            for (var i = 0; i < cards.length - 1; i++) {
                var sumQ = 0;
                for (var j = i + 1; j < items.length; j++) {
                    var r = items[j].getBoundingClientRect();
                    sumQ += Math.min(Math.max(1 - r.top / vh, 0), 1);
                }
                var scale = Math.max(1 - sumQ * 0.028, 0.82);
                cards[i].style.transform = 'scale(' + scale.toFixed(4) + ')';
                cards[i].style.filter = 'brightness(' + Math.max(1 - sumQ * 0.04, 0.78).toFixed(3) + ')';
            }
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(frame); }
        }, { passive: true });
        frame();
    };
})();
