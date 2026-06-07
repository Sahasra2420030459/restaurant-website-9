// ============================================
// SAVOR & SAGE - PROFESSIONAL JAVASCRIPT
// Advanced Features & Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // LOADING SCREEN
    // ============================================
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 2000);
        });
    }

    // ============================================
    // NAVIGATION SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ============================================
    // ACTIVE NAVIGATION LINK
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters if present
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => animateCounter(counter));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ============================================
    // RESERVATION FORM
    // ============================================
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Validate
            if (!data.name || !data.email || !data.date || !data.time || !data.guests) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            // Simulate submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>⏳</span> Processing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const successMsg = document.querySelector('.success-message');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.innerHTML = `
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                        <h3 style="margin-bottom: 0.5rem;">Reservation Confirmed!</h3>
                        <p>Thank you, <strong>${data.name}</strong>! Your table for <strong>${data.guests}</strong> on <strong>${formatDate(data.date)}</strong> at <strong>${data.time}</strong> has been reserved.</p>
                        <p style="margin-top: 1rem; font-size: 0.9rem;">A confirmation email has been sent to <strong>${data.email}</strong>.</p>
                    `;
                }

                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        });
    }

    // Format date nicely
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }

    // ============================================
    // AVAILABILITY SLOT SELECTION
    // ============================================
    document.querySelectorAll('.availability-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            if (this.classList.contains('full')) return;

            document.querySelectorAll('.availability-slot').forEach(s => {
                s.style.border = '';
                s.style.transform = '';
            });

            this.style.border = '2px solid var(--gold)';
            this.style.transform = 'scale(1.1)';

            // Update time select if exists
            const timeSelect = document.getElementById('time');
            if (timeSelect) {
                const time = this.querySelector('.slot-time').textContent;
                timeSelect.value = time;
            }
        });
    });

    // ============================================
    // NEWSLETTER POPUP
    // ============================================
    const newsletterPopup = document.getElementById('newsletterPopup');
    if (newsletterPopup) {
        // Show after 8 seconds
        setTimeout(() => {
            if (!localStorage.getItem('newsletterClosed')) {
                newsletterPopup.style.display = 'block';
            }
        }, 8000);

        // Close button
        const closeBtn = newsletterPopup.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                newsletterPopup.style.display = 'none';
                localStorage.setItem('newsletterClosed', 'true');
            });
        }

        // Form submission
        const newsletterForm = newsletterPopup.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value;
                showNotification('Thank you for subscribing! 🎉', 'success');
                newsletterPopup.style.display = 'none';
                localStorage.setItem('newsletterClosed', 'true');
            });
        }
    }

    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        // Check saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️';
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            this.innerHTML = isDark ? '☀️' : '🌙';
        });
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }

        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // ============================================
    // GALLERY LIGHTBOX
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightbox.addEventListener('click', function() {
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg, .about-hero-bg');

        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // TYPING EFFECT FOR HERO (Optional)
    // ============================================
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text');
        let index = 0;

        function type() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }

        type();
    }

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('🍽️ Savor & Sage - Professional Restaurant Website Loaded!');
    console.log('✨ Features: Loading Screen, Dark Mode, Scroll Animations, Gallery Lightbox, Newsletter Popup');
});// ============================================
// SAVOR & SAGE - PROFESSIONAL JAVASCRIPT
// Advanced Features & Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // LOADING SCREEN
    // ============================================
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 2000);
        });
    }

    // ============================================
    // NAVIGATION SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ============================================
    // ACTIVE NAVIGATION LINK
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters if present
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => animateCounter(counter));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ============================================
    // RESERVATION FORM
    // ============================================
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Validate
            if (!data.name || !data.email || !data.date || !data.time || !data.guests) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            // Simulate submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>⏳</span> Processing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const successMsg = document.querySelector('.success-message');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.innerHTML = `
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                        <h3 style="margin-bottom: 0.5rem;">Reservation Confirmed!</h3>
                        <p>Thank you, <strong>${data.name}</strong>! Your table for <strong>${data.guests}</strong> on <strong>${formatDate(data.date)}</strong> at <strong>${data.time}</strong> has been reserved.</p>
                        <p style="margin-top: 1rem; font-size: 0.9rem;">A confirmation email has been sent to <strong>${data.email}</strong>.</p>
                    `;
                }

                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        });
    }

    // Format date nicely
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }

    // ============================================
    // AVAILABILITY SLOT SELECTION
    // ============================================
    document.querySelectorAll('.availability-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            if (this.classList.contains('full')) return;

            document.querySelectorAll('.availability-slot').forEach(s => {
                s.style.border = '';
                s.style.transform = '';
            });

            this.style.border = '2px solid var(--gold)';
            this.style.transform = 'scale(1.1)';

            // Update time select if exists
            const timeSelect = document.getElementById('time');
            if (timeSelect) {
                const time = this.querySelector('.slot-time').textContent;
                timeSelect.value = time;
            }
        });
    });

    // ============================================
    // NEWSLETTER POPUP
    // ============================================
    const newsletterPopup = document.getElementById('newsletterPopup');
    if (newsletterPopup) {
        // Show after 8 seconds
        setTimeout(() => {
            if (!localStorage.getItem('newsletterClosed')) {
                newsletterPopup.style.display = 'block';
            }
        }, 8000);

        // Close button
        const closeBtn = newsletterPopup.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                newsletterPopup.style.display = 'none';
                localStorage.setItem('newsletterClosed', 'true');
            });
        }

        // Form submission
        const newsletterForm = newsletterPopup.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value;
                showNotification('Thank you for subscribing! 🎉', 'success');
                newsletterPopup.style.display = 'none';
                localStorage.setItem('newsletterClosed', 'true');
            });
        }
    }

    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        // Check saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️';
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            this.innerHTML = isDark ? '☀️' : '🌙';
        });
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }

        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // ============================================
    // GALLERY LIGHTBOX
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightbox.addEventListener('click', function() {
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg, .about-hero-bg');

        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // TYPING EFFECT FOR HERO (Optional)
    // ============================================
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text');
        let index = 0;

        function type() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }

        type();
    }

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('🍽️ Savor & Sage - Professional Restaurant Website Loaded!');
    console.log('✨ Features: Loading Screen, Dark Mode, Scroll Animations, Gallery Lightbox, Newsletter Popup');
});