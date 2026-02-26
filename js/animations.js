// ===== Advanced Animations =====

// GSAP-like animation functions using vanilla JavaScript
class Animator {
    constructor() {
        this.easings = {
            easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
            easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
            easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
            easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)'
        };
    }

    // Fade in animation with parallax effect
    fadeInParallax(element, options = {}) {
        const {
            duration = 1000,
            delay = 0,
            distance = 50,
            easing = 'easeOutQuart',
            threshold = 0.1
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.opacity = '0';
                        element.style.transform = `translateY(${distance}px)`;
                        element.style.transition = `opacity ${duration}ms ${this.easings[easing]}, transform ${duration}ms ${this.easings[easing]}`;
                        
                        requestAnimationFrame(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        });
                    }, delay);
                    observer.unobserve(element);
                }
            });
        }, { threshold });

        observer.observe(element);
    }

    // Stagger animation for multiple elements
    staggerFadeIn(elements, options = {}) {
        const {
            duration = 800,
            stagger = 100,
            distance = 30,
            easing = 'easeOutQuart'
        } = options;

        elements.forEach((element, index) => {
            this.fadeInParallax(element, {
                duration,
                delay: index * stagger,
                distance,
                easing
            });
        });
    }

    // Scale animation
    scaleIn(element, options = {}) {
        const {
            duration = 600,
            delay = 0,
            scale = 0.8,
            easing = 'easeOutQuart',
            threshold = 0.1
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.opacity = '0';
                        element.style.transform = `scale(${scale})`;
                        element.style.transition = `opacity ${duration}ms ${this.easings[easing]}, transform ${duration}ms ${this.easings[easing]}`;
                        
                        requestAnimationFrame(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'scale(1)';
                        });
                    }, delay);
                    observer.unobserve(element);
                }
            });
        }, { threshold });

        observer.observe(element);
    }

    // Slide in from sides
    slideIn(element, options = {}) {
        const {
            direction = 'left',
            duration = 800,
            delay = 0,
            distance = 100,
            easing = 'easeOutQuart'
        } = options;

        const transform = direction === 'left' ? `translateX(-${distance}px)` : 
                       direction === 'right' ? `translateX(${distance}px)` :
                       direction === 'top' ? `translateY(-${distance}px)` :
                       `translateY(${distance}px)`;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.opacity = '0';
                        element.style.transform = transform;
                        element.style.transition = `opacity ${duration}ms ${this.easings[easing]}, transform ${duration}ms ${this.easings[easing]}`;
                        
                        requestAnimationFrame(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translate(0, 0)';
                        });
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Rotate animation
    rotateIn(element, options = {}) {
        const {
            duration = 1000,
            delay = 0,
            rotation = 180,
            easing = 'easeOutQuart'
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.opacity = '0';
                        element.style.transform = `rotate(${rotation}deg) scale(0.8)`;
                        element.style.transition = `opacity ${duration}ms ${this.easings[easing]}, transform ${duration}ms ${this.easings[easing]}`;
                        
                        requestAnimationFrame(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'rotate(0deg) scale(1)';
                        });
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Bounce animation
    bounceIn(element, options = {}) {
        const {
            duration = 1000,
            delay = 0,
            scale = 0.3
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.opacity = '0';
                        element.style.transform = `scale(${scale})`;
                        element.style.transition = 'none';
                        
                        requestAnimationFrame(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'scale(1)';
                            element.style.transition = `opacity ${duration * 0.3}ms ease-out, transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
                        });
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Text reveal animation
    textReveal(element, options = {}) {
        const {
            duration = 1000,
            delay = 0,
            stagger = 50
        } = options;

        const text = element.textContent;
        element.innerHTML = '';
        
        // Split text into spans
        const chars = text.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            element.appendChild(span);
            return span;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        chars.forEach((span, index) => {
                            setTimeout(() => {
                                span.style.opacity = '1';
                                span.style.transform = 'translateY(0)';
                                span.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
                            }, index * stagger);
                        });
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Morphing shape animation
    morphShape(element, options = {}) {
        const {
            duration = 2000,
            delay = 0
        } = options;

        const shapes = [
            'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
            'polygon(50% 0%, 90% 20%, 90% 80%, 50% 100%, 10% 80%, 10% 20%)',
            'circle(50% at 50% 50%)',
            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        ];

        let currentShape = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const animate = () => {
                            element.style.clipPath = shapes[currentShape];
                            element.style.transition = `clip-path ${duration}ms ease-in-out`;
                            currentShape = (currentShape + 1) % shapes.length;
                            setTimeout(animate, duration);
                        };
                        animate();
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Glitch effect
    glitch(element, options = {}) {
        const {
            intensity = 3,
            duration = 2000,
            delay = 0
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const glitchInterval = setInterval(() => {
                            const randomX = (Math.random() - 0.5) * intensity;
                            const randomY = (Math.random() - 0.5) * intensity;
                            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
                            
                            setTimeout(() => {
                                element.style.transform = 'translate(0, 0)';
                            }, 50);
                        }, 100);
                        
                        setTimeout(() => {
                            clearInterval(glitchInterval);
                            element.style.transform = 'translate(0, 0)';
                        }, duration);
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Pulse animation
    pulse(element, options = {}) {
        const {
            scale = 1.05,
            duration = 2000,
            delay = 0
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const pulse = () => {
                            element.style.transform = `scale(${scale})`;
                            element.style.transition = `transform ${duration / 2}ms ease-in-out`;
                            
                            setTimeout(() => {
                                element.style.transform = 'scale(1)';
                                setTimeout(pulse, duration);
                            }, duration / 2);
                        };
                        pulse();
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Shake animation
    shake(element, options = {}) {
        const {
            intensity = 5,
            duration = 500,
            delay = 0
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.animation = `shake ${duration}ms ease-in-out`;
                        
                        // Add keyframes if not exists
                        if (!document.querySelector('#shake-keyframes')) {
                            const style = document.createElement('style');
                            style.id = 'shake-keyframes';
                            style.textContent = `
                                @keyframes shake {
                                    0%, 100% { transform: translateX(0); }
                                    10%, 30%, 50%, 70%, 90% { transform: translateX(-${intensity}px); }
                                    20%, 40%, 60%, 80% { transform: translateX(${intensity}px); }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Glow effect
    glow(element, options = {}) {
        const {
            color = '#6366f1',
            intensity = '20px',
            duration = 3000,
            delay = 0
        } = options;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.boxShadow = `0 0 ${intensity} ${color}, 0 0 ${intensity} ${color}`;
                        element.style.transition = `box-shadow ${duration}ms ease-in-out`;
                        
                        setTimeout(() => {
                            element.style.boxShadow = 'none';
                        }, duration);
                    }, delay);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    // Initialize all animations
    init() {
        // Hero animations
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const heroActions = document.querySelector('.hero-actions');
        const codeWindow = document.querySelector('.code-window');

        if (heroTitle) this.fadeInParallax(heroTitle, { delay: 200 });
        if (heroSubtitle) this.fadeInParallax(heroSubtitle, { delay: 100 });
        if (heroDescription) this.fadeInParallax(heroDescription, { delay: 400 });
        if (heroActions) this.fadeInParallax(heroActions, { delay: 600 });
        if (codeWindow) this.slideIn(codeWindow, { direction: 'right', delay: 800 });

        // About section animations
        const aboutTitle = document.querySelector('.about .section-title');
        const highlightItems = document.querySelectorAll('.highlight-item');
        const skillCategories = document.querySelectorAll('.skill-category');

        if (aboutTitle) this.textReveal(aboutTitle, { delay: 200 });
        if (highlightItems.length) this.staggerFadeIn(highlightItems, { delay: 400 });
        if (skillCategories.length) this.staggerFadeIn(skillCategories, { delay: 600 });

        // Services section animations
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length) {
            this.staggerFadeIn(serviceCards, { 
                delay: 200, 
                stagger: 150,
                distance: 40
            });
        }

        // Portfolio section animations
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        if (portfolioItems.length) {
            this.staggerFadeIn(portfolioItems, { 
                delay: 200, 
                stagger: 200,
                distance: 50
            });
        }

        // Contact section animations
        const contactForm = document.querySelector('.contact-form');
        const contactInfo = document.querySelector('.contact-info');

        if (contactForm) this.slideIn(contactForm, { direction: 'right', delay: 200 });
        if (contactInfo) this.slideIn(contactInfo, { direction: 'left', delay: 400 });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animator = new Animator();
    animator.init();
    
    // Add some special effects
    const codeWindow = document.querySelector('.code-window');
    if (codeWindow) {
        animator.glow(codeWindow, { 
            color: '#6366f1', 
            intensity: '30px', 
            delay: 1000 
        });
    }
    
    // Add morphing effect to service icons
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach((icon, index) => {
        setTimeout(() => {
            animator.morphShape(icon, { delay: 0 });
        }, index * 500);
    });
});

// Export for global use
window.Animator = Animator;