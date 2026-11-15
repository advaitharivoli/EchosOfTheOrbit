/**
 * 3D Planetary Globe & NASA "Eyes on the Solar System" Orrery Engine
 * Built with Three.js
 * Supports:
 * - Planetary Surface Mode (Mars & Moon with accurate landing beacons)
 * - NASA "Eyes on the Solar System" Mode (Sun, Orbits, Hohmann Transfer Trajectories, Real-time Latency)
 */

export class PlanetaryScene {
    constructor(containerElement, onSelectArtifact) {
        this.container = containerElement;
        this.onSelectArtifact = onSelectArtifact;
        this.viewMode = "planet"; // 'planet' or 'solar_system'
        this.currentPlanet = "mars";
        this.artifacts = [];
        this.markers = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredMarker = null;

        // Solar system simulation params
        this.simSpeed = 1.0;
        this.isSimPaused = false;
        this.orbitTime = 0;
        this.solarBodies = {};

        // Camera Transition state
        this.isTransitioning = false;
        this.targetCameraPos = new THREE.Vector3(0, 0, 11);
        this.targetCameraLookAt = new THREE.Vector3(0, 0, 0);

        this.initThree();
        this.createStars();
        this.createPlanet();
        this.createSolarSystem();
        this.setupEventListeners();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.width = this.container.clientWidth || window.innerWidth;
        this.height = this.container.clientHeight || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 2000);
        this.camera.position.set(0, 0, 11);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0x333344, 1.4);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
        this.sunLight.position.set(20, 10, 15);
        this.scene.add(this.sunLight);

        this.rimLight = new THREE.DirectionalLight(0x4466aa, 1.0);
        this.rimLight.position.set(-20, -8, -15);
        this.scene.add(this.rimLight);

        // Planet Pivot Group for surface view
        this.planetGroup = new THREE.Group();
        this.scene.add(this.planetGroup);

        // Solar System Orrery Group
        this.solarGroup = new THREE.Group();
        this.solarGroup.visible = false;
        this.scene.add(this.solarGroup);

        this.targetRotationY = 0;
        this.targetRotationX = 0;
        this.autoRotate = true;
    }

    createStars() {
        const starGeo = new THREE.BufferGeometry();
        const starCount = 2500;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            const r = 250 + Math.random() * 200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i] = r * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = r * Math.cos(phi);

            const tone = 0.7 + Math.random() * 0.3;
            colors[i] = tone;
            colors[i + 1] = tone * (0.85 + Math.random() * 0.15);
            colors[i + 2] = tone * (0.95 + Math.random() * 0.05);
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 1.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        this.starField = new THREE.Points(starGeo, starMat);
        this.scene.add(this.starField);
    }

    /**
     * NASA "Eyes on the Solar System" Interactive 3D Orrery
     */
    createSolarSystem() {
        // 1. Central Glowing Sun
        const sunGeo = new THREE.SphereGeometry(2.4, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
        const sunMesh = new THREE.Mesh(sunGeo, sunMat);

        // Sun Corona Glow
        const coronaGeo = new THREE.SphereGeometry(3.0, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.35,
            side: THREE.BackSide
        });
        const corona = new THREE.Mesh(coronaGeo, coronaMat);
        sunMesh.add(corona);

        // Sun Point Light
        const sunLight = new THREE.PointLight(0xffffff, 3.5, 300, 0.5);
        sunMesh.add(sunLight);
        this.solarGroup.add(sunMesh);
        this.solarBodies.sun = sunMesh;

        // Planet specs: name, distance, radius, color, speed, eccentricity
        const planets = [
            { id: "mercury", name: "Mercury", dist: 5.5, size: 0.35, color: 0x888888, speed: 4.15 },
            { id: "venus", name: "Venus", dist: 8.5, size: 0.65, color: 0xe3bb76, speed: 1.62 },
            { id: "earth", name: "Earth", dist: 12.5, size: 0.75, color: 0x2288ff, speed: 1.0, hasMoon: true },
            { id: "mars", name: "Mars", dist: 17.5, size: 0.52, color: 0xdd4422, speed: 0.53 },
            { id: "jupiter", name: "Jupiter", dist: 25.0, size: 1.4, color: 0xc49e7a, speed: 0.08 }
        ];

        planets.forEach(p => {
            // Orbital ring
            const orbitCurve = new THREE.EllipseCurve(0, 0, p.dist, p.dist * 0.98, 0, 2 * Math.PI, false, 0);
            const points = orbitCurve.getPoints(120);
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
            orbitGeo.rotateX(Math.PI / 2);

            const orbitMat = new THREE.LineBasicMaterial({
                color: p.id === 'mars' ? 0xff6644 : (p.id === 'earth' ? 0x00e5ff : 0x445577),
                transparent: true,
                opacity: p.id === 'mars' || p.id === 'earth' ? 0.7 : 0.3
            });
            const orbitLine = new THREE.Line(orbitGeo, orbitMat);
            this.solarGroup.add(orbitLine);

            // Planet Mesh Pivot
            const pivot = new THREE.Group();
            this.solarGroup.add(pivot);

            const pGeo = new THREE.SphereGeometry(p.size, 24, 24);
            const pMat = new THREE.MeshStandardMaterial({
                color: p.color,
                roughness: 0.8
            });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            pMesh.position.x = p.dist;
            pivot.add(pMesh);

            // Add Moon orbiting Earth
            if (p.hasMoon) {
                const moonPivot = new THREE.Group();
                pMesh.add(moonPivot);

                const mGeo = new THREE.SphereGeometry(0.2, 16, 16);
                const mMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
                const mMesh = new THREE.Mesh(mGeo, mMat);
                mMesh.position.x = 1.6;
                moonPivot.add(mMesh);
                this.solarBodies.moonPivot = moonPivot;
                this.solarBodies.moonMesh = mMesh;
            }

            this.solarBodies[p.id] = {
                mesh: pMesh,
                pivot: pivot,
                spec: p
            };
        });

        // 3. Interplanetary Trajectory Curve (Hohmann Transfer Orbit: Earth to Mars)
        const trajectoryPoints = [];
        for (let i = 0; i <= 60; i++) {
            const t = i / 60;
            const angle = t * Math.PI * 0.9;
            const r = 12.5 + (17.5 - 12.5) * t;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * (r * 0.95);
            trajectoryPoints.push(new THREE.Vector3(x, 0, z));
        }

        const trajGeo = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
        const trajMat = new THREE.LineDashedMaterial({
            color: 0x00ffcc,
            dashSize: 0.5,
            gapSize: 0.3,
            transparent: true,
            opacity: 0.85
        });
        const trajectoryLine = new THREE.Line(trajGeo, trajMat);
        trajectoryLine.computeLineDistances();
        this.solarGroup.add(trajectoryLine);

        // Spacecraft Cruise Beacon (InSight / Opportunity on trajectory)
        const scGeo = new THREE.ConeGeometry(0.25, 0.6, 8);
        const scMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const scMesh = new THREE.Mesh(scGeo, scMat);
        scMesh.rotation.x = Math.PI / 2;
        this.solarGroup.add(scMesh);
        this.solarBodies.spacecraft = {
            mesh: scMesh,
            points: trajectoryPoints,
            progress: 0.55
        };
    }

    createPlanet() {
        const radius = this.currentPlanet === 'mars' ? 3.5 : 3.2;
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        const textureFile = this.currentPlanet === 'mars' ? 'assets/mars_texture.jpg' : 'assets/moon_texture.jpg';
        const bumpFile = this.currentPlanet === 'mars' ? 'assets/mars_bump.jpg' : 'assets/moon_bump.jpg';

        const diffuseMap = textureLoader.load(
            textureFile,
            undefined,
            undefined,
            () => {
                console.warn("Using fallback procedural texture for", this.currentPlanet);
                this.planetMesh.material.map = this.generateProceduralPlanetTexture(this.currentPlanet);
                this.planetMesh.material.needsUpdate = true;
            }
        );

        const bumpMap = textureLoader.load(bumpFile);

        const material = new THREE.MeshStandardMaterial({
            color: this.currentPlanet === 'mars' ? 0xd0552b : 0xaaaaaa,
            map: diffuseMap,
            bumpMap: bumpMap,
            bumpScale: this.currentPlanet === 'mars' ? 0.08 : 0.06,
            roughness: 0.85,
            metalness: 0.1
        });

        this.planetMesh = new THREE.Mesh(geometry, material);
        this.planetGroup.add(this.planetMesh);

        // Realistic Atmospheric Edge Glow Mesh
        const atmosGeo = new THREE.SphereGeometry(radius * 1.025, 64, 64);
        const atmosColor = this.currentPlanet === 'mars' ? 0xdd6633 : 0x667799;
        const atmosMat = new THREE.MeshBasicMaterial({
            color: atmosColor,
            transparent: true,
            opacity: this.currentPlanet === 'mars' ? 0.18 : 0.05,
            side: THREE.BackSide
        });
        this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
        this.planetGroup.add(this.atmosphereMesh);
    }

    generateProceduralPlanetTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (type === 'mars') {
            ctx.fillStyle = '#a83c1d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#777788';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Switch view between NASA Solar System Orrery and Planetary Surface
     */
    setViewMode(mode) {
        this.viewMode = mode;
        if (mode === 'solar_system') {
            this.planetGroup.visible = false;
            this.solarGroup.visible = true;
            this.targetCameraPos.set(0, 35, 38);
            this.targetCameraLookAt.set(0, 0, 0);
            this.isTransitioning = true;
        } else {
            this.solarGroup.visible = false;
            this.planetGroup.visible = true;
            this.targetCameraPos.set(0, 0, 11);
            this.targetCameraLookAt.set(0, 0, 0);
            this.isTransitioning = true;
        }
    }

    switchPlanet(planetId, artifactsList) {
        this.currentPlanet = planetId;
        this.artifacts = artifactsList.filter(a => a.planet === planetId);

        this.clearMarkers();
        if (this.planetMesh) this.planetGroup.remove(this.planetMesh);
        if (this.atmosphereMesh) this.planetGroup.remove(this.atmosphereMesh);

        this.createPlanet();
        this.populateArtifactMarkers();

        this.planetGroup.rotation.set(0, 0, 0);
        this.targetRotationY = 0;
        this.targetRotationX = 0;
    }

    latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));

        return new THREE.Vector3(x, y, z);
    }

    clearMarkers() {
        this.markers.forEach(m => this.planetGroup.remove(m.mesh));
        this.markers = [];
    }

    populateArtifactMarkers() {
        this.clearMarkers();
        const radius = (this.currentPlanet === 'mars' ? 3.5 : 3.2) * 1.02;

        this.artifacts.forEach((artifact) => {
            const pos = this.latLonToVector3(artifact.coordinates.lat, artifact.coordinates.lon, radius);

            const markerGroup = new THREE.Group();
            markerGroup.position.copy(pos);
            markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

            const pinGeo = new THREE.CylinderGeometry(0.04, 0.01, 0.45, 12);
            const pinMat = new THREE.MeshBasicMaterial({
                color: this.currentPlanet === 'mars' ? 0xff5533 : 0x44ddff
            });
            const pin = new THREE.Mesh(pinGeo, pinMat);
            pin.position.y = 0.22;
            markerGroup.add(pin);

            const headGeo = new THREE.SphereGeometry(0.09, 16, 16);
            const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
            head.position.y = 0.45;
            markerGroup.add(head);

            const ringGeo = new THREE.RingGeometry(0.12, 0.16, 24);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.currentPlanet === 'mars' ? 0xffaa44 : 0x66ffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.02;
            markerGroup.add(ring);

            this.planetGroup.add(markerGroup);

            this.markers.push({
                artifact: artifact,
                mesh: markerGroup,
                hitTarget: head,
                ring: ring
            });
        });
    }

    setupEventListeners() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        const dom = this.renderer.domElement;

        dom.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.autoRotate = false;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        dom.addEventListener('mousemove', (e) => {
            const rect = dom.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;

            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                if (this.viewMode === 'solar_system') {
                    this.solarGroup.rotation.y += deltaX * 0.005;
                } else {
                    this.planetGroup.rotation.y += deltaX * 0.005;
                    this.planetGroup.rotation.x += deltaY * 0.005;
                    this.planetGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.planetGroup.rotation.x));
                }

                previousMousePosition = { x: e.clientX, y: e.clientY };
            } else if (this.viewMode === 'planet') {
                this.checkMarkerHover();
            }
        });

        dom.addEventListener('click', () => {
            if (this.viewMode === 'planet') {
                const hit = this.checkMarkerClick();
                if (hit) this.onSelectArtifact(hit);
            }
        });

        // Wheel Zoom for Solar System
        dom.addEventListener('wheel', (e) => {
            if (this.viewMode === 'solar_system') {
                e.preventDefault();
                this.camera.position.z = Math.max(15, Math.min(70, this.camera.position.z + e.deltaY * 0.04));
                this.camera.position.y = this.camera.position.z * 0.9;
            }
        }, { passive: false });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        if (!this.container) return;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        if (w > 0 && h > 0) {
            this.width = w;
            this.height = h;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }
    }

    checkMarkerHover() {
        if (!this.markers.length) return;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hitObjects = this.markers.map(m => m.hitTarget);
        const intersects = this.raycaster.intersectObjects(hitObjects);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const markerObj = this.markers.find(m => m.hitTarget === hitMesh);
            if (markerObj && this.hoveredMarker !== markerObj) {
                this.hoveredMarker = markerObj;
                this.container.style.cursor = 'pointer';
                this.showTooltip(markerObj.artifact, this.mouse);
            }
        } else if (this.hoveredMarker) {
            this.hoveredMarker = null;
            this.container.style.cursor = 'default';
            this.hideTooltip();
        }
    }

    checkMarkerClick() {
        if (!this.markers.length) return null;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hitObjects = this.markers.map(m => m.hitTarget);
        const intersects = this.raycaster.intersectObjects(hitObjects);
        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const markerObj = this.markers.find(m => m.hitTarget === hitMesh);
            return markerObj ? markerObj.artifact : null;
        }
        return null;
    }

    showTooltip(artifact, mousePos) {
        let tooltip = document.getElementById('globe-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'globe-tooltip';
            tooltip.className = 'globe-tooltip';
            document.body.appendChild(tooltip);
        }
        const uncertaintyBadge = artifact.coordinateMetadata ? `<div style="font-size: 0.72rem; color: #33ff99; margin-top: 2px;">UNCERTAINTY: ${artifact.coordinateMetadata.uncertainty}</div>` : '';
        tooltip.innerHTML = `
            <div class="tooltip-header">${artifact.name}</div>
            <div class="tooltip-loc">📍 ${artifact.locationName}</div>
            <div style="font-size: 0.74rem; color: #a0aec0;">${artifact.coordinates.lat}°N, ${artifact.coordinates.lon}°E</div>
            ${uncertaintyBadge}
            <div class="tooltip-action">Click to inspect dossier & story 📡</div>
        `;
        const screenX = (mousePos.x * 0.5 + 0.5) * this.width;
        const screenY = (-mousePos.y * 0.5 + 0.5) * this.height;
        tooltip.style.left = `${screenX + 15}px`;
        tooltip.style.top = `${screenY - 30}px`;
        tooltip.classList.add('visible');
    }

    hideTooltip() {
        const tooltip = document.getElementById('globe-tooltip');
        if (tooltip) tooltip.classList.remove('visible');
    }

    animate(time) {
        requestAnimationFrame(this.animate);
        const seconds = time * 0.001;

        // Auto-correct canvas size if container dimensions changed
        if (this.container) {
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            if (w > 0 && h > 0 && (w !== this.width || h !== this.height)) {
                this.handleResize();
            }
        }

        // Smooth camera lerping when switching modes
        if (this.isTransitioning) {
            this.camera.position.lerp(this.targetCameraPos, 0.06);
            this.camera.lookAt(this.targetCameraLookAt);
            if (this.camera.position.distanceTo(this.targetCameraPos) < 0.2) {
                this.isTransitioning = false;
            }
        }

        // Solar system orrery animation
        if (this.viewMode === 'solar_system' && !this.isSimPaused) {
            this.orbitTime += 0.01 * this.simSpeed;

            // Revolve each planet
            ['mercury', 'venus', 'earth', 'mars', 'jupiter'].forEach(id => {
                const body = this.solarBodies[id];
                if (body && body.pivot) {
                    body.pivot.rotation.y = this.orbitTime * body.spec.speed * 0.2;
                }
            });

            // Moon orbit around Earth
            if (this.solarBodies.moonPivot) {
                this.solarBodies.moonPivot.rotation.y = this.orbitTime * 2.5;
            }

            // Spacecraft progress along Earth-to-Mars trajectory
            const sc = this.solarBodies.spacecraft;
            if (sc && sc.points) {
                sc.progress = (sc.progress + 0.0008 * this.simSpeed) % 1.0;
                const idx = Math.floor(sc.progress * (sc.points.length - 1));
                sc.mesh.position.copy(sc.points[idx]);
            }
        } else if (this.viewMode === 'planet') {
            if (this.autoRotate) {
                this.planetGroup.rotation.y += 0.0015;
            }
            this.markers.forEach((m, idx) => {
                const pulse = 1 + Math.sin(seconds * 4 + idx) * 0.25;
                m.ring.scale.set(pulse, pulse, pulse);
            });
        }

        if (this.starField) {
            this.starField.rotation.y = seconds * 0.0002;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
