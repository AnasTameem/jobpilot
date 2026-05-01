/**
 * ═══════════════════════════════════════════
 *  JobPilot — Page Transition Engine
 *  Barba.js-style smooth transitions with GSAP
 *  Direction-aware, multi-layer cascade wipe
 * ═══════════════════════════════════════════
 */
(function () {
    'use strict';

    // Page hierarchy for direction-aware transitions
    var PAGE_ORDER = {
        'index.html': 0,
        '': 0,
        'resume.html': 1,
        'analysis.html': 2,
        'job_page.html': 3
    };

    function getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    function getPageIndex(name) {
        var idx = PAGE_ORDER[name];
        return idx !== undefined ? idx : -1;
    }

    // Create the transition overlay DOM
    function createOverlay() {
        var existing = document.querySelector('.page-transition-overlay');
        if (existing) return existing;

        var overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML =
            '<div class="transition-layer transition-layer-1"></div>' +
            '<div class="transition-layer transition-layer-2"></div>' +
            '<div class="transition-layer transition-layer-3"></div>';
        document.body.appendChild(overlay);
        return overlay;
    }

    // ENTER: Layers cascade off-screen to reveal the new page
    function pageEnter() {
        var overlay = createOverlay();
        var layers = overlay.querySelectorAll('.transition-layer');
        var dir = sessionStorage.getItem('transition-dir') || 'forward';
        var exit = dir === 'forward' ? -101 : 101;

        gsap.set(layers, { yPercent: 0 });
        overlay.classList.add('active');

        var tl = gsap.timeline({
            onComplete: function () {
                overlay.classList.remove('active');
                sessionStorage.removeItem('transition-active');
            }
        });

        tl.to(layers[2], { yPercent: exit, duration: 0.45, ease: 'power3.inOut' }, 0)
          .to(layers[1], { yPercent: exit, duration: 0.45, ease: 'power3.inOut' }, 0.08)
          .to(layers[0], { yPercent: exit, duration: 0.45, ease: 'power3.inOut' }, 0.16);

        return tl;
    }

    // LEAVE: Layers cascade on-screen to cover the current page
    function pageLeave(direction) {
        var overlay = createOverlay();
        var layers = overlay.querySelectorAll('.transition-layer');
        var enter = direction === 'forward' ? 101 : -101;

        gsap.set(layers, { yPercent: enter });
        overlay.classList.add('active');

        return new Promise(function (resolve) {
            var tl = gsap.timeline({ onComplete: resolve });
            tl.to(layers[0], { yPercent: 0, duration: 0.4, ease: 'power3.inOut' }, 0)
              .to(layers[1], { yPercent: 0, duration: 0.4, ease: 'power3.inOut' }, 0.07)
              .to(layers[2], { yPercent: 0, duration: 0.4, ease: 'power3.inOut' }, 0.14);
        });
    }

    // Public API for programmatic navigation (used by validation.js etc.)
    window.navigateWithTransition = function (href, direction) {
        direction = direction || 'forward';
        sessionStorage.setItem('transition-dir', direction);
        sessionStorage.setItem('transition-active', 'true');
        pageLeave(direction).then(function () {
            window.location.href = href;
        });
    };

    function isInternalLink(link) {
        var href = link.getAttribute('href');
        if (!href) return false;
        if (href.startsWith('#') || href === '#') return false;
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript')) return false;
        if (link.getAttribute('target') === '_blank') return false;
        if (link.classList.contains('nav-link-disabled')) return false;
        // External URL check
        if (href.startsWith('http') && !href.includes(window.location.host)) return false;
        // Must end with .html or be a relative path to an html page
        var filename = href.split('/').pop().split('?')[0].split('#')[0];
        if (filename && !filename.includes('.html') && filename.includes('.')) return false;
        return true;
    }

    function init() {
        createOverlay();

        // On page load: play enter animation if coming from a transition
        var isTransitioning = sessionStorage.getItem('transition-active');
        if (isTransitioning) {
            pageEnter();
        } else {
            // No transition in progress — hide layers instantly
            var layers = document.querySelectorAll('.transition-layer');
            gsap.set(layers, { yPercent: -101 });
        }

        // Intercept internal link clicks
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href]');
            if (!link) return;
            if (!isInternalLink(link)) return;

            e.preventDefault();

            var href = link.getAttribute('href');
            var toPage = href.split('/').pop().split('?')[0].split('#')[0];
            var fromPage = getCurrentPage();
            var fromIdx = getPageIndex(fromPage);
            var toIdx = getPageIndex(toPage);
            var direction = toIdx >= fromIdx ? 'forward' : 'backward';

            window.navigateWithTransition(href, direction);
        });

        // Handle back/forward (bfcache) — clear overlay
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                var overlay = document.querySelector('.page-transition-overlay');
                if (overlay) {
                    var layers = overlay.querySelectorAll('.transition-layer');
                    gsap.set(layers, { yPercent: -101 });
                    overlay.classList.remove('active');
                }
            }
        });
    }

    // Wait for GSAP then initialize
    function boot() {
        if (typeof gsap !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        } else {
            setTimeout(boot, 20);
        }
    }

    boot();
})();
