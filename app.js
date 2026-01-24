/*
=====================================================
James Moran - Professional Website JavaScript
=====================================================
Minimal JavaScript for:
- Intersection Observer for scroll-triggered animations
- Dynamic copyright year
- Smooth scroll behavior enhancement
=====================================================
*/

/**
 * Initialize all JavaScript functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScrollAnimations();
    initHeroImageCycle();
    updateCopyrightYear();
});

/**
 * Initialize hero image click cycling (James1 through James18)
 */
function initHeroImageCycle() {
    var heroImage = document.getElementById('hero-image');
    if (!heroImage) return;

    var totalPositions = 18;

    heroImage.addEventListener('click', function() {
        var currentIndex = parseInt(heroImage.getAttribute('data-image-index'), 10);
        var nextIndex = currentIndex >= totalPositions ? 1 : currentIndex + 1;

        // James16 is used for positions 16, 17, and 18
        var imageNumber = nextIndex > 16 ? 16 : nextIndex;

        heroImage.src = 'assets/James' + imageNumber + '.jpg';
        heroImage.setAttribute('data-image-index', nextIndex);
    });
}

/**
 * Initialize theme based on saved preference or system preference
 * Priority: localStorage > system preference > light (default)
 */
function initTheme() {
    var savedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme: saved preference first, then system preference
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Set up toggle button
    var toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes (only applies when no saved preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Scroll-triggered fade-in animations using Intersection Observer
 * 
 * The Intersection Observer API provides a way to asynchronously observe
 * changes in the intersection of a target element with an ancestor element
 * or with the document's viewport.
 * 
 * This is more performant than listening to scroll events.
 */
function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: just show all sections immediately
        document.querySelectorAll('.section').forEach(function(section) {
            section.classList.add('visible');
        });
        return;
    }

    // Configuration for the observer
    const observerOptions = {
        root: null,           // Use the viewport as the root
        rootMargin: '0px',    // No margin around the root
        threshold: 0.15       // Trigger when 15% of element is visible
    };

    /**
     * Callback function when intersection changes
     * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
     * @param {IntersectionObserver} observer - The observer instance
     */
    function handleIntersection(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add the visible class to trigger CSS animation
                entry.target.classList.add('visible');
                
                // Stop observing this element (animation only happens once)
                observer.unobserve(entry.target);
            }
        });
    }

    // Create the observer
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(function(section) {
        observer.observe(section);
    });
}

/**
 * Update the copyright year in the footer dynamically
 * This ensures the year is always current without manual updates
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Optional: Add smooth scroll behavior for anchor links
 * (This is a progressive enhancement since CSS scroll-behavior 
 * handles most cases, but this provides a fallback)
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#" (back to top handled by href)
        if (targetId === '#' || targetId === '#top') {
            return; // Let the default behavior handle it
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without adding to browser history
            history.replaceState(null, null, targetId);
        }
    });
});
