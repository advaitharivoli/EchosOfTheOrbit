/**
 * Antigravity Interactive Warp & Gravitational Lens Canvas
 * Simulates a space-time coordinate grid with an elastic 3D bulge
 * and gravitational repulsion following the mouse cursor.
 */

class AntigravityWarpBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'antigravity-warp-canvas';
        this.ctx = this.canvas.getContext('2d');

        // Style canvas as fixed background behind all UI elements
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.9';

        document.body.prepend(this.canvas);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.mouse = {
            x: this.width * 0.5,
            y: this.height * 0.4,
            targetX: this.width * 0.5,
            targetY: this.height * 0.4,
            isMoving: false,
            radius: 260,
            strength: 55
        };

        this.nodes = [];
        this.stars = [];
        this.ripples = [];
        this.spacing = 52;
        this.cols = 0;
        this.rows = 0;
        this.lastMoveTime = Date.now();

        this.init();
        this.setupEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createStars(120);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.cols = Math.ceil(this.width / this.spacing) + 2;
        this.rows = Math.ceil(this.height / this.spacing) + 2;

        this.nodes = [];
        for (let r = 0; r <= this.rows; r++) {
            for (let c = 0; c <= this.cols; c++) {
                const ox = (c - 1) * this.spacing;
                const oy = (r - 1) * this.spacing;
                this.nodes.push({
                    ox: ox,
                    oy: oy,
                    x: ox,
                    y: oy,
                    vx: 0,
                    vy: 0,
                    col: c,
                    row: r,
                    baseAlpha: 0.16 + (Math.sin(c * 0.5) * Math.cos(r * 0.5) * 0.08)
                });
            }
        }
    }

    createStars(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.6 + 0.6,
                baseAlpha: Math.random() * 0.6 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.4 ? 'rgba(0, 229, 255,' : (Math.random() > 0.5 ? 'rgba(192, 132, 252,' : 'rgba(255, 222, 56,')
            });
        }
    }

    setupEvents() {
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;
            this.mouse.isMoving = true;
            this.lastMoveTime = Date.now();
        });

        // Touch support for tablets/mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.targetX = e.touches[0].clientX;
                this.mouse.targetY = e.touches[0].clientY;
                this.mouse.isMoving = true;
                this.lastMoveTime = Date.now();
            }
        }, { passive: true });

        // Gravitational Ripple on click
        window.addEventListener('click', (e) => {
            this.ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 10,
                maxRadius: 420,
                speed: 12,
                strength: 40,
                alpha: 0.8
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse damping / lerp
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;

        // Auto-idle floating if mouse stopped
        if (Date.now() - this.lastMoveTime > 2500) {
            const t = Date.now() * 0.0008;
            this.mouse.targetX = (this.width * 0.5) + Math.cos(t) * (this.width * 0.25);
            this.mouse.targetY = (this.height * 0.45) + Math.sin(t * 1.3) * (this.height * 0.18);
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw Subtle Gravitational Lens Glow around mouse
        const grad = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 10,
            this.mouse.x, this.mouse.y, this.mouse.radius * 1.2
        );
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
        grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.08)');
        grad.addColorStop(0.8, 'rgba(0, 229, 255, 0.02)');
        grad.addColorStop(1, 'transparent');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius * 1.2, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Update Gravitational Warp Shockwave Ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const rip = this.ripples[i];
            rip.radius += rip.speed;
            rip.alpha *= 0.94;

            this.ctx.save();
            this.ctx.strokeStyle = `rgba(0, 229, 255, ${rip.alpha * 0.45})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();

            if (rip.radius > rip.maxRadius || rip.alpha < 0.02) {
                this.ripples.splice(i, 1);
            }
        }

        // 3. Update Spring Physics for Grid Nodes with Antigravity Bulge
        const spring = 0.08;
        const friction = 0.84;
        const R = this.mouse.radius;
        const R_sq = R * R;
        const strength = this.mouse.strength;

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];

            // Default home target
            let targetX = node.ox;
            let targetY = node.oy;

            // Gravitational Mouse Bulge Repulsion (lens distortion)
            const dx = node.ox - this.mouse.x;
            const dy = node.oy - this.mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < R_sq && distSq > 0.001) {
                const dist = Math.sqrt(distSq);
                const norm = 1 - (dist / R);
                // Dome bulge curvature equation: sin(norm * PI/2)
                const push = Math.sin(norm * Math.PI * 0.5) * strength;
                targetX += (dx / dist) * push;
                targetY += (dy / dist) * push;
            }

            // Influence from active shockwave ripples
            for (let r = 0; r < this.ripples.length; r++) {
                const rip = this.ripples[r];
                const rdx = node.x - rip.x;
                const rdy = node.y - rip.y;
                const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
                const diff = Math.abs(rdist - rip.radius);
                if (diff < 40 && rdist > 0.001) {
                    const wavePush = (1 - (diff / 40)) * rip.strength * rip.alpha;
                    targetX += (rdx / rdist) * wavePush;
                    targetY += (rdy / rdist) * wavePush;
                }
            }

            // Verlet/Spring acceleration
            node.vx += (targetX - node.x) * spring;
            node.vy += (targetY - node.y) * spring;
            node.vx *= friction;
            node.vy *= friction;

            node.x += node.vx;
            node.y += node.vy;
        }

        // 4. Render Warped Perspective Grid Lines
        this.ctx.lineWidth = 1;

        // Horizontal connecting curves
        for (let r = 0; r <= this.rows; r++) {
            this.ctx.beginPath();
            let first = true;
            for (let c = 0; c <= this.cols; c++) {
                const node = this.nodes[r * (this.cols + 1) + c];
                if (!node) continue;
                if (first) {
                    this.ctx.moveTo(node.x, node.y);
                    first = false;
                } else {
                    this.ctx.lineTo(node.x, node.y);
                }
            }
            this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.07)';
            this.ctx.stroke();
        }

        // Vertical connecting curves
        for (let c = 0; c <= this.cols; c++) {
            this.ctx.beginPath();
            let first = true;
            for (let r = 0; r <= this.rows; r++) {
                const node = this.nodes[r * (this.cols + 1) + c];
                if (!node) continue;
                if (first) {
                    this.ctx.moveTo(node.x, node.y);
                    first = false;
                } else {
                    this.ctx.lineTo(node.x, node.y);
                }
            }
            this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.06)';
            this.ctx.stroke();
        }

        // 5. Render Grid Nodes (Glowing Crosshairs & Bulge Highlights)
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const distFromMouse = Math.hypot(node.x - this.mouse.x, node.y - this.mouse.y);

            let nodeAlpha = node.baseAlpha;
            let nodeRadius = 1.2;

            if (distFromMouse < R) {
                const prox = 1 - (distFromMouse / R);
                nodeAlpha += prox * 0.65;
                nodeRadius += prox * 2.2;

                // Subtle neon crosshair near mouse center
                if (prox > 0.4) {
                    this.ctx.strokeStyle = `rgba(0, 229, 255, ${prox * 0.4})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x - 3, node.y);
                    this.ctx.lineTo(node.x + 3, node.y);
                    this.ctx.moveTo(node.x, node.y - 3);
                    this.ctx.lineTo(node.x, node.y + 3);
                    this.ctx.stroke();
                }
            }

            this.ctx.fillStyle = distFromMouse < R ? `rgba(0, 229, 255, ${nodeAlpha})` : `rgba(255, 255, 255, ${nodeAlpha})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 6. Render Twinkling Distant Starfield with Parallax
        const parallaxX = (this.mouse.x - this.width * 0.5) * 0.02;
        const parallaxY = (this.mouse.y - this.height * 0.5) * 0.02;

        const time = Date.now();
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3;
            const currentAlpha = Math.max(0.1, star.baseAlpha + twinkle);

            this.ctx.fillStyle = `${star.color} ${currentAlpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

// Automatically instantiate when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.antigravityWarp = new AntigravityWarpBackground();
    });
} else {
    window.antigravityWarp = new AntigravityWarpBackground();
}
