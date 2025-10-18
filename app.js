// Wedding Invitation JavaScript

// Wedding date configuration
const WEDDING_DATE = new Date('2026-06-15T15:00:00').getTime();

// Initialize AOS (Animate On Scroll) effect
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, parseInt(delay));
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = WEDDING_DATE - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Update countdown display with leading zeros
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        // Wedding day has passed
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const countdownSection = document.getElementById('countdown');
            if (countdownSection) {
                countdownSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherQuestion && otherAnswer && otherItem !== item) {
                        otherQuestion.classList.remove('active');
                        otherAnswer.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    question.classList.remove('active');
                    answer.classList.remove('active');
                } else {
                    question.classList.add('active');
                    answer.classList.add('active');
                }
            });
        }
    });
}

// Form validation and submission handling
function initFormHandling() {
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    if (!form) return;
    
    // Custom form validation
    function validateForm() {
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const attendance = form.querySelector('input[name="attendance"]:checked');
        
        if (!name) {
            showError('Please enter your name.');
            return false;
        }
        
        if (!email || !isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return false;
        }
        
        if (!attendance) {
            showError('Please let us know if you can attend.');
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showSuccess(message) {
        hideMessages();
        successMessage.textContent = message || 'Thank you! Your RSVP has been received.';
        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
    
    function showError(message) {
        hideMessages();
        errorMessage.textContent = message || 'There was an error sending your RSVP. Please try again.';
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
    
    function hideMessages() {
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Submit to Formspree
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccess('Thank you! Your RSVP has been received. We can\'t wait to celebrate with you!');
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    showError(data.errors.map(error => error.message).join(', '));
                } else {
                    showError('There was an error sending your RSVP. Please try again.');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showError('There was an error sending your RSVP. Please check your internet connection and try again.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--color-error)';
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-primary)';
            hideMessages();
        });
    });
}

// Gallery image hover effects (if using real images later)
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Add click effect
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestParallax() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallax);
}

// Navigation highlighting based on scroll position
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    if (sections.length === 0) return;
    
    let ticking = false;
    
    function updateActiveSection() {
        const scrollPos = window.scrollY + 100; // Offset for better UX
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        ticking = false;
    }
    
    function requestScrollSpy() {
        if (!ticking) {
            requestAnimationFrame(updateActiveSection);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollSpy);
}

// Preload critical resources
function preloadResources() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap';
    fontLink.as = 'style';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
}

// Handle resize events for responsive adjustments
function initResponsiveHandling() {
    let resizeTimeout;
    
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate any dynamic heights or positions if needed
            const timeline = document.querySelector('.timeline');
            if (timeline && window.innerWidth <= 768) {
                // Mobile adjustments
                timeline.classList.add('mobile');
            } else if (timeline) {
                timeline.classList.remove('mobile');
            }
        }, 250);
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Run once on load
}

// Handle keyboard navigation for accessibility
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#countdown';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.cssText = `
            position: absolute;
            left: 6px;
            top: 7px;
            z-index: 999999;
            padding: 8px 16px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            text-decoration: none;
            border-radius: 4px;
        `;
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.cssText = `
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for FAQ
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('faq-question')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });
}

// Error handling for external resources
function handleResourceErrors() {
    // Handle Google Fonts loading failure
    const fontTimeout = setTimeout(() => {
        console.warn('Google Fonts may have failed to load, using fallback fonts');
    }, 3000);
    
    document.fonts.ready.then(() => {
        clearTimeout(fontTimeout);
    });
    
    // Handle Font Awesome loading failure
    window.addEventListener('load', () => {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-heart';
        testIcon.style.cssText = 'position: absolute; left: -10000px;';
        document.body.appendChild(testIcon);
        
        const computed = window.getComputedStyle(testIcon, '::before');
        if (!computed.content || computed.content === 'none') {
            console.warn('Font Awesome may have failed to load');
            // Could add fallback text for icons here
        }
        
        document.body.removeChild(testIcon);
    });
}

// Initialize all functionality when DOM is loaded
function init() {
    // Start countdown timer immediately
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialize all features
    initAOS();
    initSmoothScrolling();
    initFAQ();
    initFormHandling();
    initGallery();
    initParallaxEffect();
    initScrollSpy();
    initResponsiveHandling();
    initAccessibility();
    handleResourceErrors();
    
    console.log('Wedding invitation app initialized successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Preload resources as early as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadResources);
} else {
    preloadResources();
}

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCountdown,
        initAOS,
        initFormHandling
    };
}