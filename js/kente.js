/**
 * Kentescence Navbar Scroll Behavior
 * File: js/navbar-scroll.js
 * 
 * Features:
 * - Hides navbar when scrolling down
 * - Shows navbar when scrolling up
 * - Throttled scroll events for performance
 * - Touch device support
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        scrollThreshold: 100,      // Pixels to scroll before hiding
        hideSpeed: 300,            // Hide speed in ms
        showSpeed: 200,            // Show speed in ms
        throttleDelay: 100,        // Throttle delay in ms
        touchSensitivity: 10       // For touch devices
    };
    
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let isScrolling;
    let isNavbarVisible = true;
    
    /**
     * Initialize navbar scroll behavior
     */
    function initNavbarScroll() {
        if (!navbar) {
            console.warn('Navbar element not found');
            return;
        }
        
        // Set initial state
        navbar.classList.add('navbar-hidden');
        
        // Add scroll event listener with throttling
        window.addEventListener('scroll', throttle(handleScroll, CONFIG.throttleDelay));
        
        // Touch events for mobile
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleTouchScroll(touchStartY, touchEndY);
        });
        
        // Handle resize
        window.addEventListener('resize', handleResize);
        
        console.log('Navbar scroll behavior initialized');
    }
    
    /**
     * Handle scroll events
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Don't hide if at top or bottom of page
        if (scrollTop < CONFIG.scrollThreshold || 
            scrollTop + windowHeight >= documentHeight - 100) {
            showNavbar();
            return;
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling DOWN
            if (scrollTop > CONFIG.scrollThreshold && isNavbarVisible) {
                hideNavbar();
            }
        } else {
            // Scrolling UP
            if (!isNavbarVisible) {
                showNavbar();
            }
        }
        
        lastScrollTop = scrollTop;
    }

    // js/footer.js
    function updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCurrentYear);
} else {
    updateCurrentYear();
}
    
    /**
     * Handle touch scroll for mobile devices
     */
    function handleTouchScroll(startY, endY) {
        const diff = startY - endY;
        
        if (Math.abs(diff) > CONFIG.touchSensitivity) {
            if (diff > 0 && isNavbarVisible) {
                // Swipe down (scrolling down)
                hideNavbar();
            } else if (diff < 0 && !isNavbarVisible) {
                // Swipe up (scrolling up)
                showNavbar();
            }
        }
    }
    
    /**
     * Hide the navbar
     */
    function hideNavbar() {
        navbar.classList.remove('navbar-hidden');
        navbar.classList.add('navbar-scrolled');
        isNavbarVisible = false;
        
        // Dispatch custom event
        const event = new CustomEvent('navbarHide', { detail: { timestamp: Date.now() } });
        navbar.dispatchEvent(event);
    }
    
    /**
     * Show the navbar
     */
    function showNavbar() {
        navbar.classList.remove('navbar-scrolled');
        navbar.classList.add('navbar-hidden');
        isNavbarVisible = true;
        
        // Dispatch custom event
        const event = new CustomEvent('navbarShow', { detail: { timestamp: Date.now() } });
        navbar.dispatchEvent(event);
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        // Reset on resize to prevent stuck states
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop <= CONFIG.scrollThreshold) {
            showNavbar();
        }
    }
    
    /**
     * Throttle function for performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Public API
     */
    window.NavbarScroll = {
        init: initNavbarScroll,
        show: showNavbar,
        hide: hideNavbar,
        isVisible: function() { return isNavbarVisible; },
        updateConfig: function(newConfig) {
            Object.assign(CONFIG, newConfig);
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbarScroll);
    } else {
        initNavbarScroll();
    }

    /**
 * Shared JavaScript for all pages
 * File: js/main.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update current year in footer
    const yearElements = document.querySelectorAll('#currentYear');
    if (yearElements.length > 0) {
        yearElements.forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
    
})();