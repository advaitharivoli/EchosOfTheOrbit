/**
 * Main Application Controller for THE LAST TRANSMISSION
 */

import { PLANETS_DATA, EQUIPMENT_DATABASE } from '../data/equipmentData.js';
import { NASA_GLOSSARY } from '../data/glossaryData.js';
import { PlanetaryScene } from './planetView.js';
import { ModelViewer } from './modelViewer.js';
import { telemetryAudio } from './audioTelemetry.js';
import { CapcomChatbot } from './chatbot.js';
import { InteractiveStorybook } from './storybook.js';

class App {
    constructor() {
        this.currentPlanet = 'mars';
        this.selectedArtifact = null;
        this.planetaryScene = null;
        this.modelViewer = null;
        this.isAudioMuted = false;
        this.userMode = localStorage.getItem('nasa_explorer_mode') || 'junior';

        this.init();
    }

    init() {
        // Initialize 3D Globe
        const globeContainer = document.getElementById('globe-canvas-container');
        this.planetaryScene = new PlanetaryScene(globeContainer, (artifact) => {
            this.openArtifactDossier(artifact);
        });

        // Initialize 3D Equipment Inspector
        const modelContainer = document.getElementById('model-viewer-canvas');
        this.modelViewer = new ModelViewer(modelContainer);

        // Load initial planet data
        this.setPlanet('mars');

        // Setup event handlers
        this.setupPlanetButtons();
        this.setupRosterList();
        this.setupAudioControls();
        this.setupExplorerRankGate();
        this.setupDossierModals();
        this.setupTributeSystem();
        this.setupMeshyIntegration();
        this.setupScavengerQuiz();
        this.setupSketchScanner();
        this.setupVideoTheater();
        this.chatbot = new CapcomChatbot();
        this.storybook = new InteractiveStorybook();
        this.setupLexiconExplainer();

        window.spaceApp = this;
        window.EQUIPMENT_DATABASE = EQUIPMENT_DATABASE;

        const heroBookBtn = document.getElementById('hero-open-book-btn');
        if (heroBookBtn) {
            heroBookBtn.addEventListener('click', () => {
                if (document.body.classList.contains('gate-locked')) {
                    const gate = document.getElementById('explorer-rank-gate');
                    if (gate) {
                        gate.scrollIntoView({ behavior: 'smooth' });
                        gate.classList.add('pulseHighlight');
                        setTimeout(() => gate.classList.remove('pulseHighlight'), 1200);
                    }
                    const errorMsg = document.getElementById('gate-error-msg');
                    if (errorMsg) errorMsg.style.display = 'block';
                    telemetryAudio.playBlip(300, 0.25);
                    return;
                }
                if (this.storybook) this.storybook.openBook('mer-b-opportunity', 0);
            });
        }
    }

    updateRouteUrl(mode, planet) {
        if (!mode || this.isRouting) return;
        let modeSlug = 'kids';
        if (mode === 'teen') modeSlug = 'teen';
        else if (mode === 'adult' || mode === 'senior') modeSlug = 'adult';

        let planetSlug = planet || this.currentPlanet || 'mars';
        if (planetSlug === 'solar_system') planetSlug = 'solar';

        const routePath = `/${modeSlug}/${planetSlug}`;

        try {
            window.history.replaceState({ mode: modeSlug, planet: planetSlug }, '', routePath);
        } catch (e) {
            // Fallback for sandboxed frames or file:// protocol
            const routeHash = `#/${modeSlug}/${planetSlug}`;
            if (window.location.hash !== routeHash) {
                window.location.hash = routeHash;
            }
        }
    }

    applyRouteFromUrl() {
        if (this.isRouting) return true;
        this.isRouting = true;

        try {
            const rawHash = (window.location.hash || '').toLowerCase().replace(/^[#!]+/, '').replace(/^\/+/, '');
            const rawPath = (window.location.pathname || '').toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');

            const testTarget = rawHash || rawPath;
            if (!testTarget) return false;

            let matchedCategory = null;
            let matchedPlanet = null;

            // Explicit IF statements checking sub-route category
            if (testTarget.includes('kid') || testTarget.includes('junior')) {
                matchedCategory = 'junior';
            } else if (testTarget.includes('teen')) {
                matchedCategory = 'teen';
            } else if (testTarget.includes('adult') || testTarget.includes('senior')) {
                matchedCategory = 'adult';
            }

            // If no recognized category, do not unlock
            if (!matchedCategory) return false;

            if (testTarget.includes('moon')) {
                matchedPlanet = 'moon';
            } else if (testTarget.includes('solar')) {
                matchedPlanet = 'solar_system';
            } else {
                matchedPlanet = 'mars';
            }

            // ONLY IF valid category was matched do we unlock gate to move to content
            document.body.classList.remove('gate-locked');
            if (this.planetaryScene) this.planetaryScene.handleResize();

            this.setExplorerMode(matchedCategory, false, false);
            this.setPlanet(matchedPlanet);
            return true;
        } finally {
            this.isRouting = false;
        }
    }

    updatePlanetaryHUDStats() {
        if (this.currentPlanet === 'solar_system') return;

        const planetInfo = PLANETS_DATA[this.currentPlanet] || PLANETS_DATA['mars'];
        const nameEl = document.getElementById('current-planet-name');
        const subEl = document.getElementById('planet-subtitle');
        const lbl1 = document.getElementById('label-stat-1');
        const lbl2 = document.getElementById('label-stat-2');
        const lbl3 = document.getElementById('label-stat-3');
        const lbl4 = document.getElementById('label-stat-4');
        const stat1 = document.getElementById('planet-stat-gravity');
        const stat2 = document.getElementById('planet-stat-temp');
        const stat3 = document.getElementById('planet-stat-atmos');
        const stat4 = document.getElementById('planet-stat-relics');

        if (!stat1 || !stat2 || !stat3 || !stat4) return;

        if (nameEl) nameEl.textContent = planetInfo.name.toUpperCase();

        // Dynamic if statements for mode-specific telemetry display
        if (this.userMode === 'junior') {
            if (this.currentPlanet === 'mars') {
                if (subEl) subEl.textContent = "The Giant Red Sandbox - Where Robots Roam!";
                if (lbl1) lbl1.textContent = "🦘 JUMP POWER:";
                stat1.textContent = "2.6x Higher Than Earth!";
                if (lbl2) lbl2.textContent = "❄️ WEATHER:";
                stat2.textContent = "Super Freezing (-63°C)";
                if (lbl3) lbl3.textContent = "🧑‍🚀 BREATHABLE AIR:";
                stat3.textContent = "None! Wear Helmet 🧑‍🚀";
                if (lbl4) lbl4.textContent = "🤖 ROVER SQUAD:";
                stat4.textContent = "7 Brave Rover Scouts";
            } else {
                if (subEl) subEl.textContent = "Earth's Night Light - Lunar Buggy Playground!";
                if (lbl1) lbl1.textContent = "🦘 JUMP POWER:";
                stat1.textContent = "6x Super Bouncy!";
                if (lbl2) lbl2.textContent = "❄️ WEATHER:";
                stat2.textContent = "Boiling Days & Freezing Nights";
                if (lbl3) lbl3.textContent = "🧑‍🚀 BREATHABLE AIR:";
                stat3.textContent = "Silent Vacuum (No Air)";
                if (lbl4) lbl4.textContent = "🤖 EXPLORER SQUAD:";
                stat4.textContent = "6 Moon Heroes";
            }
        } else if (this.userMode === 'teen') {
            if (this.currentPlanet === 'mars') {
                if (subEl) subEl.textContent = "The Red Planet - Pioneers of the Iron Plains (Certified GOATs)";
                if (lbl1) lbl1.textContent = "GRAVITY:";
                stat1.textContent = "3.72 m/s² (Moonwalk Flex)";
                if (lbl2) lbl2.textContent = "AVG TEMP:";
                stat2.textContent = "-63°C (Extreme Frostbite)";
                if (lbl3) lbl3.textContent = "ATMOSPHERE:";
                stat3.textContent = "95.3% CO₂ (No Oxygen fr)";
                if (lbl4) lbl4.textContent = "ARCHIVES:";
                stat4.textContent = "7 Robotic Legends";
            } else {
                if (subEl) subEl.textContent = "Earth's Celestial Companion - High Stakes Apollo Outposts";
                if (lbl1) lbl1.textContent = "GRAVITY:";
                stat1.textContent = "1.62 m/s² (1/6th G Flex)";
                if (lbl2) lbl2.textContent = "AVG TEMP:";
                stat2.textContent = "-130°C to +120°C (Wild Swing)";
                if (lbl3) lbl3.textContent = "ATMOSPHERE:";
                stat3.textContent = "Vacuum (Zero Air fr)";
                if (lbl4) lbl4.textContent = "ARCHIVES:";
                stat4.textContent = "6 Lunar Legends";
            }
        } else {
            // Adult Mode (Zero Gen Z terms, pure scientific and historical facts)
            if (this.currentPlanet === 'mars') {
                if (subEl) subEl.textContent = "Planetary Surface Archaeology - In-Situ Relics of the Martian Surface";
                if (lbl1) lbl1.textContent = "SURFACE GRAVITY:";
                stat1.textContent = "3.721 m/s² (0.379 g)";
                if (lbl2) lbl2.textContent = "MEAN TEMPERATURE:";
                stat2.textContent = "-63°C / 210 K (Diurnal: 140 K)";
                if (lbl3) lbl3.textContent = "ATMOSPHERIC COMP:";
                stat3.textContent = "95.3% CO₂, 2.6% N₂ (6.1 mbar)";
                if (lbl4) lbl4.textContent = "LOGGED ARTIFACTS:";
                stat4.textContent = "7 Validated Spacecraft (NSSDC/PDS)";
            } else {
                if (subEl) subEl.textContent = "Lunar Surface Relics & Long-Baseline Retroreflector Network";
                if (lbl1) lbl1.textContent = "SURFACE GRAVITY:";
                stat1.textContent = "1.620 m/s² (0.165 g)";
                if (lbl2) lbl2.textContent = "THERMAL RANGE:";
                stat2.textContent = "-173°C to +117°C (100 K–390 K)";
                if (lbl3) lbl3.textContent = "EXOSPHERE:";
                stat3.textContent = "<10⁵ particles/cm³ (High Vacuum)";
                if (lbl4) lbl4.textContent = "LOGGED ARTIFACTS:";
                stat4.textContent = "6 Validated Landing Sites";
            }
        }
    }

    setPlanet(planetId) {
        this.currentPlanet = planetId;
        const solarControls = document.getElementById('solar-sim-controls');

        // Update active button state
        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.planet === planetId);
        });

        if (planetId === 'solar_system') {
            this.planetaryScene.setViewMode('solar_system');
            if (solarControls) solarControls.style.display = 'flex';

            document.getElementById('current-planet-name').textContent = "EYES ON SOLAR SYSTEM";
            document.getElementById('planet-subtitle').textContent = "NASA Interplanetary Trajectory & Hohmann Transfer Cruise Telemetry";

            document.getElementById('label-stat-1').textContent = "EARTH-MARS DIST:";
            document.getElementById('planet-stat-gravity').textContent = "225.4M KM (1.51 AU)";

            document.getElementById('label-stat-2').textContent = "ONE-WAY LATENCY:";
            document.getElementById('planet-stat-temp').textContent = "12m 32s";

            document.getElementById('label-stat-3').textContent = "CRUISE STATUS:";
            document.getElementById('planet-stat-atmos').textContent = "InSight Transfer Arc";

            document.getElementById('label-stat-4').textContent = "SUN DISTANCE:";
            document.getElementById('planet-stat-relics').textContent = "1.0 AU (Earth) / 1.52 AU (Mars)";

            telemetryAudio.playBlip(1200, 0.08);
            return;
        }

        // Planetary Surface View (Mars or Moon)
        this.planetaryScene.setViewMode('planet');
        if (solarControls) solarControls.style.display = 'none';

        // Update HUD stats dynamically based on mode
        this.updatePlanetaryHUDStats();

        // Update route URL if not gate locked
        if (!document.body.classList.contains('gate-locked')) {
            this.updateRouteUrl(this.userMode, planetId);
        }

        // Update 3D scene
        this.planetaryScene.switchPlanet(planetId, EQUIPMENT_DATABASE);

        // Re-render side roster
        this.renderEquipmentRoster();

        telemetryAudio.playBlip(planetId === 'mars' ? 700 : 950);
    }

    setupPlanetButtons() {
        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planet = btn.dataset.planet;
                if (planet !== this.currentPlanet) {
                    this.setPlanet(planet);
                }
            });
        });

        // Setup Solar System Simulation Speed buttons
        document.querySelectorAll('.sim-speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sim-speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const speed = parseFloat(btn.dataset.speed);
                this.planetaryScene.simSpeed = speed;
                this.planetaryScene.isSimPaused = false;
                telemetryAudio.playBlip(1400, 0.03);
            });
        });

        const pauseBtn = document.getElementById('solar-pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.planetaryScene.isSimPaused = !this.planetaryScene.isSimPaused;
                pauseBtn.textContent = this.planetaryScene.isSimPaused ? '▶ RESUME' : '⏸ PAUSE';
                telemetryAudio.playBlip(800, 0.04);
            });
        }
    }

    renderEquipmentRoster(filter = 'all') {
        const list = document.getElementById('equipment-roster-list');
        if (!list) return;
        list.innerHTML = '';

        // Dynamic Mode Header & Search Input Placeholders
        const rosterHeading = document.getElementById('roster-heading');
        const rosterSearch = document.getElementById('roster-search-input');
        if (rosterHeading) {
            if (this.userMode === 'junior') {
                rosterHeading.textContent = '🎒 KIDS ROVER CLUB (<13)';
            } else if (this.userMode === 'teen') {
                rosterHeading.textContent = '⚡ TEEN MISSION CONTROL (13-18)';
            } else {
                rosterHeading.textContent = '🔬 SURFACE RELICS ARCHIVE (18+ COMPREHENSIVE RESEARCH)';
            }
        }
        if (rosterSearch) {
            if (this.userMode === 'junior') {
                rosterSearch.placeholder = '🔍 Search robot friend...';
            } else if (this.userMode === 'teen') {
                rosterSearch.placeholder = '🔍 Filter by vibe or rover...';
            } else {
                rosterSearch.placeholder = '🔍 Search hardware, mission, or landing site...';
            }
        }

        let artifacts = EQUIPMENT_DATABASE.filter(a => a.planet === this.currentPlanet);

        if (filter === 'rover') {
            artifacts = artifacts.filter(a => a.id.includes('mer') || a.id.includes('rover') || a.id.includes('lrv') || a.id.includes('sojourner') || a.id.includes('spirit') || a.id.includes('ingenuity'));
        } else if (filter === 'lander') {
            artifacts = artifacts.filter(a => a.id.includes('lander') || a.id.includes('viking') || a.id.includes('descent-stage') || a.id.includes('surveyor'));
        } else if (filter === 'science') {
            artifacts = artifacts.filter(a => a.id.includes('lrrr') || a.id.includes('alsep') || a.id.includes('debris'));
        }

        artifacts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'roster-card';
            card.dataset.id = item.id;

            // Generate concise category label
            let categoryLabel = 'HISTORIC RELIC';
            if (item.id.includes('lrv')) categoryLabel = 'LUNAR ROVER';
            else if (item.id.includes('ingenuity')) categoryLabel = 'MARS COPTER';
            else if (item.id.includes('opportunity') || item.id.includes('spirit') || item.id.includes('sojourner')) categoryLabel = 'MARS ROVER';
            else if (item.id.includes('lander') || item.id.includes('viking')) categoryLabel = 'MARS LANDER';
            else if (item.id.includes('descent-stage')) categoryLabel = 'MOON LANDER';
            else if (item.id.includes('lrrr')) categoryLabel = 'LASER MIRRORS';
            else if (item.id.includes('surveyor')) categoryLabel = 'LUNAR PROBE';

            const videoBtnHtml = item.videoPath ? `
                <button type="button" class="card-action-btn video-action-btn" data-action="video" data-id="${item.id}" title="Watch 4K Video Fly-Around">🎬 4K VIDEO</button>
            ` : '';

            const uncertaintyStr = item.coordinateMetadata ? `±${item.coordinateMetadata.uncertainty}` : 'N/A';

            if (this.userMode === 'junior') {
                const jokeText = item.storytelling && item.storytelling.juniorJoke ?
                    `Q: ${item.storytelling.juniorJoke.question.replace(/^Q:\s*/i, '')} A: ${item.storytelling.juniorJoke.punchline.replace(/^A:\s*/i, '')}` :
                    item.storytelling.tagline;
                card.innerHTML = `
                    <div class="roster-card-header">
                        <span class="roster-badge" style="background: #ec3750; color: #fff;">${categoryLabel}</span>
                        <span class="roster-coord" style="color: #33ff99; font-weight: 700;">🎒 CADET TARGET</span>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;">
                        <img src="${item.imagePath}" alt="${item.name}" class="roster-thumb-img" style="width: 58px; height: 58px; object-fit: cover; border-radius: 8px; border: 2px solid #ffde38; box-shadow: 2px 2px 0 rgba(0,0,0,0.5); flex-shrink: 0;">
                        <div style="flex: 1; min-width: 0;">
                            <div class="roster-card-title">${item.name}</div>
                            <div class="roster-card-loc">📍 ${item.locationName}</div>
                        </div>
                    </div>
                    <div class="roster-joke-bubble">⭐ <strong>CADET JOKE:</strong> ${jokeText}</div>
                    <div class="card-actions-row">
                        <button type="button" class="card-action-btn story-action-btn" data-action="story" data-id="${item.id}">📖 READ 3D COMIC</button>
                        <button type="button" class="card-action-btn toy-action-btn" data-action="specs" data-id="${item.id}">👀 3D TOY</button>
                        ${videoBtnHtml}
                    </div>
                `;
            } else if (this.userMode === 'teen') {
                const genZStatus = item.storytelling && item.storytelling.genZStatus ? item.storytelling.genZStatus : item.status.split('(')[0].trim();
                const genZTag = item.storytelling && item.storytelling.genZTagline ? item.storytelling.genZTagline : item.storytelling.tagline;
                card.innerHTML = `
                    <div class="roster-card-header">
                        <span class="roster-badge" style="background: #a855f7; color: #fff; font-weight: 800;">${categoryLabel}</span>
                        <span class="roster-coord" style="color: #c084fc; font-weight: 700;">${genZStatus}</span>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;">
                        <img src="${item.imagePath}" alt="${item.name}" class="roster-thumb-img" style="width: 58px; height: 58px; object-fit: cover; border-radius: 8px; border: 2px solid #a855f7; box-shadow: 2px 2px 0 rgba(168,85,247,0.3); flex-shrink: 0;">
                        <div style="flex: 1; min-width: 0;">
                            <div class="roster-card-title" style="color: #fff;">${item.name}</div>
                            <div class="roster-card-loc">📍 ${item.locationName}</div>
                        </div>
                    </div>
                    <div class="roster-tech-box" style="border-left-color: #a855f7; color: #e9d5ff;">⚡ VIBE: "${genZTag}"</div>
                    <div class="card-actions-row">
                        <button type="button" class="card-action-btn teen-specs-btn" data-action="specs" data-id="${item.id}">🔬 3D SPECS</button>
                        <button type="button" class="card-action-btn teen-vibe-btn" data-action="dossier" data-id="${item.id}">⚡ VIBE CHECK</button>
                        ${videoBtnHtml}
                    </div>
                `;
            } else {
                // Adult mode (Zero Gen Z terms, pure informational presentation)
                const adultTag = item.storytelling && item.storytelling.adultTagline ? item.storytelling.adultTagline : item.storytelling.tagline;
                card.innerHTML = `
                    <div class="roster-card-header">
                        <span class="roster-badge" style="background: #00e5ff; color: #000; font-weight: 800;">${categoryLabel}</span>
                        <span class="roster-coord">${item.status.split('(')[0].trim()}</span>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;">
                        <img src="${item.imagePath}" alt="${item.name}" class="roster-thumb-img" style="width: 58px; height: 58px; object-fit: cover; border-radius: 8px; border: 2px solid #00e5ff; box-shadow: 2px 2px 0 rgba(0,229,255,0.3); flex-shrink: 0;">
                        <div style="flex: 1; min-width: 0;">
                            <div class="roster-card-title" style="color: #fff;">${item.name}</div>
                            <div class="roster-card-loc">📍 ${item.locationName}</div>
                        </div>
                    </div>
                    <div class="roster-tech-box">📐 COORDS: ${item.coordinates.lat}°N, ${item.coordinates.lon}°E [Uncertainty: ${uncertaintyStr}]</div>
                    <div class="roster-card-tagline" style="margin-top: 6px; font-size: 0.78rem;">"${adultTag}"</div>
                    <div class="card-actions-row">
                        <button type="button" class="card-action-btn adult-specs-btn" data-action="specs" data-id="${item.id}">🔬 3D SPECS</button>
                        <button type="button" class="card-action-btn adult-dossier-btn" data-action="dossier" data-id="${item.id}">📜 MISSION DOSSIER</button>
                        ${videoBtnHtml}
                    </div>
                `;
            }

            card.addEventListener('mouseenter', () => {
                if (this.userMode === 'junior') {
                    telemetryAudio.playPopSound();
                } else {
                    telemetryAudio.playBlip(1200, 0.04);
                }
            });

            card.addEventListener('click', (e) => {
                const actionBtn = e.target.closest('.card-action-btn');
                const action = actionBtn ? actionBtn.dataset.action : (this.userMode === 'junior' ? 'story' : 'dossier');

                if (action === 'video') {
                    this.syncWithVideoTheater(item);
                    const theaterEl = document.getElementById('video-theater');
                    if (theaterEl) theaterEl.scrollIntoView({ behavior: 'smooth' });
                    if (this.userMode === 'junior') {
                        telemetryAudio.playRocketBoost();
                    } else {
                        telemetryAudio.playQuindarTone();
                    }
                    return;
                }

                if (action === 'story') {
                    if (this.storybook) this.storybook.openBook(item.id, 0);
                    telemetryAudio.playPowerUp();
                    telemetryAudio.speakCadetVoice(`Opening the story of ${item.name}!`);
                    return;
                }

                // In Teen or Adult mode, specs and dossier both show the Dossier modal
                this.showDossierForCraft(item.id);
                if (this.userMode === 'junior') {
                    telemetryAudio.playDoubleLaser();
                } else {
                    telemetryAudio.playBlip(1200, 0.05);
                }
            });

            list.appendChild(card);
        });
    }

    setupExplorerRankGate() {
        const btnKids = document.getElementById('tier-btn-kids');
        const btnTeen = document.getElementById('tier-btn-teen');
        const btnAdult = document.getElementById('tier-btn-adult');
        const navModeBtn = document.getElementById('nav-mode-btn');
        const ageInput = document.getElementById('age-input-field');
        const ageSubmit = document.getElementById('age-submit-btn');

        const selectTier = (chosenTier) => {
            const errorMsg = document.getElementById('gate-error-msg');
            if (errorMsg) errorMsg.style.display = 'none';

            // Explicit IF statement validating user input category before unlocking content
            if (chosenTier === 'junior' || chosenTier === 'kids') {
                // Kid Mode: kid-friendly UI, simple, not difficult, very easy
                document.body.classList.remove('gate-locked');
                this.setExplorerMode('junior', true, true);
                this.updateRouteUrl('kids', this.currentPlanet || 'mars');
                telemetryAudio.playKidsFanfare();
                telemetryAudio.playRocketBoost();
                telemetryAudio.playPowerUp();
            } else if (chosenTier === 'teen') {
                // Teen Mode: same layout as adult, loaded with Gen Z terms and vibe checks
                document.body.classList.remove('gate-locked');
                this.setExplorerMode('teen', true, true);
                this.updateRouteUrl('teen', this.currentPlanet || 'mars');
                telemetryAudio.playWarpSpeed();
                telemetryAudio.playQuindarTone();
            } else if (chosenTier === 'adult' || chosenTier === 'senior') {
                // Adult Mode: Gen Z terms removed, comprehensive, informational, easy to understand
                document.body.classList.remove('gate-locked');
                this.setExplorerMode('adult', true, true);
                this.updateRouteUrl('adult', this.currentPlanet || 'mars');
                telemetryAudio.playQuindarTone();
            } else {
                // If neither, keep gate locked and deny entry to content
                document.body.classList.add('gate-locked');
                if (errorMsg) {
                    errorMsg.textContent = '⚡ ACCESS DENIED: Please select your category (Kids, Teen, or Adult) to proceed!';
                    errorMsg.style.display = 'block';
                }
                return;
            }

            if (this.planetaryScene) {
                this.planetaryScene.handleResize();
            }

            // Smoothly move user into the content deck!
            const globeSection = document.getElementById('globe-section');
            if (globeSection) {
                setTimeout(() => {
                    globeSection.scrollIntoView({ behavior: 'smooth' });
                }, 150);
            }
        };

        if (btnKids) btnKids.addEventListener('click', () => selectTier('junior'));
        if (btnTeen) btnTeen.addEventListener('click', () => selectTier('teen'));
        if (btnAdult) btnAdult.addEventListener('click', () => selectTier('adult'));

        const handleAgeInput = () => {
            if (!ageInput) return;
            const val = parseInt(ageInput.value, 10);
            if (isNaN(val) || val <= 0) {
                const errorMsg = document.getElementById('gate-error-msg');
                if (errorMsg) {
                    errorMsg.textContent = '⚡ PLEASE ENTER A VALID AGE NUMBER TO UNLOCK!';
                    errorMsg.style.display = 'block';
                }
                return;
            }

            // If statement mapping numerical age input to proper category
            if (val < 13) {
                selectTier('junior');
            } else if (val <= 18) {
                selectTier('teen');
            } else {
                selectTier('adult');
            }
        };

        if (ageSubmit) ageSubmit.addEventListener('click', handleAgeInput);
        if (ageInput) ageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAgeInput();
        });

        // Cycle through modes via navbar button and update sub-route
        if (navModeBtn) {
            navModeBtn.addEventListener('click', () => {
                let nextMode = 'junior';
                if (this.userMode === 'junior') nextMode = 'teen';
                else if (this.userMode === 'teen') nextMode = 'adult';
                else nextMode = 'junior';

                document.body.classList.remove('gate-locked');
                this.setExplorerMode(nextMode, true, true);
                const modeSlug = nextMode === 'junior' ? 'kids' : (nextMode === 'teen' ? 'teen' : 'adult');
                this.updateRouteUrl(modeSlug, this.currentPlanet || 'mars');
            });
        }

        // Subpage URL routing listeners
        window.addEventListener('hashchange', () => this.applyRouteFromUrl());
        window.addEventListener('popstate', () => this.applyRouteFromUrl());

        // Guard top navbar links while gate-locked
        document.querySelectorAll('.nav-shortcut-link, .planet-btn, #nav-storybook-btn').forEach(el => {
            el.addEventListener('click', (e) => {
                if (document.body.classList.contains('gate-locked')) {
                    const href = el.getAttribute('href');
                    if (href && href.includes('welcome-gate-anchor')) return;

                    e.preventDefault();
                    const gate = document.getElementById('explorer-rank-gate');
                    if (gate) {
                        gate.scrollIntoView({ behavior: 'smooth' });
                        gate.classList.add('pulseHighlight');
                        setTimeout(() => gate.classList.remove('pulseHighlight'), 1200);
                    }
                    const errorMsg = document.getElementById('gate-error-msg');
                    if (errorMsg) {
                        errorMsg.textContent = '⚡ ACCESS RESTRICTED: Please select your category above to unlock the telemetry deck!';
                        errorMsg.style.display = 'block';
                    }
                    telemetryAudio.playBlip(300, 0.25);
                }
            });
        });

        // 20 Hilarious & Educational Space Jokes
        const cosmicJokes = [
            { q: "Why did the Opportunity rover love driving across Mars?", a: "Because there were no red traffic lights and no speed limits—only red dust! 😂✨" },
            { q: "What is an astronaut's favorite key on the keyboard?", a: "The Space bar! ⌨️🚀" },
            { q: "Why did the Moon need 100 mirrors from Apollo 11?", a: "To make sure it looked out of this world! 🪞🌕" },
            { q: "Why did Apollo 17 take duct tape to the Moon?", a: "Because duct tape has a light side, a dark side, and it binds the universe together! 🛠️🌌" },
            { q: "How do astronauts organize a party on Mars?", a: "They planet! 🪐🎉" },
            { q: "Why did Mickey Mouse go to space?", a: "To look for Pluto! 🐭⭐" },
            { q: "What kind of music do planets love to listen to?", a: "Nep-tunes! 🎵🪐" },
            { q: "Why was the rover computer cold on Mars?", a: "Because it left its Windows open! 💻❄️" },
            { q: "What do aliens put on their toast?", a: "Flying saucer-cream and space jam! 🛸🍞" },
            { q: "What is a robot's favorite type of dance?", a: "The Moonwalk! 🤖🕺" },
            { q: "Why did the sun go to school?", a: "To get brighter! ☀️🎓" },
            { q: "What do you call a tick that lives on the Moon?", a: "A luna-tick! 🌕🕷️" },
            { q: "Why did InSight listen to Mars' heartbeat?", a: "Because it wanted to know if Mars had rock-and-roll in its core! 🎸🌋" },
            { q: "What did Sojourner say to the rock on Mars?", a: "\"You rock, but I roll!\" 🪨🛞" },
            { q: "Why was Surveyor 6 the best hopper on the Moon?", a: "Because it knew how to stick the landing twice! 🦘🌙" },
            { q: "What is Mars' favorite candy bar?", a: "A Mars Bar, of course! 🍫🔴" },
            { q: "What did the Martian say to the rover?", a: "\"Take me to your battery charger!\" 🔋👽" },
            { q: "How does the Man in the Moon cut his hair?", a: "Eclipse it! ✂️🌑" },
            { q: "Why did the astronaut bring a pencil to space?", a: "Because pens run out of gravity! ✏️👨‍🚀" },
            { q: "Why couldn't the little star keep a secret?", a: "Because it was too twinkle-mouthed! ✨🤫" }
        ];

        let currentJokeIdx = 0;
        const questionEl = document.getElementById('joke-question');
        const punchlineEl = document.getElementById('joke-punchline');
        const revealBtn = document.getElementById('reveal-punchline-btn');
        const nextJokeBtn = document.getElementById('get-new-joke-btn');

        const displayJoke = (idx) => {
            const item = cosmicJokes[idx % cosmicJokes.length];
            if (questionEl) questionEl.textContent = `Q: ${item.q.replace(/^Q:\s*/i, '')}`;
            if (punchlineEl) {
                punchlineEl.textContent = `A: ${item.a.replace(/^A:\s*/i, '')}`;
                punchlineEl.style.display = 'none';
            }
            if (revealBtn) revealBtn.style.display = 'inline-block';
        };

        const speakJokeBtn = document.getElementById('speak-joke-btn');
        if (speakJokeBtn) {
            speakJokeBtn.addEventListener('click', () => {
                const item = cosmicJokes[currentJokeIdx % cosmicJokes.length];
                telemetryAudio.playRoboticGiggle();
                const qText = item.q.replace(/^Q:\s*/i, '');
                const aText = item.a.replace(/^A:\s*/i, '');
                telemetryAudio.speakCadetVoice(`${qText} ... ... ${aText}`);
            });
        }

        if (revealBtn && punchlineEl) {
            revealBtn.addEventListener('click', () => {
                revealBtn.style.display = 'none';
                punchlineEl.style.display = 'inline-block';
                telemetryAudio.playCartoonBoing();
                const item = cosmicJokes[currentJokeIdx % cosmicJokes.length];
                telemetryAudio.speakCadetVoice(item.a.replace(/^A:\s*/i, ''));
            });
        }

        if (nextJokeBtn) {
            nextJokeBtn.addEventListener('click', () => {
                currentJokeIdx++;
                displayJoke(currentJokeIdx);
                telemetryAudio.playRoboticGiggle();
                const item = cosmicJokes[currentJokeIdx % cosmicJokes.length];
                telemetryAudio.speakCadetVoice(item.q.replace(/^Q:\s*/i, ''));
            });
        }

        // Initialize active mode from URL route or lock gate
        const routeApplied = this.applyRouteFromUrl();
        if (!routeApplied) {
            // No category route provided:
            // Gate is LOCKED, start at the top, require category selection before moving into content!
            document.body.classList.add('gate-locked');
            this.setExplorerMode('teen', false, false);
            window.scrollTo(0, 0);
        }
    }

    setExplorerMode(mode, triggerRender = true, showToast = false) {
        if (mode === 'senior') mode = 'adult';
        this.userMode = mode;
        try {
            localStorage.setItem('nasa_explorer_mode', mode);
        } catch (e) {}

        // Update body class for site-wide styling
        document.body.classList.remove('mode-kids', 'mode-teen', 'mode-adult');
        if (mode === 'junior') {
            document.body.classList.add('mode-kids');
        } else if (mode === 'teen') {
            document.body.classList.add('mode-teen');
        } else {
            document.body.classList.add('mode-adult');
        }

        const navModeBtn = document.getElementById('nav-mode-btn');

        if (navModeBtn) {
            if (mode === 'junior') {
                navModeBtn.textContent = '🎒 KIDS (<13)';
                navModeBtn.style.color = '#ffde38';
                navModeBtn.style.borderColor = '#ffde38';
            } else if (mode === 'teen') {
                navModeBtn.textContent = '⚡ TEEN (13-18)';
                navModeBtn.style.color = '#c084fc';
                navModeBtn.style.borderColor = '#c084fc';
            } else {
                navModeBtn.textContent = '🔬 ADULT (18+)';
                navModeBtn.style.color = '#00e5ff';
                navModeBtn.style.borderColor = '#00e5ff';
            }
            navModeBtn.title = 'Click to switch explorer tier (Kids, Teen, or Adult)';
        }

        // Mode-specific Joke-o-Matic Title & Subtitle
        const jokeTitle = document.querySelector('.joke-box-title');
        const jokeSub = document.querySelector('.joke-box-subtitle');
        if (jokeTitle && jokeSub) {
            if (mode === 'junior') {
                jokeTitle.textContent = '🤖 COSMIC JOKE-O-MATIC 3000';
                jokeTitle.style.color = '#ffde38';
                jokeSub.textContent = 'Free space giggles powered by Martian solar panels!';
            } else if (mode === 'teen') {
                jokeTitle.textContent = '⚡ COSMIC WIT & SPACE BANTER';
                jokeTitle.style.color = '#c084fc';
                jokeSub.textContent = 'High-voltage interplanetary banter & rover roasts.';
            } else {
                jokeTitle.textContent = '📜 HISTORICAL ASTRONAUTICAL WIT & ANECDOTES';
                jokeTitle.style.color = '#00e5ff';
                jokeSub.textContent = 'Documented quips & humorous milestones from Apollo and robotic flight logs.';
            }
        }

        // Update planetary HUD stats for new mode
        this.updatePlanetaryHUDStats();

        if (showToast) {
            this.showModeNotification(mode);
        }

        if (triggerRender) {
            this.renderEquipmentRoster();
        }

        if (this.chatbot && typeof this.chatbot.updateChipsForMode === 'function') {
            this.chatbot.updateChipsForMode(mode);
        }
    }

    showModeNotification(mode) {
        const toast = document.getElementById('mode-hud-notification');
        const tag = document.getElementById('toast-tag');
        const title = document.getElementById('toast-title');
        const desc = document.getElementById('toast-desc');
        const closeBtn = document.getElementById('toast-close-btn');

        if (!toast || !tag || !title || !desc) return;

        if (this.toastTimer) clearTimeout(this.toastTimer);

        if (mode === 'teen') {
            toast.className = 'hud-toast-notification visible teen-notification';
            tag.textContent = '⚡ LEVEL 02 CLEARANCE // MISSION SPECIALIST';
            title.textContent = '⚡ TEEN MISSION CONTROL ENGAGED!';
            desc.textContent = 'Gen Z Vibe Check, 3D Orbits, Unfiltered Rover Lore & Receipts unlocked. No cap!';
            telemetryAudio.playQuindarTone();
        } else if (mode === 'junior') {
            toast.className = 'hud-toast-notification visible kids-notification';
            tag.textContent = '★ LEVEL 01 CLEARANCE // CADET EXPLORER ★';
            title.textContent = '🎒 KIDS CLUBHOUSE ACTIVATED!';
            desc.textContent = '3D Illustrated Adventure Books, Mars Rover cartoons, and Cosmic Jokes unlocked!';
            telemetryAudio.playKidsFanfare();
            telemetryAudio.speakCadetVoice("Welcome to Echoes of the Orbit! Click on any spacecraft to explore its story and 3D model.");
        } else {
            toast.className = 'hud-toast-notification visible adult-notification';
            tag.textContent = '🔬 LEVEL 03 CLEARANCE // SENIOR RESEARCHER';
            title.textContent = '🔬 RESEARCH ARCHIVES ENGAGED';
            desc.textContent = 'Sub-meter LROC/HiRISE geodetic datums, flight dynamics & peer-reviewed telemetry stream unlocked.';
            telemetryAudio.playQuindarTone();
        }

        if (closeBtn) {
            closeBtn.onclick = () => {
                toast.classList.remove('visible');
            };
        }

        this.toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, 4500);
    }

    setupRosterList() {
        const searchInput = document.getElementById('roster-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                document.querySelectorAll('.roster-card').forEach(card => {
                    const match = card.textContent.toLowerCase().includes(query);
                    card.style.display = match ? 'block' : 'none';
                });
            });
        }

        const filterBtn = document.getElementById('catalog-filter-btn');
        if (filterBtn) {
            const filters = [
                { id: 'all', label: 'CATALOG: ALL' },
                { id: 'rover', label: 'CATALOG: ROVERS' },
                { id: 'lander', label: 'CATALOG: LANDERS' },
                { id: 'science', label: 'CATALOG: SCIENCE' }
            ];
            let currentFilterIdx = 0;

            filterBtn.addEventListener('click', () => {
                currentFilterIdx = (currentFilterIdx + 1) % filters.length;
                const f = filters[currentFilterIdx];
                filterBtn.textContent = f.label;
                this.renderEquipmentRoster(f.id);
                telemetryAudio.playBlip(1100, 0.04);
            });
        }
    }

    setupAudioControls() {
        const muteBtn = document.getElementById('audio-toggle-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                this.isAudioMuted = telemetryAudio.toggleMute();
                muteBtn.classList.toggle('muted', this.isAudioMuted);
                muteBtn.innerHTML = this.isAudioMuted ?
                    '🔇 AUDIO: MUTED' :
                    '🔊 AUDIO: ACTIVE TELEMETRY';
            });
        }

        // Initialize audio on first user click anywhere
        const startAudio = () => {
            telemetryAudio.ensureContext();
            telemetryAudio.startCosmicRadio();
            window.removeEventListener('click', startAudio);
        };
        window.addEventListener('click', startAudio);
    }

    openArtifactDossier(artifact, forceDossier = false) {
        if (!artifact) return;

        // If age gate is locked, block opening and guide user to select explorer category
        if (document.body.classList.contains('gate-locked')) {
            const gate = document.getElementById('explorer-rank-gate');
            if (gate) {
                gate.scrollIntoView({ behavior: 'smooth' });
                gate.classList.add('pulseHighlight');
                setTimeout(() => gate.classList.remove('pulseHighlight'), 1200);
            }
            const errorMsg = document.getElementById('gate-error-msg');
            if (errorMsg) {
                errorMsg.textContent = '⚡ ACCESS DENIED: Please select your category (Kids, Teen, or Adult) to unlock dossiers & storybooks!';
                errorMsg.style.display = 'block';
            }
            telemetryAudio.playBlip(300, 0.25);
            return;
        }

        this.selectedArtifact = artifact;
        telemetryAudio.playLastTransmissionSequence(artifact.audioTelemetryType);

        // 1. Sync and launch video in the 4K Video Theater
        this.syncWithVideoTheater(artifact);

        // 2. Open view matching active age tier (Junior = 3D Comic Storybook, Teen = Gen Z Dossier, Adult = Scientific Dossier)
        if (forceDossier || this.userMode === 'teen' || this.userMode === 'adult') {
            this.showDossierForCraft(artifact.id);
        } else {
            // Junior / Kids mode -> Open 3D Illustrated Adventure Storybook
            if (this.storybook) {
                this.storybook.openBook(artifact.id, 0);
            }
        }
    }

    syncWithVideoTheater(artifact) {
        if (!artifact || !artifact.videoPath) return;
        const videoElement = document.getElementById('theater-main-video');
        const craftName = document.getElementById('theater-craft-name');
        const craftLoc = document.getElementById('theater-craft-loc');
        const craftQuote = document.getElementById('theater-craft-quote');
        const playToggle = document.getElementById('theater-play-toggle');

        if (videoElement) {
            videoElement.style.opacity = '0.3';
            setTimeout(() => {
                videoElement.src = artifact.videoPath;
                videoElement.load();
                videoElement.play().catch(() => { });
                videoElement.style.opacity = '1';
                if (playToggle) playToggle.textContent = '⏸ PAUSE';
            }, 150);
        }

        if (craftName) craftName.textContent = artifact.name.toUpperCase();
        if (craftLoc) craftLoc.textContent = `📍 ${artifact.locationName}`;
        if (craftQuote) craftQuote.textContent = `"${artifact.lastTransmissionMessage.quote}"`;

        document.querySelectorAll('.theater-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.video === artifact.videoPath);
        });
    }

    showDossierForCraft(craftId) {
        const artifact = EQUIPMENT_DATABASE.find(a => a.id === craftId) || this.selectedArtifact;
        if (!artifact) return;
        this.selectedArtifact = artifact;

        if (this.storybook) {
            this.storybook.closeBook();
        }

        const modal = document.getElementById('artifact-dossier-modal');
        modal.classList.add('open');

        // Populate header
        document.getElementById('dossier-name').textContent = artifact.name;
        document.getElementById('dossier-designation').textContent = artifact.designation;
        document.getElementById('dossier-status-pill').textContent = artifact.status;

        const photoEl = document.getElementById('dossier-rover-photo');
        if (photoEl) {
            if (artifact.imagePath) {
                photoEl.src = artifact.imagePath;
                photoEl.style.display = 'block';
            } else {
                photoEl.style.display = 'none';
            }
        }

        // Set Hero Vehicle Image stage (never blank!)
        const heroPhoto = document.getElementById('dossier-hero-vehicle-img');
        const photoStage = document.getElementById('vehicle-photo-stage');
        const photoTag = document.getElementById('photo-overlay-tag');
        const canvas3d = document.getElementById('model-viewer-canvas');
        const videoPlayer = document.getElementById('hologram-video-player');
        const photoBtn = document.getElementById('view-photo-mode-btn');
        const modelBtn = document.getElementById('toggle-3d-view-btn');
        const videoBtn = document.getElementById('toggle-video-view-btn');
        const wireBtn = document.getElementById('toggle-wireframe-btn');
        const resetBtn = document.getElementById('reset-3d-btn');

        if (heroPhoto && photoStage) {
            heroPhoto.src = artifact.imagePath || 'assets/renders/opportunity.png';
            photoStage.style.display = 'flex';
            if (canvas3d) canvas3d.style.display = 'none';
            if (videoPlayer) {
                videoPlayer.style.display = 'none';
                videoPlayer.pause();
            }
            if (photoBtn) photoBtn.classList.add('active');
            if (modelBtn) modelBtn.classList.remove('active');
            if (videoBtn) videoBtn.classList.remove('active');
            if (wireBtn) wireBtn.style.display = 'none';
            if (resetBtn) resetBtn.style.display = 'none';
        }

        if (photoTag) {
            photoTag.textContent = `📷 NASA ARCHIVAL PHOTOGRAPH // ${artifact.name.toUpperCase()}`;
        }

        const locUncertainty = artifact.coordinateMetadata ? ` [Uncertainty: ${artifact.coordinateMetadata.uncertainty}]` : '';
        document.getElementById('dossier-location').textContent = `${artifact.locationName} (${artifact.coordinates.lat}°, ${artifact.coordinates.lon}°)${locUncertainty}`;
        document.getElementById('dossier-lifespan').textContent = artifact.operationalLifespan;
        document.getElementById('dossier-dist').textContent = artifact.totalDistance;
        document.getElementById('dossier-nssdc-link').href = `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${artifact.nasaNssdcId}`;
        document.getElementById('dossier-trek-link').href = artifact.nasaTrekUrl;

        // Populate Adult / Teen Research Technical Specs (Enriched with Interactive ⓘ Jargon Explainer)
        const datumEl = document.getElementById('dossier-datum-val');
        const reconEl = document.getElementById('dossier-recon-sat');
        const powerEl = document.getElementById('dossier-power-arch');
        const citationEl = document.getElementById('dossier-citation-val');

        if (datumEl) {
            const rawDatum = artifact.coordinateMetadata ?
                `${artifact.coordinateMetadata.datum} (${artifact.coordinateMetadata.convention})` :
                (artifact.planet === 'mars' ? 'IAU 2000 Mars Planetocentric' : 'Mean Earth/Polar Axis (ME)');
            datumEl.innerHTML = this.enrichGlossaryKeywords(rawDatum);
        }

        if (reconEl) {
            const rawRecon = artifact.planet === 'mars' ?
                'MRO HiRISE (25 cm/pixel resolution) + CTX Global Mosaic' :
                'Lunar Reconnaissance Orbiter Camera (LROC NAC 0.5 m/pixel)';
            reconEl.innerHTML = this.enrichGlossaryKeywords(rawRecon);
        }

        if (powerEl) {
            let powerArch = 'Radioisotope Thermoelectric Generator (RTG) + Secondary Cells';
            if (artifact.id.includes('mer') || artifact.id.includes('sojourner') || artifact.id.includes('insight')) {
                powerArch = 'Multi-junction GaAs Solar Arrays (Triple-junction) + Li-Ion Batteries';
            } else if (artifact.id.includes('lrv')) {
                powerArch = 'Non-rechargeable Silver-Zinc KOH Batteries (36V, 121 Ah)';
            }
            powerEl.innerHTML = this.enrichGlossaryKeywords(powerArch);
        }

        if (citationEl) {
            let citText = 'NASA Planetary Data System (PDS) Geosciences Node Archive';
            if (artifact.id.includes('opportunity')) citText = 'Squyres, S. W., et al. (2004). The Opportunity Rover\'s Athena Science Payload. Science, 306(5702).';
            else if (artifact.id.includes('insight')) citText = 'Banerdt, W. B., et al. (2020). Initial results from the InSight mission on Mars. Nature Geoscience, 13.';
            else if (artifact.id.includes('apollo')) citText = 'Apollo 11 Preliminary Science Report, NASA SP-214 (1969) / LROC Science Team (2012).';
            else if (artifact.id.includes('ingenuity')) citText = 'Balaram, J., et al. (2021). Mars Helicopter Technology Demonstrator. AIAA Scitech 2021 Forum.';
            citationEl.innerHTML = this.enrichGlossaryKeywords(citText);
        }

        const obsEl = document.getElementById('dossier-observation-id');
        const avEl = document.getElementById('dossier-avionics-val');
        const payEl = document.getElementById('dossier-payload-val');
        const commsEl = document.getElementById('dossier-comms-val');

        if (obsEl) {
            let obsText = 'MRO Context Camera (CTX) Global Map';
            if (artifact.id.includes('opportunity')) obsText = 'HiRISE ESP_013954_1780 (Endeavour Crater)';
            else if (artifact.id.includes('insight')) obsText = 'HiRISE ESP_057939_1845 & ESP_077478_1845 (Elysium)';
            else if (artifact.id.includes('ingenuity')) obsText = 'HiRISE ESP_068285_1985 & Mastcam-Z Sol 1040';
            else if (artifact.id.includes('sojourner')) obsText = 'HiRISE PSP_001890_1995 (Ares Vallis / Sagan Memorial)';
            else if (artifact.id.includes('viking')) obsText = 'HiRISE PSP_001521_2025 (Chryse Planitia Mutch Station)';
            else if (artifact.id.includes('spirit')) obsText = 'HiRISE PSP_001513_1655 (Gusev Crater / Columbia Memorial)';
            else if (artifact.id.includes('apollo-11')) obsText = 'LROC NAC M175124479RE (Tranquility Base, 0.50 m/px)';
            else if (artifact.id.includes('apollo-15')) obsText = 'LROC NAC M111578606RE (Hadley Rille Station)';
            else if (artifact.id.includes('apollo-17')) obsText = 'LROC NAC M175252641RE (Taurus-Littrow Valley)';
            else if (artifact.id.includes('surveyor-3')) obsText = 'LROC NAC M104662862RE (Ocean of Storms / Apollo 12)';
            else if (artifact.id.includes('surveyor-6')) obsText = 'LROC NAC M117466810LE (Sinus Medii)';
            obsEl.innerHTML = this.enrichGlossaryKeywords(obsText);
        }

        if (avEl) {
            let avText = 'NASA Solid-State Sequencer & Microcontroller Subsystem';
            if (artifact.id.includes('mer') || artifact.id.includes('opportunity') || artifact.id.includes('spirit')) {
                avText = 'BAE RAD6000 32-bit RISC @ 20 MHz (128 MB RAM, VxWorks RTOS)';
            } else if (artifact.id.includes('insight')) {
                avText = 'Dual BAE RAD750 32-bit PowerPC @ 133 MHz (512 MB DRAM, 2GB Flash)';
            } else if (artifact.id.includes('ingenuity')) {
                avText = 'Qualcomm Snapdragon 801 quad-core @ 2.26 GHz (Linux OS) + 2x SAM5D37';
            } else if (artifact.id.includes('sojourner')) {
                avText = 'Intel 80C85 8-bit CPU @ 2 MHz (512 KB RAM, 176 KB Flash)';
            } else if (artifact.id.includes('viking')) {
                avText = 'Dual Redundant Honeywell Computers (2x 4,096-word plated-wire memory)';
            } else if (artifact.id.includes('apollo-11-descent') || artifact.id.includes('apollo-11-lrrr')) {
                avText = 'Apollo Guidance Computer (AGC) Block II @ 2.048 MHz (36K word ROM)';
            } else if (artifact.id.includes('lrv')) {
                avText = 'Delco Directional Gyro Inertial Navigation & Odometer Subsystem';
            } else if (artifact.id.includes('surveyor')) {
                avText = 'Solid-State Analogue/Digital Radar Altimeter Doppler Guidance (RADVS)';
            }
            avEl.innerHTML = this.enrichGlossaryKeywords(avText);
        }

        if (payEl) {
            let payText = 'Scientific Sensors & Engineering Diagnostic Instrumentation';
            if (artifact.id.includes('opportunity') || artifact.id.includes('spirit')) {
                payText = 'Pancam, Microscopic Imager, APXS, Mössbauer Spectrometer, Mini-TES';
            } else if (artifact.id.includes('insight')) {
                payText = 'SEIS VBB Seismometer, HP3 Heat Flow Mole, RISE Doppler, TWINS Weather';
            } else if (artifact.id.includes('ingenuity')) {
                payText = '13-MP Sony IMX214 Terrain Cam, Omnivision B&W Navcam, Garmin LIDAR';
            } else if (artifact.id.includes('sojourner')) {
                payText = 'Alpha Proton X-ray Spectrometer (APXS), Stereo Front Monochrome CCDs';
            } else if (artifact.id.includes('viking')) {
                payText = 'GCMS, Biology Package (PR/LR/GEX), Facsimile Cameras, XRF, Weather';
            } else if (artifact.id.includes('apollo-11-lrrr')) {
                payText = '100 Quartz Corner-Cube Retroreflectors (Zero Power Passive Array)';
            } else if (artifact.id.includes('apollo-11-descent')) {
                payText = 'Descent Propulsion System (DPS), Landing Radar, TV Telemetry Link';
            } else if (artifact.id.includes('lrv')) {
                payText = 'Ground-Commanded Color TV Assembly (GCTA), 16mm DAC, LCRU Antenna';
            } else if (artifact.id.includes('surveyor')) {
                payText = 'Vidicon Slow-Scan TV Camera, Surface Sampler Scoop, Alpha-Scatterer';
            }
            payEl.innerHTML = this.enrichGlossaryKeywords(payText);
        }

        if (commsEl) {
            let commsText = 'NASA Deep Space Network (DSN) Transceiver';
            if (artifact.planet === 'mars') {
                commsText = 'Direct-to-Earth X-Band (7-8 GHz) + UHF Relay to MRO/Odyssey (400 MHz)';
            } else {
                commsText = 'Unified S-Band (USB) 2287.5 MHz (Goldstone, Honeysuckle Creek, Madrid)';
            }
            commsEl.innerHTML = this.enrichGlossaryKeywords(commsText);
        }

        // Render Storytelling based on active Explorer Tier (Junior, Teen, Adult)
        const taglineEl = document.getElementById('dossier-tagline');
        const narrativeEl = document.getElementById('dossier-perspective-narrative');
        const whyMattersEl = document.getElementById('dossier-why-matters');
        const statusEl = document.getElementById('dossier-status-pill');
        const storybookBtn = document.getElementById('dossier-open-storybook-btn');

        if (this.userMode === 'teen') {
            if (statusEl) {
                statusEl.textContent = artifact.storytelling.genZStatus || artifact.status;
                statusEl.style.background = 'rgba(168, 85, 247, 0.25)';
                statusEl.style.borderColor = '#a855f7';
                statusEl.style.color = '#e9d5ff';
            }
            if (taglineEl) taglineEl.textContent = `"${artifact.storytelling.genZTagline || artifact.storytelling.tagline}"`;
            if (narrativeEl) narrativeEl.textContent = artifact.storytelling.genZNarrative || artifact.storytelling.perspectiveNarrative;
            if (whyMattersEl) whyMattersEl.textContent = artifact.storytelling.genZWhyMatters || artifact.storytelling.whyItMatters;

            const narrativeLabel = document.querySelector('.dossier-column-right .story-section:nth-child(1) .section-label');
            if (narrativeLabel) narrativeLabel.textContent = '⚡ THE MACHINE SPEAKS // GEN Z VIBE CHECK 📡';

            const achLabel = document.querySelector('.dossier-column-right .story-section:nth-child(2) .section-label');
            if (achLabel) achLabel.textContent = '🏆 MAIN CHARACTER MOMENTS & FLEXES 🛸';

            const specsLabel = document.querySelector('.dossier-column-right .story-section:nth-child(3) .section-label');
            if (specsLabel) specsLabel.textContent = '⚙️ STATS, SPECS & RECEIPTS 📊';

            if (storybookBtn) storybookBtn.style.display = 'none';
        } else if (this.userMode === 'junior') {
            if (statusEl) {
                statusEl.textContent = 'Active in Cadet Memory ★';
                statusEl.style.background = 'rgba(255, 170, 0, 0.25)';
                statusEl.style.borderColor = '#ffaa00';
                statusEl.style.color = '#ffdd59';
            }
            if (taglineEl) taglineEl.textContent = `"${artifact.storytelling.tagline}"`;
            if (narrativeEl) narrativeEl.textContent = artifact.storytelling.juniorSummary || artifact.storytelling.perspectiveNarrative;

            let whyMattersText = artifact.storytelling.whyItMatters;
            if (artifact.storytelling.juniorJoke) {
                whyMattersText += `\n\n⭐ CADET MISSION JOKE:\nQ: ${artifact.storytelling.juniorJoke.question}\nA: ${artifact.storytelling.juniorJoke.punchline}`;
            }
            if (whyMattersEl) whyMattersEl.textContent = whyMattersText;

            const narrativeLabel = document.querySelector('.dossier-column-right .story-section:nth-child(1) .section-label');
            if (narrativeLabel) narrativeLabel.textContent = '🎒 ROVER SECRET DIARY & COMIC TALE';

            const achLabel = document.querySelector('.dossier-column-right .story-section:nth-child(2) .section-label');
            if (achLabel) achLabel.textContent = '🏆 HERO ACHIEVEMENTS';

            const specsLabel = document.querySelector('.dossier-column-right .story-section:nth-child(3) .section-label');
            if (specsLabel) specsLabel.textContent = '⚙️ ROBOT TOY SPECS';

            if (storybookBtn) {
                storybookBtn.style.display = 'inline-block';
                storybookBtn.textContent = '📖 OPEN 3D COMIC';
            }
        } else {
            // Adult mode: Zero Gen Z terms, pure informational presentation, easy to understand
            if (statusEl) {
                statusEl.textContent = artifact.status;
                statusEl.style.background = 'rgba(0, 229, 255, 0.2)';
                statusEl.style.borderColor = '#00e5ff';
                statusEl.style.color = '#00e5ff';
            }
            if (taglineEl) taglineEl.textContent = `"${artifact.storytelling.adultTagline || artifact.storytelling.tagline}"`;
            if (narrativeEl) narrativeEl.textContent = artifact.storytelling.adultNarrative || artifact.storytelling.perspectiveNarrative;
            
            let adultWhy = artifact.storytelling.adultWhyMatters || artifact.storytelling.whyItMatters;
            if (artifact.storytelling.adultConclusion) {
                adultWhy += `\n\n🔬 HISTORICAL CONCLUSION & SCIENTIFIC HERITAGE:\n${artifact.storytelling.adultConclusion}`;
            }
            if (whyMattersEl) whyMattersEl.textContent = adultWhy;

            const narrativeLabel = document.querySelector('.dossier-column-right .story-section:nth-child(1) .section-label');
            if (narrativeLabel) narrativeLabel.textContent = '📜 HISTORICAL EMBODIED NARRATIVE';

            const achLabel = document.querySelector('.dossier-column-right .story-section:nth-child(2) .section-label');
            if (achLabel) achLabel.textContent = '🏆 PRIMARY SCIENTIFIC CONTRIBUTIONS & ENGINEERING DISCOVERIES';

            const specsLabel = document.querySelector('.dossier-column-right .story-section:nth-child(3) .section-label');
            if (specsLabel) specsLabel.textContent = '⚙️ TECHNICAL INSTRUMENTATION & TELEMETRY SPECS';

            if (storybookBtn) storybookBtn.style.display = 'none';
        }

        // Achievements / Scientific Contributions List
        const achList = document.getElementById('dossier-achievements');
        achList.innerHTML = '';
        const contributions = artifact.scientificContributions || (artifact.storytelling && artifact.storytelling.keyAchievements) || [];
        contributions.forEach(ach => {
            const li = document.createElement('li');
            li.textContent = ach;
            achList.appendChild(li);
        });

        // Populate Cosmic Fun Facts & Mission Wit / Adult Scientific Milestones
        const triviaBox = document.getElementById('dossier-trivia-box');
        if (triviaBox) {
            if (this.userMode === 'adult') {
                // Adult mode: Key Historical & Scientific Milestones (Zero jokes)
                const adultNotesMap = {
                    'mer-b-opportunity': "🏃 <strong>ENDURANCE BENCHMARK:</strong> Over 14 years and 5,111 Martian sols, Opportunity traversed 45.16 km across Meridiani Planum, discovering hematite spherules ('blueberries') that provided the first definitive in-situ evidence of ancient liquid groundwater on Mars.",
                    'mer-a-spirit': "🔬 <strong>HYDROTHERMAL DISCOVERY:</strong> While operating with a jammed right-front drive actuator, Spirit churned subsurface deposits containing 90% pure opaline silica at Home Plate in Gusev Crater, confirming ancient volcanic fumaroles or hot springs conducive to microbial habitability.",
                    'insight-lander': "🌋 <strong>GEOPHYSICAL ARCHITECTURE:</strong> Operating the ultra-sensitive SEIS instrument under a vacuum Wind and Thermal Shield, InSight recorded 1,318 seismic events, delineating Mars' core radius at ~1,830 km and characterizing crustal thickness between 24 and 72 km.",
                    'ingenuity-helicopter': "✈️ <strong>ROTORCRAFT AERODYNAMICS:</strong> Proved aerodynamic flight in a carbon dioxide atmosphere at <1% Earth surface pressure across 72 successful flights, achieving 128.8 flight minutes and serving as an aerial scout for Perseverance.",
                    'sojourner-pathfinder': "🛹 <strong>SURFACE MOBILITY PROOF-OF-CONCEPT:</strong> Deployed via the Sagan Memorial Station, Sojourner demonstrated autonomous hazard avoidance and APXS elemental spectrometry, validating microrover deployment architectures for all subsequent missions.",
                    'viking-1-lander': "⚛️ <strong>RADIOISOTOPE SURFACE STATION:</strong> Transmitted the first color surface panorama from Chryse Planitia on July 20, 1976. Conducted GCMS pyrolytic organic analysis and continuous atmospheric pressure logging spanning 3.2 Martian years.",
                    'apollo-11-descent-stage': "🌕 <strong>HISTORIC DESCENT ARCHITECTURE:</strong> Executed throttled descent propulsion to Tranquility Base with ~25 seconds of remaining propellant margin. Served as the launch platform for the Ascent Stage and anchors the first human extraterrestrial landing site.",
                    'apollo-11-lrrr': "🪞 <strong>LASER RANGING RETROREFLECTOR:</strong> Consisting of 100 fused silica corner cubes, LRRR remains operational after 55+ years with zero power consumption, measuring lunar orbital recession at 3.8 cm/year and testing General Relativity.",
                    'apollo-15-lrv': "🏎️ <strong>MOBILITY MULTIPLIER:</strong> Traversed 27.76 km across Hadley-Apennine using woven steel wire tires and silver-zinc chemistry, enabling collection of the iconic 'Genesis Rock' (anorthosite sample 15415, 4.1 billion years old).",
                    'apollo-17-lrv-alsep': "🛠️ <strong>EXTENDED FIELD RADIUS:</strong> Driven 35.89 km in Taurus-Littrow. Enabled Apollo 17 astronauts to discover orange volcanic glass soil at Shorty Crater, revealing 3.6-billion-year-old lunar pyroclastic eruptions.",
                    'surveyor-3': "🚀 <strong>INTER-MISSION ARCHAEOLOGICAL RECOVERY:</strong> Landed in Oceanus Procellarum on April 20, 1967. Visited 31 months later by Apollo 12, allowing the return of its TV camera housing to Earth to analyze long-term space vacuum and radiation exposure.",
                    'surveyor-6': "🦘 <strong>OFF-WORLD PROPULSION RE-IGNITION:</strong> On Nov 17, 1967, performed a 2.5-second vernier engine restart, ascending 3 meters and translating 2.5 meters across Sinus Medii to validate lunar liftoff dynamics for the Apollo Ascent Stage."
                };
                const adultNote = adultNotesMap[artifact.id] || `🔬 <strong>PRIMARY SCIENTIFIC ARCHIVE:</strong> ${artifact.storytelling.adultWhyMatters || artifact.storytelling.whyItMatters}`;
                triviaBox.innerHTML = `
                    <div class="trivia-fact-box" style="border-left: 3px solid #00e5ff; color: #e2e8f0; background: rgba(0, 229, 255, 0.08);">${adultNote}</div>
                `;
            } else {
                const triviaMap = {
                    'mer-b-opportunity': {
                        fact: "🏃 <strong>OLYMPIC MARATHON ON MARS:</strong> On March 24, 2015, Opportunity completed 42.195 km (26.219 miles)—running the first official marathon on an extraterrestrial body! NASA named the finish point 'Marathon Valley'.",
                        joke: "Q: Why was Opportunity always invited to the Martian clubhouse?<br>A: <em>Because it bounced across the plains inside giant airbags and scored a hole-in-one right into Eagle Crater! 🕳️⛳</em>"
                    },
                    'mer-a-spirit': {
                        fact: "🛠️ <strong>ACCIDENTAL PURE SILICA:</strong> In 2006, Spirit's front-right wheel motor locked. Controllers commanded it to drive backwards, dragging the dead wheel. The wheel carved open a trench revealing 90% pure silica—proving Mars once hosted boiling geothermal hot springs!",
                        joke: "Q: Why did Spirit always drive in reverse?<br>A: <em>To keep an eye on her rear-view mirror and marvel at her historic tracks! 🛞👀</em>"
                    },
                    'insight-lander': {
                        fact: "🌋 <strong>MARS HAS AN ACTIVE HEART:</strong> InSight recorded 1,318 extraterrestrial marsquakes! Monster quake S1222a was magnitude 4.7, sending seismic waves around the entire planet that mapped out Mars' molten liquid core.",
                        joke: "Q: What kind of music does the Red Planet love?<br>A: <em>Heavy rock and marsquake roll! 🎸🌋</em>"
                    },
                    'ingenuity-helicopter': {
                        fact: "✈️ <strong>WRIGHT BROTHERS HERITAGE:</strong> Taped beneath Ingenuity's solar panel was a 1.3 cm swatch of wing fabric from the 1903 Wright Flyer, connecting Kitty Hawk 1903 to alien skies in 2021!",
                        joke: "Q: Why did Ginny spin her rotors at 2,400 RPM?<br>A: <em>Because Martian air is 99% thinner than Earth's, you have to whip it like heavy cream just to get off the ground! 🚁💨</em>"
                    },
                    'sojourner-pathfinder': {
                        fact: "🛹 <strong>THE 23-POUND SKATEBOARD:</strong> Sojourner weighed only 23 lbs on Earth (9 lbs in Mars gravity) and was the size of a microwave oven! Its 8-bit Intel 80C85 computer had only 512 KB RAM—yet it kicked off the robotic rover era.",
                        joke: "Q: What did Sojourner say to the rock on Mars?<br>A: <em>'You rock, but I roll!' 🪨🛞</em>"
                    },
                    'viking-1-lander': {
                        fact: "⚛️ <strong>ATOMIC SURVIVOR:</strong> Powered by twin SNAP-19 plutonium radioisotope generators, Viking 1 survived 6 Earth years (2,245 sols) on the freezing Plains of Gold, logging daily Martian meteorology and surface images.",
                        joke: "Q: Why did Viking 1 never complain about the -120°C Martian winter?<br>A: <em>Because it had atomic nuclear warmth in its belly! ⚛️❄️</em>"
                    },
                    'apollo-11-descent-stage': {
                        fact: "🌕 <strong>25 SECONDS TO TOUCHDOWN:</strong> When Neil Armstrong steered the Lunar Module 'Eagle' past boulder-filled West Crater to set down at Tranquility Base, only ~25 seconds of descent engine fuel remained!",
                        joke: "Q: What was Neil Armstrong's favorite computer key?<br>A: <em>The Space Bar! ⌨️🧑‍🚀</em>"
                    },
                    'apollo-11-lrrr': {
                        fact: "🪞 <strong>55 YEARS CONTINUOUS RUN:</strong> Consuming zero electricity and with zero moving parts, LRRR is still hit weekly by pulsed lasers from observatories in Texas and France, proving the Moon is spiraling outward by 3.8 cm per year!",
                        joke: "Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>A: <em>So the Moon could always reflect on human courage! 🪞✨</em>"
                    },
                    'apollo-15-lrv': {
                        fact: "🏎️ <strong>PIANO-WIRE WHEELS:</strong> The Lunar Rover tires weren't rubber (which shatters in lunar cryogenic cold). They were hand-woven from zinc-coated piano steel wire with titanium chevrons!",
                        joke: "Q: What is an astronaut's favorite road on the Moon?<br>A: <em>The Milky Way! 🌌🏎️</em>"
                    },
                    'apollo-17-lrv-alsep': {
                        fact: "🛠️ <strong>THE DUCT TAPE FENDER:</strong> When Gene Cernan broke the LRV fender with a hammer, lunar dust threatened to overheat the rover. Astronauts repaired it on the Moon using 4 laminated maps and gray duct tape!",
                        joke: "Q: Why does duct tape belong on every space mission?<br>A: <em>Because it has a light side, a dark side, and it binds the universe together! 🛠️🌌</em>"
                    },
                    'surveyor-3': {
                        fact: "🚀 <strong>VISITED BY APOLLO 12:</strong> In November 1969, astronauts Pete Conrad and Alan Bean landed LM Intrepid 160 meters from Surveyor 3, walked up to it, and unbolted its camera to bring home to Earth!",
                        joke: "Q: Why was Surveyor 3 so happy in 1969?<br>A: <em>Because human astronauts dropped by for an interplanetary visit! 🤖👋</em>"
                    },
                    'surveyor-6': {
                        fact: "🦘 <strong>FIRST OFF-WORLD HOP:</strong> On Nov 17, 1967, Surveyor 6 ignited its rocket engines for 2.5 seconds, lifting 3 meters high and hopping 2.5 meters across Sinus Medii—the first controlled liftoff from another celestial body!",
                        joke: "Q: Why was Surveyor 6 the greatest athlete on the Moon?<br>A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🌙</em>"
                    }
                };

                const item = triviaMap[artifact.id] || {
                    fact: `💡 <strong>AUTHENTIC TELEMETRY:</strong> ${artifact.storytelling.whyItMatters}`,
                    joke: `Q: ${artifact.storytelling.juniorJoke ? artifact.storytelling.juniorJoke.question : "Why do rovers love exploring space?"}<br>A: <em>${artifact.storytelling.juniorJoke ? artifact.storytelling.juniorJoke.punchline : "Because there's always space for new discoveries!"}</em>`
                };

                triviaBox.innerHTML = `
                    <div class="trivia-fact-box">${item.fact}</div>
                    <div class="trivia-joke-box">⭐ <strong>MISSION WIT & JOKE:</strong><br>${item.joke}</div>
                `;
            }
        }

        // Load 3D Model in Inspector
        this.modelViewer.loadEquipmentModel(artifact);

        // Handle 4K Video Orbit if available
        if (videoBtn && videoPlayer) {
            if (artifact.videoPath) {
                videoBtn.style.display = 'inline-block';
                videoBtn.textContent = '🎬 4K VIDEO';
                videoBtn.classList.remove('active');
                videoPlayer.src = artifact.videoPath;
            } else {
                videoBtn.style.display = 'none';
            }
        }

        // Animate Last Transmission Teletype Stream
        this.streamLastTransmission(artifact.lastTransmissionMessage);
    }

    streamLastTransmission(msgObj) {
        const teletypeBox = document.getElementById('transmission-teletype');
        const quoteBox = document.getElementById('transmission-quote');
        const contextBox = document.getElementById('transmission-context');

        teletypeBox.textContent = '';
        quoteBox.textContent = msgObj.quote;
        contextBox.textContent = msgObj.actualContext;

        let charIndex = 0;
        const text = `>>> DECODING DOWNLINK PACKET... \n[STATUS: FINAL CARRIER DETECTED]\n${msgObj.telemetry}\n>>> END OF TRANSMISSION.`;

        if (this.teletypeInterval) clearInterval(this.teletypeInterval);

        this.teletypeInterval = setInterval(() => {
            if (charIndex < text.length) {
                teletypeBox.textContent += text[charIndex];
                if (charIndex % 3 === 0) telemetryAudio.playTeletypeTick();
                charIndex++;
            } else {
                clearInterval(this.teletypeInterval);
            }
        }, 18);
    }

    setupDossierModals() {
        const closeBtn = document.getElementById('close-dossier-btn');
        const modal = document.getElementById('artifact-dossier-modal');

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('open');
                telemetryAudio.playBlip(500, 0.05);
            });
        }

        const openStoryBtn = document.getElementById('dossier-open-storybook-btn');
        if (openStoryBtn && modal) {
            openStoryBtn.addEventListener('click', () => {
                modal.classList.remove('open');
                if (this.storybook) {
                    this.storybook.openBook(this.selectedArtifact ? this.selectedArtifact.id : 'mer-b-opportunity', 0);
                }
            });
        }

        // Media Chamber Toolbar controls
        const photoBtn = document.getElementById('view-photo-mode-btn');
        const modelBtn = document.getElementById('toggle-3d-view-btn');
        const photoStage = document.getElementById('vehicle-photo-stage');
        const videoBtn = document.getElementById('toggle-video-view-btn');
        const videoPlayer = document.getElementById('hologram-video-player');
        const canvas3d = document.getElementById('model-viewer-canvas');
        const wireframeBtn = document.getElementById('toggle-wireframe-btn');
        const reset3dBtn = document.getElementById('reset-3d-btn');

        if (photoBtn && photoStage) {
            photoBtn.addEventListener('click', () => {
                photoStage.style.display = 'flex';
                if (canvas3d) canvas3d.style.display = 'none';
                if (videoPlayer) {
                    videoPlayer.style.display = 'none';
                    videoPlayer.pause();
                }
                photoBtn.classList.add('active');
                if (modelBtn) modelBtn.classList.remove('active');
                if (videoBtn) videoBtn.classList.remove('active');
                if (wireframeBtn) wireframeBtn.style.display = 'none';
                if (reset3dBtn) reset3dBtn.style.display = 'none';
                telemetryAudio.playBlip(1200, 0.04);
            });
        }

        if (modelBtn && canvas3d) {
            modelBtn.addEventListener('click', () => {
                if (photoStage) photoStage.style.display = 'none';
                if (videoPlayer) {
                    videoPlayer.style.display = 'none';
                    videoPlayer.pause();
                }
                canvas3d.style.display = 'block';
                if (this.selectedArtifact) {
                    this.modelViewer.loadEquipmentModel(this.selectedArtifact);
                }
                modelBtn.classList.add('active');
                if (photoBtn) photoBtn.classList.remove('active');
                if (videoBtn) videoBtn.classList.remove('active');
                if (wireframeBtn) wireframeBtn.style.display = 'inline-block';
                if (reset3dBtn) reset3dBtn.style.display = 'inline-block';
                telemetryAudio.playBlip(1000, 0.04);
            });
        }

        if (videoBtn && videoPlayer) {
            videoBtn.addEventListener('click', () => {
                if (photoStage) photoStage.style.display = 'none';
                if (canvas3d) canvas3d.style.display = 'none';
                videoPlayer.style.display = 'block';
                videoPlayer.load();
                videoPlayer.play().catch(() => { });
                videoBtn.classList.add('active');
                if (photoBtn) photoBtn.classList.remove('active');
                if (modelBtn) modelBtn.classList.remove('active');
                if (wireframeBtn) wireframeBtn.style.display = 'none';
                if (reset3dBtn) reset3dBtn.style.display = 'none';
                telemetryAudio.playBlip(1100, 0.04);
            });
        }

        if (wireframeBtn) {
            wireframeBtn.addEventListener('click', () => {
                const isWire = this.modelViewer.toggleWireframe();
                wireframeBtn.classList.toggle('active', isWire);
                telemetryAudio.playBlip(1000, 0.04);
            });
        }

        if (reset3dBtn) {
            reset3dBtn.addEventListener('click', () => {
                this.modelViewer.resetView();
                telemetryAudio.playBlip(800, 0.04);
            });
        }
    }

    setupTributeSystem() {
        const form = document.getElementById('tribute-form');
        const wall = document.getElementById('tributes-wall');

        const loadTributes = () => {
            const tributes = JSON.parse(localStorage.getItem('nasa_spaceapps_tributes') || '[]');
            wall.innerHTML = '';
            if (tributes.length === 0) {
                wall.innerHTML = '<div class="no-tributes">No transmissions beamed yet. Be the first student to transmit a tribute!</div>';
                return;
            }
            tributes.slice(-8).reverse().forEach(t => {
                const card = document.createElement('div');
                card.className = 'tribute-card';
                card.innerHTML = `
                    <div class="tribute-card-meta">
                        <span class="tribute-author">📡 Cadet ${t.author} (${t.city || 'Earth'})</span>
                        <span class="tribute-target">TO: ${t.target}</span>
                    </div>
                    <div class="tribute-text">"${t.message}"</div>
                    <div class="tribute-time">${t.date}</div>
                `;
                wall.appendChild(card);
            });
        };

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const author = document.getElementById('tribute-name').value.trim();
                const city = document.getElementById('tribute-city').value.trim();
                const message = document.getElementById('tribute-message').value.trim();
                const target = this.selectedArtifact ? this.selectedArtifact.name : "All Fallen Explorers";

                if (!author || !message) return;

                const tributes = JSON.parse(localStorage.getItem('nasa_spaceapps_tributes') || '[]');
                tributes.push({
                    author,
                    city,
                    message,
                    target,
                    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                });

                localStorage.setItem('nasa_spaceapps_tributes', JSON.stringify(tributes));
                form.reset();
                telemetryAudio.playQuindarTone();
                alert(`Transmission beamed across space to ${target}!`);
                loadTributes();
            });
        }

        loadTributes();
    }

    setupMeshyIntegration() {
        const fileInput = document.getElementById('meshy-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.modelViewer.loadGLTFFromURLOrFile(file, () => {
                        alert('Custom 3D Model successfully loaded into the Holographic Chamber!');
                    }, (err) => {
                        alert('Could not parse 3D file. Please ensure it is a valid .glb or .gltf export.');
                    });
                }
            });
        }
    }

    setupScavengerQuiz() {
        const questions = [
            {
                q: "Which rover got stuck in soft sand and turned its jammed front wheel into a scientific trowel?",
                answers: ["Spirit (MER-A)", "Opportunity", "Sojourner", "InSight"],
                correct: 0,
                hint: "Check the Troy location on Mars!"
            },
            {
                q: "Which lunar equipment was repaired by Apollo astronauts using gray duct tape and maps?",
                answers: ["Surveyor 3", "Apollo 17 LRV Fender", "Apollo 11 Eagle", "ALSEP Package"],
                correct: 1,
                hint: "Gene Cernan and Harrison Schmitt drove this!"
            },
            {
                q: "What was the first aircraft in history to achieve powered flight in Mars' ultra-thin atmosphere?",
                answers: ["Pathfinder", "Phoenix", "Ingenuity Helicopter", "Viking 1"],
                correct: 2,
                hint: "Completed 72 flights before retiring at Valinor Hills."
            }
        ];

        let currentQ = 0;
        const qContainer = document.getElementById('scavenger-question-container');
        if (!qContainer) return;

        const renderQ = () => {
            const item = questions[currentQ];
            qContainer.innerHTML = `
                <div class="quiz-q-num">MISSION LOG DECODER // QUERY ${currentQ + 1} OF ${questions.length}</div>
                <div class="quiz-q-text">${item.q}</div>
                <div class="quiz-options">
                    ${item.answers.map((ans, idx) => `
                        <button class="quiz-opt-btn" data-idx="${idx}">${ans}</button>
                    `).join('')}
                </div>
                <div class="quiz-feedback" id="quiz-feedback"></div>
            `;

            qContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const selected = parseInt(btn.dataset.idx);
                    const feedback = document.getElementById('quiz-feedback');
                    if (selected === item.correct) {
                        feedback.innerHTML = `<span class="correct">✔ Telemetry Verified! Excellent discovery, Explorer.</span>`;
                        telemetryAudio.playQuindarTone();
                        setTimeout(() => {
                            currentQ = (currentQ + 1) % questions.length;
                            renderQ();
                        }, 1800);
                    } else {
                        feedback.innerHTML = `<span class="incorrect">✖ Signal Mismatch. Hint: ${item.hint}</span>`;
                        telemetryAudio.playBlip(300, 0.2);
                    }
                });
            });
        };

        renderQ();
    }

    setupSketchScanner() {
        const stage = document.getElementById('scanner-stage');
        const slider = document.getElementById('scanner-slider');
        const pctDisplay = document.getElementById('scan-pct-display');
        const sketchImg = document.getElementById('sketch-image');
        const renderImg = document.getElementById('render-image');
        const autoScanBtn = document.getElementById('auto-scan-btn');
        const view3dBtn = document.getElementById('view-in-3d-btn');

        if (!stage || !slider) return;

        const craftImages = {
            opportunity: 'assets/renders/opportunity.png',
            apollo_lm: 'assets/renders/apollo_lm.png',
            ingenuity: 'assets/renders/ingenuity.png',
            perseverance: 'assets/renders/perseverance.png'
        };

        let currentCraft = 'opportunity';
        let autoScanInterval = null;
        let isAutoScanning = false;

        const updatePosition = (val) => {
            stage.style.setProperty('--scan-pos', `${val}%`);
            if (pctDisplay) pctDisplay.textContent = `${Math.round(val)}%`;
        };

        // Slider Input Event
        slider.addEventListener('input', (e) => {
            if (isAutoScanning) stopAutoScan();
            updatePosition(e.target.value);
            if (Math.round(e.target.value) % 15 === 0) {
                telemetryAudio.playBlip(1400, 0.02);
            }
        });

        // Craft Switch Buttons
        document.querySelectorAll('.scanner-craft-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.scanner-craft-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                currentCraft = btn.dataset.craft;
                const newSrc = craftImages[currentCraft];

                // Smooth fade transition
                sketchImg.style.opacity = '0';
                renderImg.style.opacity = '0';

                setTimeout(() => {
                    sketchImg.src = newSrc;
                    renderImg.src = newSrc;
                    sketchImg.style.opacity = '1';
                    renderImg.style.opacity = '1';
                }, 180);

                telemetryAudio.playBlip(900, 0.05);
            });
        });

        // Auto-Scan Toggle
        const stopAutoScan = () => {
            isAutoScanning = false;
            clearInterval(autoScanInterval);
            if (autoScanBtn) autoScanBtn.textContent = '▶ AUTO SCAN PULSE';
        };

        const startAutoScan = () => {
            isAutoScanning = true;
            if (autoScanBtn) autoScanBtn.textContent = '⏸ PAUSE SCAN';
            let direction = 1;
            let current = parseFloat(slider.value);

            autoScanInterval = setInterval(() => {
                current += direction * 0.7;
                if (current >= 95) {
                    current = 95;
                    direction = -1;
                } else if (current <= 5) {
                    current = 5;
                    direction = 1;
                }
                slider.value = current;
                updatePosition(current);
            }, 18);
        };

        if (autoScanBtn) {
            autoScanBtn.addEventListener('click', () => {
                if (isAutoScanning) {
                    stopAutoScan();
                } else {
                    startAutoScan();
                }
                telemetryAudio.playBlip(1100, 0.04);
            });
        }

        // View in 3D Button
        if (view3dBtn) {
            view3dBtn.addEventListener('click', () => {
                const targetId = currentCraft === 'opportunity' ? 'mer-b-opportunity' :
                    (currentCraft === 'apollo_lm' ? 'apollo-11-descent-stage' :
                        (currentCraft === 'ingenuity' ? 'ingenuity-helicopter' : 'mer-b-opportunity'));
                const craft = EQUIPMENT_DATABASE.find(a => a.id === targetId);
                if (craft) {
                    this.openArtifactDossier(craft);
                }
            });
        }

        // Scroll-driven trigger when section comes into view
        let hasTriggeredScroll = false;
        window.addEventListener('scroll', () => {
            const rect = stage.getBoundingClientRect();
            if (!hasTriggeredScroll && rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
                hasTriggeredScroll = true;
                startAutoScan();
                setTimeout(() => {
                    stopAutoScan();
                }, 3000);
            }
        });
    }

    setupVideoTheater() {
        const videoElement = document.getElementById('theater-main-video');
        const playToggle = document.getElementById('theater-play-toggle');
        const audioToggle = document.getElementById('theater-audio-toggle');
        const fullscreenBtn = document.getElementById('theater-fullscreen-btn');
        const craftName = document.getElementById('theater-craft-name');
        const craftLoc = document.getElementById('theater-craft-loc');
        const craftQuote = document.getElementById('theater-craft-quote');
        const tabs = document.querySelectorAll('.theater-tab-btn');

        if (!videoElement) return;

        // Switch craft video tab
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const videoSrc = tab.dataset.video;
                const name = tab.dataset.target;
                const loc = tab.dataset.loc;
                const quote = tab.dataset.quote;

                // Smooth fade transition
                videoElement.style.opacity = '0.3';
                setTimeout(() => {
                    videoElement.src = videoSrc;
                    videoElement.load();
                    videoElement.play().catch(() => { });
                    videoElement.style.opacity = '1';
                    if (playToggle) playToggle.textContent = '⏸ PAUSE';
                }, 150);

                if (craftName) craftName.textContent = name.toUpperCase();
                if (craftLoc) craftLoc.textContent = `📍 ${loc}`;
                if (craftQuote) craftQuote.textContent = quote;

                telemetryAudio.playBlip(1200, 0.05);
            });
        });

        // Play / Pause Toggle
        if (playToggle) {
            playToggle.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                    playToggle.textContent = '⏸ PAUSE';
                } else {
                    videoElement.pause();
                    playToggle.textContent = '▶ PLAY';
                }
                telemetryAudio.playBlip(800, 0.03);
            });
        }

        // Audio Mute Toggle
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                videoElement.muted = !videoElement.muted;
                audioToggle.textContent = videoElement.muted ? '🔇 UNMUTE AUDIO' : '🔊 MUTE AUDIO';
                telemetryAudio.playBlip(1000, 0.03);
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                }
                telemetryAudio.playQuindarTone();
            });
        }
    }

    enrichGlossaryKeywords(text) {
        if (!text) return '';
        const termKeywords = [
            { term: 'hirise', regex: /\b(HiRISE)\b/gi },
            { term: 'ctx', regex: /\b(CTX)\b/g },
            { term: 'lroc', regex: /\b(LROC)\b/g },
            { term: 'gaas', regex: /\b(GaAs)\b/g },
            { term: 'rtg', regex: /\b(RTG)\b/g },
            { term: 'rad6000', regex: /\b(RAD6000|RAD750)\b/g },
            { term: 'risc', regex: /\b(RISC)\b/g },
            { term: 'vxworks', regex: /\b(VxWorks)\b/gi },
            { term: 'apxs', regex: /\b(APXS)\b/g },
            { term: 'mossbauer', regex: /\b(Mössbauer)\b/gi },
            { term: 'mini-tes', regex: /\b(Mini-TES)\b/gi },
            { term: 'pancam', regex: /\b(Pancam)\b/gi },
            { term: 'seis', regex: /\b(SEIS)\b/g },
            { term: 'dsn', regex: /\b(DSN)\b/g },
            { term: 'x-band', regex: /\b(X-band)\b/gi },
            { term: 'uhf', regex: /\b(UHF)\b/g },
            { term: 'citation', regex: /\b(Planetary Data System|PDS)\b/gi },
            { term: 'lrrr', regex: /\b(LRRR)\b/g },
            { term: 'sol', regex: /\b(Sols?)\b/gi },
            { term: 'planetocentric', regex: /\b(Planetocentric)\b/gi },
            { term: 'iau', regex: /\b(IAU(?:\/IAG)?\s*2000)\b/gi }
        ];

        let enriched = text;
        termKeywords.forEach(({ term, regex }) => {
            enriched = enriched.replace(regex, (match) => {
                return `<span class="glossary-term" data-term="${term}" title="Click to explain ${match}">${match} <span class="mini-info-badge">ⓘ</span></span>`;
            });
        });
        return enriched;
    }

    setupLexiconExplainer() {
        const backdrop = document.getElementById('lexicon-modal-backdrop');
        const closeBtn = document.getElementById('lexicon-close-btn');
        const gotItBtn = document.getElementById('lexicon-gotit-btn');
        const headingEl = document.getElementById('lexicon-term-heading');
        const categoryEl = document.getElementById('lexicon-category-pill');
        const descEl = document.getElementById('lexicon-simple-desc');
        const teenBox = document.getElementById('lexicon-teen-box');
        const teenText = document.getElementById('lexicon-teen-text');
        const juniorBox = document.getElementById('lexicon-junior-box');
        const juniorText = document.getElementById('lexicon-junior-text');

        const openExplainer = (termKey) => {
            const data = NASA_GLOSSARY[termKey];
            if (!data) return;

            if (categoryEl) categoryEl.textContent = data.category.toUpperCase();
            if (headingEl) headingEl.textContent = data.title;
            if (descEl) descEl.textContent = data.simple;

            if (teenText) teenText.textContent = data.teenTip;
            if (juniorText) juniorText.textContent = data.juniorTip;

            // Mode-specific emphasis
            if (this.userMode === 'junior') {
                if (juniorBox) {
                    juniorBox.style.display = 'block';
                    juniorBox.style.borderWidth = '2px';
                    juniorBox.style.borderColor = '#ffaa00';
                }
                if (teenBox) teenBox.style.display = 'none';
                telemetryAudio.playPopSound();
            } else if (this.userMode === 'teen') {
                if (teenBox) {
                    teenBox.style.display = 'block';
                    teenBox.style.borderWidth = '2px';
                    teenBox.style.borderColor = '#a855f7';
                }
                if (juniorBox) juniorBox.style.display = 'none';
                telemetryAudio.playBlip(1400, 0.05);
            } else {
                // Adult mode shows both perspectives
                if (teenBox) teenBox.style.display = 'block';
                if (juniorBox) juniorBox.style.display = 'block';
                telemetryAudio.playBlip(1200, 0.04);
            }

            if (backdrop) {
                backdrop.classList.add('active');
            }
        };

        const closeExplainer = () => {
            if (backdrop) backdrop.classList.remove('active');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeExplainer);
        if (gotItBtn) gotItBtn.addEventListener('click', closeExplainer);
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) closeExplainer();
            });
        }
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && backdrop && backdrop.classList.contains('active')) {
                closeExplainer();
            }
        });

        // Event delegation for all current and dynamically created ⓘ buttons & glossary terms
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.info-help-btn, .glossary-term');
            if (trigger && trigger.dataset.term) {
                e.preventDefault();
                e.stopPropagation();
                openExplainer(trigger.dataset.term);
            }
        });
    }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
