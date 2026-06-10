/* theme.js — dark mode + shared environment helpers.
   Keeps v1's localStorage key ('theme') so game.html stays in sync. */
(function () {
    'use strict';
    window.JM = window.JM || {};

    var KEY = 'theme';
    var rmq = window.matchMedia('(prefers-reduced-motion: reduce)');

    JM.reducedMotion = function () { return rmq.matches; };
    JM.onReducedMotionChange = function (fn) {
        if (rmq.addEventListener) rmq.addEventListener('change', fn);
    };
    JM.canHover = window.matchMedia('(hover: hover)').matches;

    /* one source of truth for design tokens: CSS custom properties */
    JM.cssVar = function (name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.dispatchEvent(new CustomEvent('jm:theme', { detail: theme }));
    }
    JM.theme = function () { return document.documentElement.getAttribute('data-theme') || 'light'; };

    /* priority: saved preference > system > light (v1 behavior) */
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    if (saved === 'dark' || saved === 'light') {
        apply(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        apply('dark');
    } else {
        apply('light');
    }
    /* follow system changes only while the user has no explicit choice */
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var stored = null;
        try { stored = localStorage.getItem(KEY); } catch (err) {}
        if (!stored) apply(e.matches ? 'dark' : 'light');
    });

    JM.initTheme = function () {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var next = JM.theme() === 'dark' ? 'light' : 'dark';
            apply(next);
            try { localStorage.setItem(KEY, next); } catch (e) {}
        });
    };
})();
