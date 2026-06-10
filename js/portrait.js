/* portrait.js — magnetic badge, click-cycles photos 1-7.
   (Photos 8-16 stay in assets for the Memory Match game but contain
   text too small to read at badge size, so the cycle stops at 7.) */
(function () {
    'use strict';
    window.JM = window.JM || {};

    var P_MAX = 7;

    JM.initPortrait = function () {
        var portrait = document.getElementById('portrait');
        var btn = document.getElementById('portrait-btn');
        var img = document.getElementById('portrait-img');
        if (!portrait || !btn || !img) return;

        var ix = 1;
        function src(n) { return 'assets/James' + n + '.jpg'; }
        btn.addEventListener('click', function () {
            ix = ix >= P_MAX ? 1 : ix + 1;
            img.src = src(ix);
            var pre = new Image();
            pre.src = src(ix >= P_MAX ? 1 : ix + 1);
        });
        var pre = new Image();
        pre.src = src(2);

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
