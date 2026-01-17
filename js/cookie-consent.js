/**
 * Cookie Consent Manager
 * File: js/cookie-consent.js
 */

document.addEventListener('DOMContentLoaded', function() {
    const cookieModal = new bootstrap.Modal(document.getElementById('cookieModal'));
    const cookieAccepted = getCookie('cookie_consent');
    
    // Show modal if no consent given yet
    if (!cookieAccepted) {
       /**  setTimeout(() => {
            cookieModal.show();
        }, 1000); // Show after 1 second */
        setCookie('cookie_consent', 'necessary', 365);
        setCookie('analytics', 'false', 365);
        setCookie('marketing', 'false', 365);
    }
    
    // Accept All button
    document.getElementById('cookieAccept').addEventListener('click', function() {
        setCookie('cookie_consent', 'all', 365);
        setCookie('analytics', 'true', 365);
        setCookie('marketing', 'true', 365);
        cookieModal.hide();
        showToast('Cookie preferences saved!', 'success');
    });
    
    // Reject (Necessary Only) button
    document.getElementById('cookieReject').addEventListener('click', function() {
        setCookie('cookie_consent', 'necessary', 365);
        setCookie('analytics', 'false', 365);
        setCookie('marketing', 'false', 365);
        cookieModal.hide();
        showToast('Only necessary cookies enabled.', 'info');
    });
    
    // Individual cookie toggles
    document.getElementById('analyticsCookies').addEventListener('change', function() {
        setCookie('analytics', this.checked ? 'true' : 'false', 365);
    });
    
    document.getElementById('marketingCookies').addEventListener('change', function() {
        setCookie('marketing', this.checked ? 'true' : 'false', 365);
    });
    
    // Cookie functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) return cookieValue;
        }
        return null;
    }
    
    function showToast(message, type) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
    
    // Initialize analytics if accepted
    if (getCookie('analytics') === 'true') {
        initializeAnalytics();
    }
    
    function initializeAnalytics() {
        // Add your analytics code here (Google Analytics, etc.)
        console.log('Analytics initialized');
    }
});