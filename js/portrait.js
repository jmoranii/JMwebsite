/* portrait.js — magnetic badge, click-cycles a curated set:
   the one real photo first, then the generated alter egos that don't
   already live on the facet cards, ending on the stylized poster.
   (James8-16 stay in assets for the Memory Match game.) */
(function () {
    'use strict';
    window.JM = window.JM || {};

    var CYCLE = ['James1.jpg', 'James3.jpg', 'James4.jpg', 'James7.jpg', 'James2.jpg', 'bjj-v2.jpg', 'stylized-poster.jpg'];

    JM.initPortrait = function () {
        var portrait = document.getElementById('portrait');
        var btn = document.getElementById('portrait-btn');
        var img = document.getElementById('portrait-img');
        if (!portrait || !btn || !img) return;

        var ix = 0;
        function src(i) { return 'assets/' + CYCLE[i % CYCLE.length]; }
        btn.addEventListener('click', function () {
            ix = (ix + 1) % CYCLE.length;
            img.src = src(ix);
            var pre = new Image();
            pre.src = src(ix + 1);
        });
        var pre = new Image();
        pre.src = src(1);

        if (!JM.reducedMotion() && JM.canHover) {
            document.addEventListener('mousemove', function (e) {
                var r = portrait.getBoundingClientRect();
                var dx = e.clientX - (r.left + r.width / 2);
                var dy = e.clientY - (r.top + r.height / 2);
                var dist = Math.hypot(dx, dy);
                if (dist < 1) return; /* avoid 0/0 at dead center */
                var range = 140;
                if (dist < range) {
                    var pull = (1 - dist / range) * 12;
                    portrait.style.transform = 'translate(' + (dx / dist * pull) + 'px,' + (dy / dist * pull) + 'px)';
                } else {
                    portrait.style.transform = '';
                }
            }, { passive: true });
        }
    };
})();
