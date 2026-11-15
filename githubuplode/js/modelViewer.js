/**
 * 3D Equipment Model Viewer & Meshy.ai GLTF Importer
 * Renders procedural 3D space probes & supports custom .glb / meshy.ai models
 */

export class ModelViewer {
    constructor(canvasContainer) {
        this.container = canvasContainer;
        this.currentMesh = null;
        this.wireframeMode = false;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.width = this.container.clientWidth || 400;
        this.height = this.container.clientHeight || 350;

        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
        this.camera.position.set(3, 2.2, 3.8);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const amb = new THREE.AmbientLight(0x404050, 1.8);
        this.scene.add(amb);

        this.keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
        this.keyLight.position.set(5, 8, 4);
        this.scene.add(this.keyLight);

        this.fillLight = new THREE.DirectionalLight(0x6699ff, 1.0);
        this.fillLight.position.set(-5, -2, -4);
        this.scene.add(this.fillLight);

        // Ground shadow grid
        const grid = new THREE.GridHelper(6, 12, 0x00ffcc, 0x112233);
        grid.position.y = -0.8;
        this.scene.add(grid);

        this.modelGroup = new THREE.Group();
        this.scene.add(this.modelGroup);

        this.isInteracting = false;
        this.autoSpin = true;
        this.setupControls();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupControls() {
        let isDown = false;
        let prevPos = { x: 0, y: 0 };
        const dom = this.renderer.domElement;

        dom.addEventListener('mousedown', (e) => {
            isDown = true;
            this.autoSpin = false;
            prevPos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => { isDown = false; });

        dom.addEventListener('mousemove', (e) => {
            if (isDown) {
                const dx = e.clientX - prevPos.x;
                const dy = e.clientY - prevPos.y;
                this.modelGroup.rotation.y += dx * 0.01;
                this.modelGroup.rotation.x += dy * 0.01;
                prevPos = { x: e.clientX, y: e.clientY };
            }
        });

        // Zoom with wheel
        dom.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z = Math.max(1.8, Math.min(8.0, this.camera.position.z + e.deltaY * 0.003));
        }, { passive: false });
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        this.modelGroup.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.wireframe = this.wireframeMode);
                } else {
                    child.material.wireframe = this.wireframeMode;
                }
            }
        });
        return this.wireframeMode;
    }

    resetView() {
        this.modelGroup.rotation.set(0, 0, 0);
        this.camera.position.set(3, 2.2, 3.8);
        this.autoSpin = true;
    }

    loadEquipmentModel(artifact) {
        // Clear previous model
        while (this.modelGroup.children.length > 0) {
            this.modelGroup.remove(this.modelGroup.children[0]);
        }

        // If an official NASA GLB model file is specified, load it!
        if (artifact.modelPath && window.THREE && window.THREE.GLTFLoader) {
            const loader = new THREE.GLTFLoader();
            loader.load(
                artifact.modelPath,
                (gltf) => {
                    while (this.modelGroup.children.length > 0) {
                        this.modelGroup.remove(this.modelGroup.children[0]);
                    }
                    const root = gltf.scene;

                    // Compute bounding box and normalize scale & position
                    const box = new THREE.Box3().setFromObject(root);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const targetScale = 2.4 / (maxDim || 1);
                    root.scale.set(targetScale, targetScale, targetScale);

                    // Center the model in the holographic chamber
                    root.position.x = -center.x * targetScale;
                    root.position.y = -center.y * targetScale;
                    root.position.z = -center.z * targetScale;

                    // Enhance materials for high-contrast space lighting
                    root.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    this.modelGroup.add(root);
                    this.currentMesh = root;
                    this.resetView();
                },
                undefined,
                (err) => {
                    console.warn("Could not load GLB model, using procedural fallback:", err);
                    const fallback = this.buildProceduralModel(artifact.id);
                    this.modelGroup.add(fallback);
                    this.currentMesh = fallback;
                    this.resetView();
                }
            );
        } else {
            // Fallback procedural model
            const model = this.buildProceduralModel(artifact.id);
            this.modelGroup.add(model);
            this.currentMesh = model;
            this.resetView();
        }
    }

    /**
     * Supports user loading their own 3D GLTF / GLB generated with Meshy.ai
     */
    loadGLTFFromURLOrFile(fileOrUrl, onLoadSuccess, onLoadError) {
        if (!THREE.GLTFLoader) {
            console.warn("GLTFLoader not loaded in runtime");
            return;
        }

        const loader = new THREE.GLTFLoader();
        const loadHandler = (gltf) => {
            while (this.modelGroup.children.length > 0) {
                this.modelGroup.remove(this.modelGroup.children[0]);
            }
            const root = gltf.scene;

            // Compute bounding box and normalize scale
            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.0 / (maxDim || 1);
            root.scale.set(scale, scale, scale);
            root.position.y = -0.5;

            this.modelGroup.add(root);
            this.resetView();
            if (onLoadSuccess) onLoadSuccess();
        };

        if (typeof fileOrUrl === 'string') {
            loader.load(fileOrUrl, loadHandler, undefined, onLoadError);
        } else if (fileOrUrl instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                loader.parse(e.target.result, '', loadHandler, onLoadError);
            };
            reader.readAsArrayBuffer(fileOrUrl);
        }
    }

    /**
     * Procedural High-Detail 3D Mesh Generator for each NASA artifact
     */
    buildProceduralModel(artifactId) {
        const group = new THREE.Group();

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xdfab33,
            metalness: 0.9,
            roughness: 0.3
        });
        const darkMetalMat = new THREE.MeshStandardMaterial({
            color: 0x22252a,
            metalness: 0.8,
            roughness: 0.4
        });
        const solarPanelMat = new THREE.MeshStandardMaterial({
            color: 0x112255,
            metalness: 0.5,
            roughness: 0.2
        });
        const silverMat = new THREE.MeshStandardMaterial({
            color: 0xdde2ea,
            metalness: 0.85,
            roughness: 0.3
        });

        if (artifactId.includes('opportunity') || artifactId.includes('spirit')) {
            // MER Rover Body
            const bodyGeo = new THREE.BoxGeometry(1.6, 0.4, 1.1);
            const body = new THREE.Mesh(bodyGeo, goldMat);
            group.add(body);

            // Solar Array Wings
            const wingGeo = new THREE.BoxGeometry(2.4, 0.04, 1.4);
            const wing = new THREE.Mesh(wingGeo, solarPanelMat);
            wing.position.y = 0.22;
            group.add(wing);

            // Pancam Mast (Head)
            const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12);
            const mast = new THREE.Mesh(mastGeo, silverMat);
            mast.position.set(0.5, 0.65, 0.3);
            group.add(mast);

            const camGeo = new THREE.BoxGeometry(0.35, 0.15, 0.18);
            const cam = new THREE.Mesh(camGeo, darkMetalMat);
            cam.position.set(0.5, 1.1, 0.3);
            group.add(cam);

            // High Gain Antenna Dish
            const dishGeo = new THREE.CylinderGeometry(0.25, 0.05, 0.08, 16);
            const dish = new THREE.Mesh(dishGeo, silverMat);
            dish.position.set(-0.5, 0.35, -0.2);
            dish.rotation.z = 0.4;
            group.add(dish);

            // 6 Rocker-Bogie Wheels
            const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 16);
            const wheelMat = darkMetalMat;
            const wheelPositions = [
                [-0.8, -0.4, 0.7], [0, -0.4, 0.75], [0.8, -0.4, 0.7],
                [-0.8, -0.4, -0.7], [0, -0.4, -0.75], [0.8, -0.4, -0.7]
            ];
            wheelPositions.forEach(p => {
                const w = new THREE.Mesh(wheelGeo, wheelMat);
                w.rotation.x = Math.PI / 2;
                w.position.set(p[0], p[1], p[2]);
                group.add(w);
            });

        } else if (artifactId.includes('insight')) {
            // InSight Lander: Hexagonal Deck + Dual Large Circular Solar Arrays
            const deckGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.25, 6);
            const deck = new THREE.Mesh(deckGeo, goldMat);
            group.add(deck);

            // Circular solar panels (Left & Right)
            const panelGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.03, 32);
            const leftPanel = new THREE.Mesh(panelGeo, solarPanelMat);
            leftPanel.position.set(1.5, 0.05, 0);
            leftPanel.rotation.x = 0.1;
            group.add(leftPanel);

            const rightPanel = new THREE.Mesh(panelGeo, solarPanelMat);
            rightPanel.position.set(-1.5, 0.05, 0);
            rightPanel.rotation.x = -0.1;
            group.add(rightPanel);

            // SEIS Dome (Heartbeat seismometer)
            const domeGeo = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const domeMat = new THREE.MeshStandardMaterial({ color: 0xcc8833, metalness: 0.9, roughness: 0.2 });
            const dome = new THREE.Mesh(domeGeo, domeMat);
            dome.position.set(0.6, -0.45, 0.9);
            group.add(dome);

            // 3 Tripod Landing Struts
            for (let i = 0; i < 3; i++) {
                const angle = (i * Math.PI * 2) / 3;
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9), silverMat);
                leg.position.set(Math.cos(angle) * 0.7, -0.3, Math.sin(angle) * 0.7);
                leg.rotation.z = Math.cos(angle) * 0.5;
                leg.rotation.x = Math.sin(angle) * 0.5;
                group.add(leg);
            }

        } else if (artifactId.includes('ingenuity')) {
            // Ingenuity Helicopter: Fuselage box, landing legs, mast, and dual coaxial rotor blades
            const box = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), goldMat);
            group.add(box);

            // Rotor Mast
            const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), darkMetalMat);
            mast.position.y = 0.6;
            group.add(mast);

            // Small Solar Panel on top
            const topSolar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.25), solarPanelMat);
            topSolar.position.y = 1.15;
            group.add(topSolar);

            // Twin Counter-Rotating Blades
            const bladeGeo = new THREE.BoxGeometry(2.1, 0.02, 0.12);
            const blade1 = new THREE.Mesh(bladeGeo, darkMetalMat);
            blade1.position.y = 0.75;
            group.add(blade1);

            const blade2 = new THREE.Mesh(bladeGeo, darkMetalMat);
            blade2.position.y = 0.95;
            blade2.rotation.y = Math.PI / 2;
            group.add(blade2);

            // 4 Carbon fiber spring legs
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Math.PI / 4;
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9), darkMetalMat);
                leg.position.set(Math.cos(angle) * 0.4, -0.35, Math.sin(angle) * 0.4);
                leg.rotation.z = Math.cos(angle) * 0.6;
                leg.rotation.x = Math.sin(angle) * 0.6;
                group.add(leg);
            }

        } else if (artifactId.includes('apollo-11') || artifactId.includes('descent')) {
            // Apollo 11 Lunar Module Descent Stage
            const octGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.7, 8);
            const descentBody = new THREE.Mesh(octGeo, goldMat);
            group.add(descentBody);

            // Descent Engine Rocket Bell
            const bellGeo = new THREE.ConeGeometry(0.5, 0.6, 16, 1, true);
            const bell = new THREE.Mesh(bellGeo, darkMetalMat);
            bell.position.y = -0.4;
            bell.rotation.x = Math.PI;
            group.add(bell);

            // 4 Outrigger Legs with Lunar Footpads
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Math.PI / 4;
                const legArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4), goldMat);
                legArm.position.set(Math.cos(angle) * 1.3, -0.35, Math.sin(angle) * 1.3);
                legArm.rotation.z = Math.cos(angle) * 0.7;
                legArm.rotation.x = Math.sin(angle) * 0.7;
                group.add(legArm);

                // Round footpad dish
                const footpad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16), silverMat);
                footpad.position.set(Math.cos(angle) * 1.8, -0.8, Math.sin(angle) * 1.8);
                group.add(footpad);
            }

            // Ladder on forward leg
            const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.04), silverMat);
            ladder.position.set(1.3, -0.3, 0);
            ladder.rotation.z = -0.4;
            group.add(ladder);

        } else if (artifactId.includes('lrv')) {
            // Lunar Roving Vehicle (Apollo 15 / 17 Moon Buggy)
            const frameGeo = new THREE.BoxGeometry(2.0, 0.2, 1.1);
            const frame = new THREE.Mesh(frameGeo, silverMat);
            group.add(frame);

            // 2 Lawn-chair seats
            for (let s of [-0.25, 0.25]) {
                const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.4), darkMetalMat);
                seatBack.position.set(s, 0.35, -0.15);
                group.add(seatBack);

                const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.4), darkMetalMat);
                seatBase.position.set(s, 0.14, 0.05);
                group.add(seatBase);
            }

            // High Gain Mesh Umbrella Antenna
            const umbrellaGeo = new THREE.ConeGeometry(0.4, 0.15, 16, 1, true);
            const umbrella = new THREE.Mesh(umbrellaGeo, goldMat);
            umbrella.position.set(0.65, 0.6, 0.35);
            umbrella.rotation.x = -0.8;
            group.add(umbrella);

            // 4 Open Wire-Mesh Wheels
            const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16, 1, true);
            const wheelMat = new THREE.MeshStandardMaterial({
                color: 0x999999,
                wireframe: true,
                metalness: 0.9
            });
            const wPos = [
                [-0.85, -0.2, 0.75], [0.85, -0.2, 0.75],
                [-0.85, -0.2, -0.75], [0.85, -0.2, -0.75]
            ];
            wPos.forEach(p => {
                const w = new THREE.Mesh(wheelGeo, wheelMat);
                w.rotation.x = Math.PI / 2;
                w.position.set(p[0], p[1], p[2]);
                group.add(w);
            });

        } else {
            // Surveyor 3 / Default Scientific Spacecraft
            const tripodBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 0.5, 3), silverMat);
            group.add(tripodBase);

            // Central mast & solar/battery panel
            const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), silverMat);
            mast.position.y = 0.6;
            group.add(mast);

            const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.04), solarPanelMat);
            panel.position.set(0, 1.0, 0);
            group.add(panel);

            // TV camera cylinder
            const tvCam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.35), darkMetalMat);
            tvCam.position.set(0.35, 0.3, 0.2);
            tvCam.rotation.z = 0.5;
            group.add(tvCam);

            // 3 landing legs
            for (let i = 0; i < 3; i++) {
                const a = (i * Math.PI * 2) / 3;
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1), silverMat);
                leg.position.set(Math.cos(a) * 0.7, -0.35, Math.sin(a) * 0.7);
                leg.rotation.z = Math.cos(a) * 0.6;
                leg.rotation.x = Math.sin(a) * 0.6;
                group.add(leg);
            }
        }

        return group;
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.autoSpin && this.modelGroup) {
            this.modelGroup.rotation.y += 0.006;
        }
        this.renderer.render(this.scene, this.camera);
    }
}
