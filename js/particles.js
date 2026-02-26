// ===== Particle System =====

class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.options = {
            particleCount: 50,
            particleSize: 2,
            particleColor: '#6366f1',
            particleOpacity: 0.6,
            connectionDistance: 100,
            connectionOpacity: 0.2,
            connectionColor: '#6366f1',
            mouseInteraction: true,
            responsive: true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        this.resizeCanvas();
        this.container.appendChild(this.canvas);
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.options));
        }
    }
    
    bindEvents() {
        if (this.options.responsive) {
            window.addEventListener('resize', () => {
                this.resizeCanvas();
                this.createParticles();
            });
        }
        
        if (this.options.mouseInteraction) {
            document.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const distance = particle.getDistance(otherParticle);
                
                if (distance < this.options.connectionDistance) {
                    const opacity = (1 - distance / this.options.connectionDistance) * this.options.connectionOpacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = this.hexToRgba(this.options.connectionColor, opacity);
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    animate() {
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(width, height, options) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * options.particleSize + 1;
        this.color = options.particleColor;
        this.opacity = options.particleOpacity;
        this.originalOpacity = this.opacity;
        
        this.options = options;
        this.width = width;
        this.height = height;
    }
    
    update(mouse) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > this.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > this.height) this.vy = -this.vy;
        
        // Mouse interaction
        if (this.options.mouseInteraction && mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx -= (dx / distance) * force * 0.02;
                this.vy -= (dy / distance) * force * 0.02;
                this.opacity = Math.min(this.originalOpacity * 2, 1);
            } else {
                this.opacity = this.originalOpacity;
            }
        }
        
        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.hexToRgba(this.color, this.opacity);
        ctx.fill();
    }
    
    getDistance(otherParticle) {
        const dx = this.x - otherParticle.x;
        const dy = this.y - otherParticle.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Advanced particle effects
class AdvancedParticleSystem extends ParticleSystem {
    constructor(container, options = {}) {
        const advancedOptions = {
            particleTypes: ['circle', 'triangle', 'square'],
            colorVariation: true,
            sizeVariation: true,
            gravity: false,
            wind: false,
            ...options
        };
        
        super(container, { ...options, ...advancedOptions });
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            const particleType = this.options.particleTypes[i % this.options.particleTypes.length];
            this.particles.push(new AdvancedParticle(this.width, this.height, this.options, particleType));
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawConnections();
        
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
    }
}

class AdvancedParticle extends Particle {
    constructor(width, height, options, type = 'circle') {
        super(width, height, options);
        this.type = type;
        this.angle = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        // Color variation
        if (options.colorVariation) {
            const hue = Math.random() * 60 + 220; // Blue to purple range
            this.color = `hsl(${hue}, 70%, 60%)`;
        }
        
        // Size variation
        if (options.sizeVariation) {
            this.size = Math.random() * options.particleSize + 0.5;
        }
        
        // Gravity effect
        if (options.gravity) {
            this.gravity = 0.05;
        }
        
        // Wind effect
        if (options.wind) {
            this.wind = (Math.random() - 0.5) * 0.02;
        }
    }
    
    update(mouse) {
        super.update(mouse);
        
        this.angle += this.rotationSpeed;
        
        if (this.options.gravity) {
            this.vy += this.gravity;
        }
        
        if (this.options.wind) {
            this.vx += this.wind;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.beginPath();
        
        switch (this.type) {
            case 'triangle':
                ctx.moveTo(0, -this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.lineTo(this.size, this.size);
                ctx.closePath();
                break;
            case 'square':
                ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            default: // circle
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        }
        
        ctx.fillStyle = this.hexToRgba(this.color, this.opacity);
        ctx.fill();
        ctx.restore();
    }
}

// Utility functions
function initParticleSystem() {
    const heroBackground = document.querySelector('.hero-particles');
    if (heroBackground) {
        const particleSystem = new AdvancedParticleSystem(heroBackground, {
            particleCount: 80,
            particleSize: 3,
            particleColor: '#6366f1',
            particleOpacity: 0.4,
            connectionDistance: 120,
            connectionOpacity: 0.1,
            mouseInteraction: true,
            particleTypes: ['circle', 'triangle'],
            colorVariation: true,
            sizeVariation: true
        });
        
        // Store reference for cleanup
        window.particleSystem = particleSystem;
    }
}

// Background particle system for other sections
function initBackgroundParticles() {
    const sections = document.querySelectorAll('.services, .portfolio');
    sections.forEach(section => {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'section-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 0;
        `;
        
        section.style.position = 'relative';
        section.appendChild(particleContainer);
        
        new ParticleSystem(particleContainer, {
            particleCount: 30,
            particleSize: 2,
            particleColor: '#06b6d4',
            particleOpacity: 0.2,
            connectionDistance: 80,
            connectionOpacity: 0.05,
            mouseInteraction: false
        });
    });
}

// Interactive cursor effect
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'interactive-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(60, 224, 208, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
    }
}

// Initialize all particle effects
document.addEventListener('DOMContentLoaded', () => {
    initParticleSystem();
    initBackgroundParticles();
    
    // Only init cursor on desktop
    if (window.innerWidth > 768) {
        initCursorEffect();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});

// Export for global use
window.ParticleSystem = ParticleSystem;
window.AdvancedParticleSystem = AdvancedParticleSystem;
