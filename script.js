// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and screenshots
document.querySelectorAll('.feature-card, .screenshot-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Fetch App Store rating
async function fetchAppStoreRating() {
    const appId = '6754521857'; // HealthScore AI App ID
    
    try {
        const response = await fetch(`https://itunes.apple.com/lookup?id=${appId}&country=us`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const appInfo = data.results[0];
            const rating = appInfo.averageUserRating;
            const ratingCount = appInfo.userRatingCount;
            
            // Update rating in hero stats
            const ratingElement = document.getElementById('appRating');
            const ratingLabelElement = document.getElementById('ratingLabel');
            const ratingCountElement = document.getElementById('ratingCount');
            
            if (ratingElement && rating) {
                ratingElement.textContent = `${rating.toFixed(1)}★`;
            }
            
            // Show rating count if available
            if (ratingCountElement && ratingCount && ratingCount > 0) {
                // Format number (e.g., 1234 -> "1.2K", 123 -> "123")
                const formattedCount = ratingCount >= 1000 
                    ? `${(ratingCount / 1000).toFixed(1)}K` 
                    : ratingCount.toString();
                
                ratingCountElement.textContent = `(${formattedCount} ratings)`;
                ratingCountElement.style.display = 'block';
                
                // Update label to show it's from App Store
                if (ratingLabelElement) {
                    ratingLabelElement.textContent = 'App Store Rating';
                }
            }
        }
    } catch (error) {
        console.error('Error fetching App Store rating:', error);
        // Keep default rating if fetch fails
    }
}

// Fetch rating when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchAppStoreRating);
} else {
    fetchAppStoreRating();
}
