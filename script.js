// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initFormHandling();
    initAnimations();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn[href^="#"]');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const reportForm = document.querySelector('.report-form');
    
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleReportSubmission(this);
        });
    }

    // Add form validation
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationError);
    });
}

// Handle report form submission
function handleReportSubmission(form) {
    const formData = new FormData(form);
    const formObject = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Validate form
    if (!validateForm(formObject)) {
        return;
    }

    // Simulate API submission
    showLoadingState(form);
    
    setTimeout(() => {
        hideLoadingState(form);
        showSuccessMessage();
        form.reset();
    }, 2000);
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const requiredFields = ['program', 'severity', 'title', 'description', 'impact'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    return isValid;
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && value === '') {
        showFieldError(field.name, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field.name, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field.name);
    return true;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Remove existing error
    clearFieldError(fieldName);
    
    // Add error styling
    field.classList.add('error');
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

// Clear field error
function clearFieldError(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear validation error on input
function clearValidationError(e) {
    const field = e.target;
    if (field.classList.contains('error')) {
        clearFieldError(field.name);
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading state
function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
}

// Hide loading state
function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Report';
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Report Submitted Successfully!</h3>
            <p>Thank you for your submission. Our security team will review your report and get back to you soon.</p>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Click to dismiss
    successMessage.addEventListener('click', () => {
        successMessage.remove();
    });
}

// Initialize animations
function initAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.program-card, .hacker-card, .feature, .leaderboard-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Scroll effects
function initScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        // Navbar background opacity
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const opacity = Math.min(scrolled / 100, 1);
            navbar.style.backgroundColor = `rgba(255, 255, 255, ${0.95 + opacity * 0.05})`;
        }
        
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate);
}

// Program card interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.program-card')) {
        const card = e.target.closest('.program-card');
        showProgramDetails(card);
    }
});

// Show program details (mock functionality)
function showProgramDetails(card) {
    const programName = card.querySelector('h3').textContent;
    
    // Create modal or expand card (simplified version)
    const modal = document.createElement('div');
    modal.className = 'program-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${programName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Detailed information about ${programName} would be displayed here.</p>
                <p>This would include scope, rules, reward details, and submission guidelines.</p>
                <div class="modal-actions">
                    <button class="btn btn-primary">Join Program</button>
                    <button class="btn btn-secondary">View Details</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Leaderboard interactions
function initLeaderboard() {
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
    leaderboardItems.forEach(item => {
        item.addEventListener('click', function() {
            const hackerName = this.querySelector('.hacker-info span').textContent;
            showHackerProfile(hackerName);
        });
    });
}

// Show hacker profile (mock functionality)
function showHackerProfile(name) {
    console.log(`Showing profile for ${name}`);
    // This would typically open a detailed profile page or modal
}

// Dynamic stats counter
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas and original suffix
            const formatted = Math.floor(current).toLocaleString();
            const originalText = counter.textContent;
            const suffix = originalText.replace(/[\d,]/g, '');
            counter.textContent = formatted + suffix;
        }, 20);
    });
}

// Search functionality (for future enhancement)
function initSearch() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', query);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Theme toggle (future enhancement)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initLeaderboard();
    initSearch();
    initThemeToggle();
    
    // Animate counters when they come into view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(statsSection);
    }
});

// Add some CSS for the modal and success message
const additionalStyles = `
<style>
.program-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
}

.modal-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
}

.success-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    text-align: center;
    cursor: pointer;
}

.success-content i {
    font-size: 3rem;
    color: #059669;
    margin-bottom: 1rem;
}

.success-content h3 {
    margin-bottom: 0.5rem;
    color: #1f2937;
}

.field-error {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.error {
    border-color: #dc2626 !important;
}

.animate {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);