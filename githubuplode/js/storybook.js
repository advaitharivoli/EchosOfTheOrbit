/**
 * 3D ILLUSTRATED CHILDREN'S ADVENTURE FLIPBOOK ENGINE
 * With Realistic 3D Page Turning Leaves (flipbookpdf style),
 * Paper shadows, spine creases, dog-ear curling, and Quindar sound integration!
 */

import { EQUIPMENT_DATABASE } from '../data/equipmentData.js';
import { telemetryAudio } from './audioTelemetry.js';

export class InteractiveStorybook {
    constructor() {
        this.currentCraftId = 'mer-b-opportunity';
        this.currentPage = 0; // 0 = Cover, 1 = Chapter 1, 2 = Chapter 2, 3 = Finale & Video
        this.totalPages = 3;
        this.isOpen = false;
        this.isFlipping = false;

        this.initDOM();
        this.setupEvents();
        this.triggerInitialNotification();
    }

    initDOM() {
        // 1. Whimsical Kids Alert Notification
        const notifyBanner = document.createElement('div');
        notifyBanner.id = 'incoming-transmission-alert';
        notifyBanner.className = 'kids-alert-bubble';
        notifyBanner.innerHTML = `
            <div class="alert-sticker">★ NEW MESSAGE FROM MARS! ★</div>
            <div class="alert-avatar-box">
                <span class="animated-rover-icon">🤖</span>
            </div>
            <div class="alert-text-group">
                <div class="kids-alert-title">Psst! Hey Explorer!</div>
                <div class="kids-alert-body">
                    We've unlocked the <strong>3D Illustrated Adventure Books</strong> for Oppy, InSight & the Moon Buggy!
                </div>
            </div>
            <div class="kids-alert-btns">
                <button class="kids-btn-read" id="open-story-from-alert">📖 OPEN 3D STORYBOOK!</button>
                <button class="kids-btn-later" id="dismiss-alert">Maybe Later</button>
            </div>
        `;
        document.body.appendChild(notifyBanner);

        // 2. Realistic 3D Flipbook Modal
        const bookModal = document.createElement('div');
        bookModal.id = 'storybook-modal';
        bookModal.className = 'kids-flipbook-modal';
        bookModal.innerHTML = `
            <div class="flipbook-outer-container">
                
                <!-- Whimsical Top Bar -->
                <div class="flipbook-header-bar">
                    <div class="book-title-tag">
                        <span class="star-badge">🌟</span>
                        <span id="flipbook-header-title">THE ADVENTURES OF OPPY THE ROVER!</span>
                    </div>

                    <div class="craft-switcher-pill">
                        <label for="book-craft-dropdown">CHOOSE AN ADVENTURE:</label>
                        <select id="book-craft-dropdown" class="kids-dropdown">
                            ${EQUIPMENT_DATABASE.map(c => `<option value="${c.id}">${c.name} (${c.planet === 'mars' ? 'Mars' : 'Moon'})</option>`).join('')}
                        </select>
                    </div>

                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="header-action-btn" id="header-narrate-btn" title="Speak story aloud with Cadet Robot Voice" style="background: #ffde38; color: #000000; font-weight: 800; border: 2px solid #000;">🗣️ READ ALOUD!</button>
                        <button class="header-action-btn" id="header-jump-video-btn" title="Watch 4K Video">🎬 4K VIDEO</button>
                        <button class="header-action-btn" id="header-open-dossier-btn" title="View 3D Model">🔬 3D SPECS</button>
                        <button class="kids-close-btn" id="close-storybook-btn" title="Close Book">✕</button>
                    </div>
                </div>

                <!-- 3D Realistic Open Book (Warm Creamy Paper) -->
                <div class="flipbook-desk">
                    
                    <div class="real-flipbook" id="real-flipbook">
                        
                        <!-- Left Page -->
                        <div class="paper-page left-page" id="paper-page-left">
                            <div class="page-corner-curl left-curl" id="curl-left" title="Click to flip back">◀ TURN BACK</div>
                            <div class="page-inner-content" id="page-left-content"></div>
                            <div class="page-number" id="page-left-num">1</div>
                        </div>

                        <!-- 3D Book Spine Shadow Crease -->
                        <div class="realistic-spine-shadow"></div>

                        <!-- Right Page -->
                        <div class="paper-page right-page" id="paper-page-right">
                            <div class="page-corner-curl right-curl" id="curl-right" title="Click to flip forward">NEXT PAGE ▶</div>
                            <div class="page-inner-content" id="page-right-content"></div>
                            <div class="page-number" id="page-right-num">2</div>
                        </div>

                    </div>

                </div>

                <!-- Flipbook Bottom Navigation & Page Turner -->
                <div class="flipbook-footer-bar">
                    <button class="page-nav-arrow" id="flip-prev-btn">
                        <span class="arrow-symbol">❮</span> TURN BACK
                    </button>

                    <div class="flipbook-progress-dots" id="flip-dots">
                        <button class="dot-btn active" data-page="0">📘 Cover</button>
                        <button class="dot-btn" data-page="1">🚀 Chapter 1</button>
                        <button class="dot-btn" data-page="2">⭐ Chapter 2</button>
                        <button class="dot-btn" data-page="3">🎬 Finale & 4K Video</button>
                    </div>

                    <button class="page-nav-arrow primary" id="flip-next-btn">
                        FLIP FORWARD <span class="arrow-symbol">❯</span>
                    </button>
                </div>

            </div>
        `;
        document.body.appendChild(bookModal);
    }

    triggerInitialNotification() {
        setTimeout(() => {
            if (document.body.classList.contains('mode-kids')) {
                const banner = document.getElementById('incoming-transmission-alert');
                if (banner) {
                    banner.classList.add('visible');
                    telemetryAudio.playPageTurn();
                }
            }
        }, 1200);
    }

    setupEvents() {
        const alertBanner = document.getElementById('incoming-transmission-alert');
        const openFromAlert = document.getElementById('open-story-from-alert');
        const dismissAlert = document.getElementById('dismiss-alert');
        const closeBtn = document.getElementById('close-storybook-btn');
        const navStoryBtn = document.getElementById('nav-storybook-btn');
        const prevBtn = document.getElementById('flip-prev-btn');
        const nextBtn = document.getElementById('flip-next-btn');
        const curlLeft = document.getElementById('curl-left');
        const curlRight = document.getElementById('curl-right');
        const dropdown = document.getElementById('book-craft-dropdown');
        const jumpVideoBtn = document.getElementById('header-jump-video-btn');
        const openDossierBtn = document.getElementById('header-open-dossier-btn');

        if (openFromAlert) {
            openFromAlert.addEventListener('click', () => {
                alertBanner.classList.remove('visible');
                this.openBook(this.currentCraftId, 0);
            });
        }

        if (dismissAlert) {
            dismissAlert.addEventListener('click', () => {
                alertBanner.classList.remove('visible');
            });
        }

        if (navStoryBtn) {
            navStoryBtn.addEventListener('click', () => {
                this.openBook(this.currentCraftId, 0);
            });
        }

        if (jumpVideoBtn) {
            jumpVideoBtn.addEventListener('click', () => {
                this.flipToPage(3);
            });
        }

        if (openDossierBtn) {
            openDossierBtn.addEventListener('click', () => {
                this.closeBook();
                if (window.spaceApp && window.spaceApp.showDossierForCraft) {
                    window.spaceApp.showDossierForCraft(this.currentCraftId);
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeBook());
        }

        // Page flipping triggers
        const flipNext = () => {
            if (this.currentPage < this.totalPages) {
                this.flipToPage(this.currentPage + 1);
            } else {
                this.closeBook();
                const globe = document.getElementById('globe-section');
                if (globe) globe.scrollIntoView({ behavior: 'smooth' });
            }
        };

        const flipPrev = () => {
            if (this.currentPage > 0) {
                this.flipToPage(this.currentPage - 1);
            }
        };

        if (nextBtn) nextBtn.addEventListener('click', flipNext);
        if (prevBtn) prevBtn.addEventListener('click', flipPrev);
        if (curlRight) curlRight.addEventListener('click', flipNext);
        if (curlLeft) curlLeft.addEventListener('click', flipPrev);

        // Click right page anywhere to turn forward, left to turn back
        const leftPage = document.getElementById('paper-page-left');
        const rightPage = document.getElementById('paper-page-right');

        if (rightPage) {
            rightPage.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'VIDEO' && e.target.tagName !== 'A' && e.target.tagName !== 'SELECT') {
                    flipNext();
                }
            });
        }

        if (leftPage) {
            leftPage.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'VIDEO' && e.target.tagName !== 'A' && e.target.tagName !== 'SELECT') {
                    flipPrev();
                }
            });
        }

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                flipNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                flipPrev();
            } else if (e.key === 'Escape') {
                this.closeBook();
            }
        });

        // Header narrate button (Read Aloud with Cadet Robot Voice)
        const narrateBtn = document.getElementById('header-narrate-btn');
        if (narrateBtn) {
            narrateBtn.addEventListener('click', () => {
                telemetryAudio.playAlienChatter();
                const leftEl = document.getElementById('page-left-content');
                const rightEl = document.getElementById('page-right-content');
                let fullText = '';
                if (leftEl) fullText += leftEl.innerText + ' ';
                if (rightEl) fullText += rightEl.innerText;
                if (!fullText.trim()) {
                    fullText = "Welcome to the space adventure storybook! Turn the page to begin our cosmic mission!";
                }
                telemetryAudio.speakCadetVoice(fullText);
            });
        }

        if (dropdown) {
            dropdown.addEventListener('change', (e) => {
                this.currentCraftId = e.target.value;
                this.currentPage = 0;
                this.renderBookSpread();
                telemetryAudio.playPageTurn();
            });
        }

        // Dot buttons
        document.querySelectorAll('.dot-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = parseInt(btn.dataset.page);
                this.flipToPage(p);
            });
        });
    }

    openBook(craftId = 'mer-b-opportunity', pageIndex = 0) {
        if (document.body.classList.contains('gate-locked')) {
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
            return;
        }

        this.currentCraftId = craftId;
        this.currentPage = pageIndex;
        this.isOpen = true;

        const dropdown = document.getElementById('book-craft-dropdown');
        if (dropdown) dropdown.value = craftId;

        const modal = document.getElementById('storybook-modal');
        if (modal) modal.classList.add('open');

        this.renderBookSpread();
        telemetryAudio.playPageTurn();
    }

    closeBook() {
        this.isOpen = false;
        const modal = document.getElementById('storybook-modal');
        if (modal) modal.classList.remove('open');
    }

    /**
     * AUTHENTIC 3D PAGE TURNING ENGINE (flipbookpdf style)
     * Spawns a physical 3D leaf hinged at the spine with front & back faces,
     * sweeps a shadow gradient, and settles with soft paper sound!
     */
    flipToPage(newPageIndex) {
        if (newPageIndex === this.currentPage || this.isFlipping) return;
        if (newPageIndex < 0 || newPageIndex > this.totalPages) return;

        this.isFlipping = true;
        const isForward = newPageIndex > this.currentPage;
        const craft = EQUIPMENT_DATABASE.find(a => a.id === this.currentCraftId) || EQUIPMENT_DATABASE[0];

        const oldSpread = this.getSpreadData(this.currentPage, craft);
        const newSpread = this.getSpreadData(newPageIndex, craft);

        const bookEl = document.getElementById('real-flipbook');
        const leftContent = document.getElementById('page-left-content');
        const rightContent = document.getElementById('page-right-content');
        const leftNum = document.getElementById('page-left-num');
        const rightNum = document.getElementById('page-right-num');

        // Play paper swoosh and cool kid sound effect
        telemetryAudio.playPageTurn();
        if (window.spaceApp && window.spaceApp.userMode === 'junior') {
            telemetryAudio.playCoinPickup();
        }

        // Build 3D Flipping Leaf
        const leaf = document.createElement('div');
        leaf.className = `flipping-3d-leaf ${isForward ? 'flip-forward' : 'flip-backward'}`;

        if (isForward) {
            // Underneath stationary right page immediately pre-loads the upcoming right page
            rightContent.innerHTML = newSpread.rightHTML;
            rightNum.textContent = newSpread.rightNum;

            leaf.innerHTML = `
                <div class="leaf-face leaf-front paper-page right-page">
                    <div class="page-inner-content">${oldSpread.rightHTML}</div>
                    <div class="page-number">${oldSpread.rightNum}</div>
                    <div class="leaf-page-shadow"></div>
                </div>
                <div class="leaf-face leaf-back paper-page left-page">
                    <div class="page-inner-content">${newSpread.leftHTML}</div>
                    <div class="page-number">${newSpread.leftNum}</div>
                    <div class="leaf-page-shadow"></div>
                </div>
            `;
        } else {
            // Underneath stationary left page immediately pre-loads the upcoming left page
            leftContent.innerHTML = newSpread.leftHTML;
            leftNum.textContent = newSpread.leftNum;

            leaf.innerHTML = `
                <div class="leaf-face leaf-front paper-page left-page">
                    <div class="page-inner-content">${oldSpread.leftHTML}</div>
                    <div class="page-number">${oldSpread.leftNum}</div>
                    <div class="leaf-page-shadow"></div>
                </div>
                <div class="leaf-face leaf-back paper-page right-page">
                    <div class="page-inner-content">${newSpread.rightHTML}</div>
                    <div class="page-number">${newSpread.rightNum}</div>
                    <div class="leaf-page-shadow"></div>
                </div>
            `;
        }

        if (bookEl) bookEl.appendChild(leaf);

        // Update nav toolbar buttons and title
        this.updateNavState(newPageIndex, craft);

        // After 620ms animation completes, settle paper
        setTimeout(() => {
            leftContent.innerHTML = newSpread.leftHTML;
            leftNum.textContent = newSpread.leftNum;
            rightContent.innerHTML = newSpread.rightHTML;
            rightNum.textContent = newSpread.rightNum;

            if (leaf.parentNode) {
                leaf.parentNode.removeChild(leaf);
            }

            this.currentPage = newPageIndex;
            this.isFlipping = false;

            if (telemetryAudio.playPaperLand) {
                telemetryAudio.playPaperLand();
            }
        }, 620);
    }

    updateNavState(pageIndex, craft) {
        const prevBtn = document.getElementById('flip-prev-btn');
        const nextBtn = document.getElementById('flip-next-btn');
        const headerTitle = document.getElementById('flipbook-header-title');

        if (prevBtn) prevBtn.disabled = (pageIndex === 0);
        if (nextBtn) nextBtn.innerHTML = (pageIndex === this.totalPages) ?
            'EXPLORE 3D ON PLANET ➔' : 'FLIP FORWARD <span class="arrow-symbol">❯</span>';

        document.querySelectorAll('.dot-btn').forEach(btn => {
            const p = parseInt(btn.dataset.page);
            btn.classList.toggle('active', p === pageIndex);
        });

        if (headerTitle) {
            headerTitle.textContent = `THE TALE OF ${craft.name.toUpperCase()}!`;
        }

        const jumpVideoBtn = document.getElementById('header-jump-video-btn');
        if (jumpVideoBtn) {
            jumpVideoBtn.style.display = craft.videoPath ? 'inline-block' : 'none';
        }
    }

    renderBookSpread() {
        const leftContent = document.getElementById('page-left-content');
        const rightContent = document.getElementById('page-right-content');
        const leftNum = document.getElementById('page-left-num');
        const rightNum = document.getElementById('page-right-num');

        if (!leftContent || !rightContent) return;

        const craft = EQUIPMENT_DATABASE.find(a => a.id === this.currentCraftId) || EQUIPMENT_DATABASE[0];
        const spread = this.getSpreadData(this.currentPage, craft);

        leftContent.innerHTML = spread.leftHTML;
        rightContent.innerHTML = spread.rightHTML;
        leftNum.textContent = spread.leftNum;
        rightNum.textContent = spread.rightNum;

        this.updateNavState(this.currentPage, craft);
    }

    getSpreadData(p, craft) {
        if (craft.id === 'insight-lander') {
            return this.getInSightSpreadData(p, craft);
        } else if (craft.id === 'apollo-11-descent-stage') {
            return this.getApollo11SpreadData(p, craft);
        } else if (craft.id === 'apollo-11-lrrr') {
            return this.getApollo11LRRRSpreadData(p, craft);
        } else if (craft.id === 'apollo-15-lrv' || craft.id === 'apollo-17-lrv-alsep') {
            return this.getLunarRoverSpreadData(p, craft);
        } else if (craft.id === 'ingenuity-helicopter') {
            return this.getIngenuitySpreadData(p, craft);
        } else if (craft.id === 'mer-b-opportunity') {
            return this.getOpportunitySpreadData(p, craft);
        } else if (craft.id === 'mer-a-spirit') {
            return this.getSpiritSpreadData(p, craft);
        } else if (craft.id === 'sojourner-pathfinder') {
            return this.getSojournerSpreadData(p, craft);
        } else if (craft.id === 'viking-1-lander') {
            return this.getViking1SpreadData(p, craft);
        } else if (craft.id === 'surveyor-3' || craft.id === 'surveyor-6') {
            return this.getSurveyorSpreadData(p, craft);
        } else {
            return this.getDynamicSpreadData(p, craft);
        }
    }

    /* =========================================================================
       INSIGHT LANDER: THE SECRET MARTIAN HEARTBEAT
       Uses user-uploaded image assets/insight_lander.webp and video insight.mp4!
       ========================================================================= */
    getInSightSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TOP SECRET GEOPHYSICS ★</div>
                        <h1 class="stilton-book-title">
                            THE SECRET <br>
                            <span class="stilton-word-wild">HEARTBEAT</span> OF <br>
                            <span class="stilton-word-hero">MARS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="assets/insight_lander.webp" class="cover-rover-img" alt="InSight Lander on Mars with SEIS dome and HP3 mole">
                        </div>
                        <div class="cover-author-seal">
                            STARRING INSIGHT: THE QUIET MARTIAN LISTENER
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Elysium Planitia // Sol 001</div>
                        <h2 class="stilton-chapter-head">HELLO FROM THE RED PARKING LOT!</h2>
                        
                        <p class="stilton-p">Dear Reader,</p>
                        <p class="stilton-p">
                            Most robots sent to <span class="stilton-word-mars">MARS</span> love racing on wheels and throwing red dirt everywhere. 
                            <strong>NOT ME!</strong>
                        </p>
                        <p class="stilton-p">
                            My name is <span class="stilton-word-hero">InSight</span>. My mission was to sit completely still and do something nobody had ever done: <span class="stilton-word-wonder">LISTEN TO THE CORE OF A PLANET!</span>
                        </p>
                        <p class="stilton-p">
                            Turn the page to see how I dropped my golden ear on Mars, felt 1,300 earthquakes, and uncovered Mars' molten secret!
                        </p>

                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">
                            LANDING ON A <span class="stilton-word-blast">SUPER-PARKING LOT!</span>
                        </h2>

                        <p class="stilton-p">
                            On November 26, 2018, I slammed through the Martian atmosphere at 12,300 miles per hour!
                        </p>

                        <div class="comic-sound-burst burst-orange">*SHUUUUUUUSH! BOOOOM!*</div>

                        <p class="stilton-p">
                            At 7 miles high, my 39-foot supersonic parachute popped open against hurricane-force winds! Retrorockets fired, and I set down on 3 shock-absorbing legs at <span class="stilton-word-blue">Elysium Planitia</span>.
                        </p>

                        <div class="doodle-note-sticky">
                            💡 <strong>Why Elysium?</strong> Scientists call it the biggest parking lot in the solar system—flatter than a giant pancake, so no rocks could tip me over!
                        </div>

                        <div class="highlight-callout-box" style="margin-top: 6px;">
                            🛰️ <strong>TWIN BRIEFCASE BUDDIES:</strong><br>
                            Two tiny spacecraft named <em>Wall-E & Eva</em> (MarCO) flew behind me, beaming my touchdown signals back to Earth in real time!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE CRANE WITH A CLAW!</h2>
                        
                        <p class="stilton-p">Right after touchdown, I unfolded my 6-foot mechanical robotic arm!</p>

                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 INSIGHT SEIS & HP3 ON ELYSIUM PLANITIA</span>
                        </div>

                        <div class="comic-sound-burst burst-green">*WHIRRRR... CLINK!*</div>

                        <div class="speech-quote-bubble">
                            "I clamped onto my golden SEIS dome and placed it on the red dirt to feel Mars' pulse! Then I lowered a white wind-shield dome over it like a giant soup bowl!"
                        </div>

                        <div class="doodle-note-sticky" style="margin-top: 6px;">
                            🔬 <strong>ATOMIC SENSITIVITY:</strong> That golden ear could detect ground tremors smaller than the width of a single hydrogen atom!
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">
                            <span class="stilton-word-mars">1,318</span> MARSQUAKES!
                        </h2>

                        <p class="stilton-p">People thought Mars was cold and dead inside. <strong>THEY WERE WRONG!</strong></p>

                        <div class="comic-sound-burst burst-cyan">*RUUUUMBLE... THUMP!*</div>

                        <p class="stilton-p">
                            My golden dome felt the ground tremble over <span class="stilton-word-big">1,300 TIMES!</span> 
                            I caught space rocks slamming into the red surface and felt a monster magnitude 4.7 quake that shook the planet for 10 hours!
                        </p>

                        <div class="highlight-callout-box">
                            🌋 <strong>MARS HAS A LIQUID HEART:</strong><br>
                            By listening to the sound waves bounce through the planet, I proved that Mars has a giant molten, iron-rich liquid core!
                        </div>

                        <div class="doodle-note-sticky" style="margin-top: 6px;">
                            ☄️ <strong>METEORITE CRATER:</strong> In Sept 2021, I felt a space rock hit Mars 180 miles away, carving a 400-foot crater and revealing pure white ice!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">THE FAMOUS DIGGING MOLE!</h2>

                        <p class="stilton-p">
                            Next, my robotic friend—the <strong>HP3 Heat Mole</strong>—tried to hammer itself 16 feet straight down into the Martian soil!
                        </p>

                        <div class="comic-sound-burst burst-purple">*CLACK! TAP! TAP!*</div>

                        <p class="stilton-p">
                            The Martian soil was surprisingly crumbly and sticky! Even when it was tough, I pressed my shovel against it to help it dig and measure Mars' body temperature!
                        </p>

                        <div class="speech-quote-bubble">
                            "When dust piled up on my solar wings, engineers told me to scoop UP sand and let the wind blast it across my panels! It blew the dust away and boosted power by 5%!"
                        </div>

                        <div class="highlight-callout-box" style="margin-top: 6px; border-color: #f59e0b;">
                            ⭐ <strong>CADET DIARY:</strong> Over 4 years, I took over 24,000 photos and proved Mars has a beating geological pulse!
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">A SERENE SLEEP</h2>

                        <p class="stilton-p">
                            Over 4 years, fine red Martian dust piled up thicker and thicker on my two circular solar wings. 
                            On <strong>December 11, 2022 (Sol 1,436)</strong>, I snapped my final surface photograph of the silent plain. Four days later on <strong>December 15, 2022 (Sol 1,442)</strong>, I transmitted my final telemetry packet. After two missed passes, NASA officially retired my mission on <strong>December 21, 2022</strong>.
                        </p>

                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 DOWNLINK FROM ELYSIUM PLANITIA:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>

                        <div class="highlight-callout-box" style="margin-top: 10px; border-color: #ffe600;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did InSight listen to Mars' heartbeat?<br>
                            A: <em>Because it wanted to know if Mars had rock-and-roll in its core!</em>
                        </div>

                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: MARS HEARTBEAT LISTENER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K CINEMATIC FLY-AROUND!</h2>
                        
                        <p class="stilton-p" style="font-size: 0.95rem;">
                            Watch me resting quietly on the flat plains of Elysium in real 4K motion:
                        </p>

                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/insight.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ INSIGHT 4K ARCHIVAL ORBIT ✦</div>
                        </div>

                        <p class="stilton-p" style="font-size: 0.88rem; text-align: center; margin-top: 0.8rem;">
                            <em>"Humanity now knows what the inside of Mars feels like, all because one quiet lander took the time to listen."</em>
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getSpiritSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TWIN SISTER TO OPPORTUNITY ★</div>
                        <h1 class="stilton-book-title">
                            SPIRIT: THE <br>
                            <span class="stilton-word-wild">UNSTOPPABLE</span> <br>
                            <span class="stilton-word-hero">EXPLORER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Spirit Rover">
                        </div>
                        <div class="cover-author-seal">GUSEV CRATER EXPEDITION LOG</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Gusev Crater // Sol 001</div>
                        <h2 class="stilton-chapter-head">MEET OPPORTUNITY'S TWIN SISTER!</h2>
                        <p class="stilton-p">Greetings Earth Cadet!</p>
                        <p class="stilton-p">
                            I am <strong>Spirit (MER-A)</strong>! Three weeks before my twin sister Opportunity bounced into Eagle Crater, I touched down on the other side of Mars inside giant Gusev Crater!
                        </p>
                        <p class="stilton-p">
                            They gave me a 90-day warranty. But I climbed mountains, survived freezing winters, and explored for <strong>2,210 Martian days!</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-blast">BROKEN WHEEL</span> MIRACLE!</h2>
                        <p class="stilton-p">In March 2006, after 779 sols of rugged rock climbing, my front-right wheel motor gave out and locked tight!</p>
                        <div class="comic-sound-burst burst-orange">*SCREEEEEECH!*</div>
                        <p class="stilton-p">Did I give up? No way! NASA flight controllers commanded me to drive backwards, dragging my dead wheel like a garden plow!</p>
                        <div class="doodle-note-sticky">
                            💡 <strong>REVERSE DRIVING:</strong> For the rest of my mission, I drove backwards everywhere!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">ACCIDENTAL PURE SILICA!</h2>
                        <p class="stilton-p">As my dead wheel dragged through the dirt, it sliced open a shallow trench in the ground...</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SPIRIT ROVER'S WHEEL TRENCH UNCOVERS SILICA</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*SPARKLE! SHINE!*</div>
                        <div class="speech-quote-bubble">
                            "Inside the trench was dazzling bright white sand! It was 90% pure silica—the kind made by bubbling hot springs and steam vents! Proof Mars once had habitable hot springs!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">TROY SAND TRAP</span></h2>
                        <p class="stilton-p">In April 2009, near a plateau called 'Home Plate', my wheels broke through a crusty layer of soil into hidden soft sulfate sand!</p>
                        <div class="comic-sound-burst burst-red">*SQUISH! SPIN! STUCK!*</div>
                        <p class="stilton-p">My belly touched the sand. NASA tried for 8 months in sandbox simulators to wiggle me free!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">STATIONARY SCIENCE HERO</h2>
                        <p class="stilton-p">When I couldn't roll anymore, NASA didn't shut me down. They declared me a <strong>Stationary Science Outpost!</strong></p>
                        <div class="highlight-callout-box" style="margin-bottom: 10px;">
                            🌡️ <strong>CORE TRACKING:</strong> I tracked the wobble of Mars' spin axis to help scientists learn if Mars has a liquid iron core!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Spirit drive backwards across Mars?<br>
                            A: <em>Because she wanted to look back at all the amazing ground she covered! 🛞❤️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING AT HOME PLATE</h2>
                        <p class="stilton-p">In the harsh Martian winter of 2010, the sun sat too low in the sky to charge my tilted solar arrays.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 LAST TELEMETRY PACKET (SOL 2,210):</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: PIONEER OF MARTIAN SPRINGS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch MER rover wheels rolling across the Martian surface:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ MER EXPLORATION IN 4K ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 0.8rem;">
                            "Spirit drove 7.73 km (4.8 mi) and proved water was once everywhere on Mars."
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SOJOURNER: THE SKATEBOARD ROVER THAT STARTED IT ALL
       ========================================================================= */
    getSojournerSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST WHEELS ON MARS (1997) ★</div>
                        <h1 class="stilton-book-title">
                            SOJOURNER: <br>
                            <span class="stilton-word-wild">THE TINY</span> <br>
                            <span class="stilton-word-hero">GIANT!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Sojourner Rover">
                        </div>
                        <div class="cover-author-seal">ARES VALLIS // SAGAN MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Ares Vallis // July 4, 1997</div>
                        <h2 class="stilton-chapter-head">THE SIZE OF A MICROWAVE OVEN!</h2>
                        <p class="stilton-p">Hello Earth Friend!</p>
                        <p class="stilton-p">
                            Before giant rovers like Curiosity or Perseverance ever existed, there was <strong>ME!</strong> My name is <strong>Sojourner</strong>, named after the heroic civil rights champion Sojourner Truth.
                        </p>
                        <p class="stilton-p">
                            I weighed only 23 pounds (10.5 kg) and was no bigger than a microwave oven! On July 4, 1997, I rolled down two metal ramps and made the first robotic tracks in Martian soil!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">ROLLING DOWN <span class="stilton-word-blast">THE RAMPS!</span></h2>
                        <p class="stilton-p">I hitched a ride to Mars tucked tightly inside the petals of the Mars Pathfinder lander!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... CLAT-TER!*</div>
                        <p class="stilton-p">On Sol 2, my little aluminum studded wheels touched the red sand. I had a top speed of 1 centimeter per second—slower than a garden snail, but unstoppable!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MEETING "BARNACLE BILL"!</h2>
                        <p class="stilton-p">Scientists at JPL named every rock around me after cartoon characters and shapes!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SOJOURNER SNIFFING ROCK "BARNACLE BILL"</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*ZAP! ALPHA PROTON RAY!*</div>
                        <div class="speech-quote-bubble">
                            "I drove up to a rock named 'Barnacle Bill' and pressed my Alpha Proton X-ray Spectrometer against it. It had andesite volcanic rock just like Earth!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">HUGGING <span class="stilton-word-wild">YOGI BEAR!</span></h2>
                        <p class="stilton-p">Next, I rolled over to a giant boulder shaped like a bear's face that scientists named <strong>Yogi Bear</strong>!</p>
                        <div class="comic-sound-burst burst-green">*BUMP! CLIMB!*</div>
                        <p class="stilton-p">My rocker-bogie suspension let my tiny wheels climb over rocks bigger than my entire wheels without tipping over!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">83 DAYS OF MAGIC</h2>
                        <p class="stilton-p">NASA designed me to last just 7 Martian days. I survived for <strong>83 SOLS</strong>—twelve times my planned lifespan!</p>
                        <div class="highlight-callout-box">
                            📸 <strong>550 PHOTOS:</strong> I took 550 photos and analyzed 15 rocks while Pathfinder sent 16,500 images to Earth!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: What did Sojourner say to the rock on Mars?<br>
                            A: <em>"You rock, but I roll!" 🪨🛞</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SLEEPING SCOUT</h2>
                        <p class="stilton-p">On September 27, 1997 (Sol 83), Pathfinder's battery failed. Without my base station to relay messages, I circled Pathfinder in standby mode, waiting for a signal that never came.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST ROVER ON MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE ROVER REVOLUTION</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       VIKING 1 LANDER: THE 6-YEAR NUCLEAR PIONEER (1976)
       ========================================================================= */
    getViking1SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST SUCCESSFUL MARS LANDER (1976) ★</div>
                        <h1 class="stilton-book-title">
                            VIKING 1: <br>
                            <span class="stilton-word-wild">THE NUCLEAR</span> <br>
                            <span class="stilton-word-hero">SENTINEL!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Viking 1 Lander">
                        </div>
                        <div class="cover-author-seal">CHRYSE PLANITIA // MUTCH MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Chryse Planitia // July 20, 1976</div>
                        <h2 class="stilton-chapter-head">TOUCHDOWN ON THE PLAINS OF GOLD!</h2>
                        <p class="stilton-p">Cadets of Earth,</p>
                        <p class="stilton-p">
                            Exactly seven years after Neil Armstrong set foot on the Moon, on <strong>July 20, 1976</strong>, I made history by touching down softly on Chryse Planitia—the Plains of Gold on Mars!
                        </p>
                        <p class="stilton-p">
                            Powered by twin SNAP-19 nuclear radioisotope generators (RTGs), I survived the blistering cold Martian nights for <strong>2,245 sols (over 6 Earth years!)</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">FIRST <span class="stilton-word-blast">COLOR SUNSET</span> ON MARS!</h2>
                        <p class="stilton-p">Just 25 seconds after my footpads touched Mars, my scanner camera began slowly revolving line by line!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... BUZZZ... SCAN!*</div>
                        <p class="stilton-p">Humankind gazed upon the surface of Mars in full color for the very first time—a salmon-pink sky, red soil, and dark volcanic rocks stretching to the horizon!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROBOT SOIL SCOOP</h2>
                        <p class="stilton-p">I extended a 10-foot mechanical scoop arm, dug into the red dirt, and dropped Martian soil into miniature automated biology test chambers!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 VIKING 1 LANDER FOOTPAD & MARTIAN TRENCH</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "We tested for respiration, photosynthesis, and organic molecules. It proved Mars soil is highly oxidizing and completely sterile at the surface!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">ANTENNA COMMAND</span> ACCIDENT</h2>
                        <p class="stilton-p">On November 11, 1982, ground controllers sent an uplink software command designed to modify battery-charging operations.</p>
                        <div class="comic-sound-burst burst-red">*STATIC... SILENCE...*</div>
                        <p class="stilton-p">Inadvertently, the command sequence overwrote memory addresses containing the high-gain antenna pointing parameters! The antenna pointed away from Earth, interrupting communications.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">6 YEARS OF LEGENDARY SCIENCE</h2>
                        <p class="stilton-p">NASA attempted for months to re-establish contact, but Viking 1 had already completed over 2,245 sols of daily weather logs, atmospheric analysis, and surface imaging!</p>
                        <div class="highlight-callout-box">
                            🏆 <strong>MUTCH MEMORIAL:</strong> NASA officially designated the lander as the <em>Thomas A. Mutch Memorial Station</em>.
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Viking 1 bring a radioisotope generator to Mars?<br>
                            A: <em>Because Martian winter is way too cold without atomic heat! ⚛️❄️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">SILENT ACROSS THE PLAINS</h2>
                        <p class="stilton-p">Viking 1 proved that a lander could survive years in the hostile Martian desert, paving the path for every modern rover!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST EXTENDED MARS EXPEDITION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ HISTORIC LEGACY</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SURVEYOR 3 & 6: THE MOON HOPPERS & APOLLO 12'S VISITOR
       ========================================================================= */
    getSurveyorSpreadData(p, craft) {
        const isSurveyor3 = craft.id === 'surveyor-3';
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${isSurveyor3 ? 'APOLLO 12 VISITED ME!' : 'FIRST OFF-WORLD HOPPER!'} ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-wild">THE LUNAR</span> <br>
                            <span class="stilton-word-hero">PATHFINDER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">${isSurveyor3 ? 'OCEAN OF STORMS // APRIL 1967' : 'SINUS MEDII // NOVEMBER 1967'}</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'THE ROBOT THAT ASTRONAUTS VISITED!' : 'THE FIRST ROBOT TO JUMP ON THE MOON!'}</h2>
                        <p class="stilton-p">Cadet Explorer,</p>
                        <p class="stilton-p">
                            Before astronauts ever set foot on the Moon, scientists were terrified that the lunar surface was covered in deep dust quicksand that would swallow spacecraft whole!
                        </p>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'I proved the lunar soil was solid, dug trenches with my robotic arm, and two years later in 1969, Apollo 12 astronauts walked right up to me!' :
                                'I proved the lunar soil was strong, and on November 17, 1967, I fired my rocket engines again and hopped 2.5 meters across the Moon—the first controlled liftoff from another celestial body!'}
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'DIGGING THE FIRST MOON TRENCH' : 'THE 2.5-METER ROCKET HOP!'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'Using a miniature scoop on an accordion scissor-arm, I dug four trenches into the Moon down to 17.5 cm deep! The soil held its shape like damp beach sand.' :
                                'After landing in Sinus Medii and taking 30,000 photos, NASA wanted to test launching from the lunar surface. On Nov 17, they reignited my vernier engines for 2.5 seconds!'}
                        </p>
                        <div class="comic-sound-burst burst-orange">${isSurveyor3 ? '*SCRAPE... SCOOP... CLACK!*' : '*WHOOOOSH... BOING!*'}</div>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'My soil tests proved to NASA that human Apollo astronauts could safely walk on the lunar surface without sinking!' :
                                'I lifted 3 meters into the sky, moved 2.5 meters to the side, and touched down softly on my landing pads!'}
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'APOLLO 12 SAYS HELLO!' : 'SURFACE COMPOSITION DISCOVERED'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'In November 1969, Apollo 12 Commander Pete Conrad and LMP Alan Bean landed Lunar Module Intrepid just 160 meters from me and walked right over!' :
                                'My alpha-scattering spectrometer analyzed the chemical composition of Sinus Medii basalt rock, confirming lunar mare rock is rich in basaltic titanium and iron!'}
                        </p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${isSurveyor3 ? 'APOLLO 12 ASTRONAUT EXAMINING SURVEYOR 3' : 'SURVEYOR 6 LUNAR SURFACE MOSAIC'}</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "${isSurveyor3 ?
                                'Astronauts unbolted my TV camera and soil scoop and flew them back to Earth in their command module!' :
                                'I proved spacecraft can lift off from the Moon and return home!'}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">SURVIVING THE <span class="stilton-word-wild">LUNAR NIGHT</span></h2>
                        <p class="stilton-p">The Moon's night lasts 14 Earth days, with temperatures plummeting down to -250°F (-157°C)!</p>
                        <div class="comic-sound-burst burst-cyan">*FREEZE... BRRRRR!*</div>
                        <p class="stilton-p">Without heaters or atmosphere, our solar batteries froze into icy slumber once the sun set behind the lunar horizon.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">PRECISION RECONNAISSANCE</h2>
                        <div class="highlight-callout-box">
                            📐 <strong>LROC MEASUREMENTS:</strong> Lunar Reconnaissance Orbiter imaged Surveyor 3 with an uncertainty of ±2.6 m, and Surveyor 6 with an uncertainty of ±6.7 m!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why was Surveyor 6 the greatest basketball player on the Moon?<br>
                            A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🏀</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING UNDER THE STARS</h2>
                        <p class="stilton-p">The Surveyor program was 100% vital to landing humans on the Moon. Without our scouts, Apollo could never have landed!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LUNAR RECONNAISSANCE PIONEER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       APOLLO 11 LRRR: THE 55-YEAR TIMELESS LASER MIRROR
       ========================================================================= */
    getApollo11LRRRSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ACTIVE EXPERIMENT SINCE 1969! ★</div>
                        <h1 class="stilton-book-title">
                            APOLLO 11 <br>
                            <span class="stilton-word-wild">LASER</span> <br>
                            <span class="stilton-word-hero">MIRRORS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Apollo 11 LRRR">
                        </div>
                        <div class="cover-author-seal">TRANQUILITY BASE // CONTINUOUSLY OPERATIONAL</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Tranquility Base // July 21, 1969</div>
                        <h2 class="stilton-chapter-head">THE EXPERIMENT THAT NEVER DIED!</h2>
                        <p class="stilton-p">Cadet Scientist,</p>
                        <p class="stilton-p">
                            Did you know that there is a piece of Apollo 11 hardware on the Moon that is <strong>STILL IN DAILY USE TODAY</strong> in 2026?
                        </p>
                        <p class="stilton-p">
                            It has no batteries, no wires, and consumes zero electricity! It is the <strong>Lunar Laser Ranging Retroreflector (LRRR)</strong>—an array of 100 pure quartz corner-cube prisms placed by Neil Armstrong and Buzz Aldrin!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">CORNER-CUBE <span class="stilton-word-blast">SUPER REFLECTORS!</span></h2>
                        <p class="stilton-p">How does a bicycle reflector work? If you shine a flashlight at it, the light bounces straight back to your eye!</p>
                        <div class="comic-sound-burst burst-orange">*PEW! PEW! REFLECT!*</div>
                        <p class="stilton-p">Each of my 100 quartz prisms is cut with three mutually perpendicular mirrors. No matter what angle an Earth laser hits me from, the photons bounce 180° directly back to the observatory telescope on Earth!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">FIRING LASERS ACROSS SPACE!</h2>
                        <p class="stilton-p">Observatories in Texas, Hawaii, and France fire giant pulses of green laser light straight at Tranquility Base!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 100 QUARTZ CORNER-CUBE PRISMS AT TRANQUILITY BASE</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "The round-trip travel time is exactly 2.5 seconds! By timing the photons down to picoseconds, scientists measure the Moon's distance to millimeter accuracy!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE MOON IS <span class="stilton-word-wild">DRIFTING AWAY!</span></h2>
                        <p class="stilton-p">Thanks to our 55+ years of daily laser measurements, scientists discovered something mind-boggling:</p>
                        <div class="highlight-callout-box">
                            🌊 <strong>3.8 CENTIMETERS PER YEAR:</strong> Tidal friction with Earth's oceans is causing the Moon to slowly spiral outward by 3.8 cm every year—about the speed your fingernails grow!
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            We also tested Einstein's Theory of General Relativity with unprecedented precision!
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">WHY PSEP STOPPED & LRRR SURVIVED</h2>
                        <p class="stilton-p">Apollo 11's Early Surface Package had two parts: PSEP (seismometer) and LRRR (laser mirrors). PSEP suffered a command decoder failure on Aug 27, 1969.</p>
                        <div class="highlight-callout-box">
                            ✨ <strong>PASSIVE GENIUS:</strong> Because LRRR has zero moving parts or computer chips, it can continue operating for hundreds of years!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>
                            A: <em>To make sure the Moon always looked out of this world! 🪞🌕</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">55 YEARS AND COUNTING</h2>
                        <p class="stilton-p">In 2026, lasers from Apache Point Observatory in New Mexico still reflect off my quartz faces every single clear night.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 CONTINUOUS RETROREFLECTION:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LONGEST RUNNING APOLLO EXPERIMENT</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ TIMELESS SCIENCE</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getApollo11SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ HISTORIC FIRST MOON LANDING ★</div>
                        <h1 class="stilton-book-title">
                            THE <span class="stilton-word-hero">EAGLE</span> <br>
                            HAS <span class="stilton-word-wild">LANDED!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="assets/renders/apollo_lm.png" class="cover-rover-img" alt="Apollo 11 Lunar Module">
                        </div>
                        <div class="cover-author-seal">OFFICIAL NASA APOLLO 11 STORYBOOK</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Sea of Tranquility // July 20, 1969</div>
                        <h2 class="stilton-chapter-head">A PHONE CALL FROM THE MOON!</h2>
                        <p class="stilton-p">Dear Earthling,</p>
                        <p class="stilton-p">
                            I am the bottom half of the <span class="stilton-word-hero">Apollo 11 Eagle</span>. 
                            My golden foil legs are still sitting in the fine gray dust of the <span class="stilton-word-moon">MOON</span>, right where Neil Armstrong and Buzz Aldrin parked me!
                        </p>
                        <p class="stilton-p">
                            Did you know we almost crashed into a giant crater full of car-sized boulders with only <strong>30 SECONDS</strong> of fuel remaining?
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">30 SECONDS <span class="stilton-word-blast">OF FUEL!</span></h2>
                        <p class="stilton-p">Looking out the window, Neil saw the computer steering us straight into a crater filled with car-sized boulders!</p>
                        <div class="comic-sound-burst burst-red">*1202 COMPUTER ALARM!*</div>
                        <p class="stilton-p">Neil grabbed manual joystick control! He flew over the rocks while mission control counted down: <em>"60 seconds... 30 seconds..."</em> Neil's heart was pounding at 156 beats per minute!</p>
                        <div class="doodle-note-sticky">
                            🚨 <strong>GO ON 1202:</strong> 26-year-old computer engineer Steve Bales in Houston realized the radar was overloading the computer memory and shouted: <em>"WE'RE GO!"</em>
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">CONTACT LIGHT!</h2>
                        <p class="stilton-p">67-inch probe wires dangling from my footpads touched the lunar dust, kicking up a golden sheet like a snowstorm!</p>

                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 APOLLO 11 LM DESCENT STAGE IN TRANQUILITY</span>
                        </div>

                        <div class="comic-sound-burst burst-cyan">*WHISPER... ENGINE STOP!*</div>

                        <div class="speech-quote-bubble">
                            "Houston, Tranquility Base here. The Eagle has landed!" Back on Earth, Charlie Duke sighed: "You got a bunch of guys about to turn blue. We're breathing again!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">ONE <span class="stilton-word-wild">GIANT LEAP!</span></h2>
                        <p class="stilton-p">Neil Armstrong stepped down my nine ladder rungs. At the bottom, he pressed his boot into the soft moon soil.</p>
                        <div class="speech-quote-bubble">"That's one small step for man, one giant leap for mankind."</div>
                        <p class="stilton-p">Because the Moon has no wind or rain, Neil's bootprint is still preserved there today, exactly as crisp as 1969!</p>
                        
                        <div class="highlight-callout-box" style="margin-top: 6px; border-color: #ef4444;">
                            🖊️ <strong>THE FELT-TIP PEN FIX:</strong><br>
                            Buzz's suit accidentally snapped off the engine switch! To liftoff back to Earth, Buzz jammed an ordinary felt-tip pen into the circuit breaker to ignite the engine!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">THE PLAQUE & THE LASER MIRROR</h2>
                        <p class="stilton-p">When the astronauts blasted back to Earth in the upper cabin, they left me behind as their launchpad.</p>
                        <div class="highlight-callout-box">
                            📜 <strong>WORDS WRITTEN ON MY LEG:</strong><br>
                            <em>"Here men from the planet Earth first set foot upon the Moon. July 1969 A.D. We came in peace for all mankind."</em>
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            Just 14 meters away, Buzz Aldrin set down the <strong>LRRR (Laser Retroreflector)</strong>—an array of 100 quartz mirrors that still bounces Earth-fired laser pulses back today, proving the Moon is drifting away at 3.8 cm per year!
                        </p>
                        <div class="doodle-note-sticky" style="margin-top: 6px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Neil Armstrong walk carefully on the Moon?<br>
                            A: <em>Because he didn't want to make a crater-sized misstep!</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">ETERNAL GUARDIAN</h2>
                        <p class="stilton-p">For over 50 years, the Sun rises and sets over my golden foil frame every 28 Earth days.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TRANQUILITY BASE ARTIFACT #1:</div>
                            <div class="famous-quote-large">"We came in peace for all mankind."</div>
                        </div>

                        <div class="highlight-callout-box" style="margin-top: 10px; border-color: #ffe600;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did the Moon need 100 glass mirrors placed by Apollo 11?<br>
                            A: <em>Because it wanted to make sure it looked out of this world!</em>
                        </div>

                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: HUMANITY'S FIRST LUNAR BASE</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K CINEMATIC RECONSTRUCTION!</h2>
                        <p class="stilton-p" style="font-size: 0.95rem;">View the historic Apollo 11 descent stage resting in Tranquility:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/apollo_11_eagle.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ APOLLO 11 EAGLE 4K FLY-AROUND ✦</div>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getSpiritSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TWIN SISTER TO OPPORTUNITY ★</div>
                        <h1 class="stilton-book-title">
                            SPIRIT: THE <br>
                            <span class="stilton-word-wild">UNSTOPPABLE</span> <br>
                            <span class="stilton-word-hero">EXPLORER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Spirit Rover">
                        </div>
                        <div class="cover-author-seal">GUSEV CRATER EXPEDITION LOG</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Gusev Crater // Sol 001</div>
                        <h2 class="stilton-chapter-head">MEET OPPORTUNITY'S TWIN SISTER!</h2>
                        <p class="stilton-p">Greetings Earth Cadet!</p>
                        <p class="stilton-p">
                            I am <strong>Spirit (MER-A)</strong>! Three weeks before my twin sister Opportunity bounced into Eagle Crater, I touched down on the other side of Mars inside giant Gusev Crater!
                        </p>
                        <p class="stilton-p">
                            They gave me a 90-day warranty. But I climbed mountains, survived freezing winters, and explored for <strong>2,210 Martian days!</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-blast">BROKEN WHEEL</span> MIRACLE!</h2>
                        <p class="stilton-p">In March 2006, after 779 sols of rugged rock climbing, my front-right wheel motor gave out and locked tight!</p>
                        <div class="comic-sound-burst burst-orange">*SCREEEEEECH!*</div>
                        <p class="stilton-p">Did I give up? No way! NASA flight controllers commanded me to drive backwards, dragging my dead wheel like a garden plow!</p>
                        <div class="doodle-note-sticky">
                            💡 <strong>REVERSE DRIVING:</strong> For the rest of my mission, I drove backwards everywhere!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">ACCIDENTAL PURE SILICA!</h2>
                        <p class="stilton-p">As my dead wheel dragged through the dirt, it sliced open a shallow trench in the ground...</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SPIRIT ROVER'S WHEEL TRENCH UNCOVERS SILICA</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*SPARKLE! SHINE!*</div>
                        <div class="speech-quote-bubble">
                            "Inside the trench was dazzling bright white sand! It was 90% pure silica—the kind made by bubbling hot springs and steam vents! Proof Mars once had habitable hot springs!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">TROY SAND TRAP</span></h2>
                        <p class="stilton-p">In April 2009, near a plateau called 'Home Plate', my wheels broke through a crusty layer of soil into hidden soft sulfate sand!</p>
                        <div class="comic-sound-burst burst-red">*SQUISH! SPIN! STUCK!*</div>
                        <p class="stilton-p">My belly touched the sand. NASA tried for 8 months in sandbox simulators to wiggle me free!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">STATIONARY SCIENCE HERO</h2>
                        <p class="stilton-p">When I couldn't roll anymore, NASA didn't shut me down. They declared me a <strong>Stationary Science Outpost!</strong></p>
                        <div class="highlight-callout-box" style="margin-bottom: 10px;">
                            🌡️ <strong>CORE TRACKING:</strong> I tracked the wobble of Mars' spin axis to help scientists learn if Mars has a liquid iron core!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Spirit drive backwards across Mars?<br>
                            A: <em>Because she wanted to look back at all the amazing ground she covered! 🛞❤️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING AT HOME PLATE</h2>
                        <p class="stilton-p">In the harsh Martian winter of 2010, the sun sat too low in the sky to charge my tilted solar arrays.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 LAST TELEMETRY PACKET (SOL 2,210):</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: PIONEER OF MARTIAN SPRINGS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch MER rover wheels rolling across the Martian surface:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ MER EXPLORATION IN 4K ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 0.8rem;">
                            "Spirit drove 7.73 km (4.8 mi) and proved water was once everywhere on Mars."
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SOJOURNER: THE SKATEBOARD ROVER THAT STARTED IT ALL
       ========================================================================= */
    getSojournerSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST WHEELS ON MARS (1997) ★</div>
                        <h1 class="stilton-book-title">
                            SOJOURNER: <br>
                            <span class="stilton-word-wild">THE TINY</span> <br>
                            <span class="stilton-word-hero">GIANT!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Sojourner Rover">
                        </div>
                        <div class="cover-author-seal">ARES VALLIS // SAGAN MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Ares Vallis // July 4, 1997</div>
                        <h2 class="stilton-chapter-head">THE SIZE OF A MICROWAVE OVEN!</h2>
                        <p class="stilton-p">Hello Earth Friend!</p>
                        <p class="stilton-p">
                            Before giant rovers like Curiosity or Perseverance ever existed, there was <strong>ME!</strong> My name is <strong>Sojourner</strong>, named after the heroic civil rights champion Sojourner Truth.
                        </p>
                        <p class="stilton-p">
                            I weighed only 23 pounds (10.5 kg) and was no bigger than a microwave oven! On July 4, 1997, I rolled down two metal ramps and made the first robotic tracks in Martian soil!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">ROLLING DOWN <span class="stilton-word-blast">THE RAMPS!</span></h2>
                        <p class="stilton-p">I hitched a ride to Mars tucked tightly inside the petals of the Mars Pathfinder lander!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... CLAT-TER!*</div>
                        <p class="stilton-p">On Sol 2, my little aluminum studded wheels touched the red sand. I had a top speed of 1 centimeter per second—slower than a garden snail, but unstoppable!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MEETING "BARNACLE BILL"!</h2>
                        <p class="stilton-p">Scientists at JPL named every rock around me after cartoon characters and shapes!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SOJOURNER SNIFFING ROCK "BARNACLE BILL"</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*ZAP! ALPHA PROTON RAY!*</div>
                        <div class="speech-quote-bubble">
                            "I drove up to a rock named 'Barnacle Bill' and pressed my Alpha Proton X-ray Spectrometer against it. It had andesite volcanic rock just like Earth!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">HUGGING <span class="stilton-word-wild">YOGI BEAR!</span></h2>
                        <p class="stilton-p">Next, I rolled over to a giant boulder shaped like a bear's face that scientists named <strong>Yogi Bear</strong>!</p>
                        <div class="comic-sound-burst burst-green">*BUMP! CLIMB!*</div>
                        <p class="stilton-p">My rocker-bogie suspension let my tiny wheels climb over rocks bigger than my entire wheels without tipping over!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">83 DAYS OF MAGIC</h2>
                        <p class="stilton-p">NASA designed me to last just 7 Martian days. I survived for <strong>83 SOLS</strong>—twelve times my planned lifespan!</p>
                        <div class="highlight-callout-box">
                            📸 <strong>550 PHOTOS:</strong> I took 550 photos and analyzed 15 rocks while Pathfinder sent 16,500 images to Earth!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: What did Sojourner say to the rock on Mars?<br>
                            A: <em>"You rock, but I roll!" 🪨🛞</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SLEEPING SCOUT</h2>
                        <p class="stilton-p">On September 27, 1997 (Sol 83), Pathfinder's battery failed. Without my base station to relay messages, I circled Pathfinder in standby mode, waiting for a signal that never came.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST ROVER ON MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE ROVER REVOLUTION</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       VIKING 1 LANDER: THE 6-YEAR NUCLEAR PIONEER (1976)
       ========================================================================= */
    getViking1SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST SUCCESSFUL MARS LANDER (1976) ★</div>
                        <h1 class="stilton-book-title">
                            VIKING 1: <br>
                            <span class="stilton-word-wild">THE NUCLEAR</span> <br>
                            <span class="stilton-word-hero">SENTINEL!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Viking 1 Lander">
                        </div>
                        <div class="cover-author-seal">CHRYSE PLANITIA // MUTCH MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Chryse Planitia // July 20, 1976</div>
                        <h2 class="stilton-chapter-head">TOUCHDOWN ON THE PLAINS OF GOLD!</h2>
                        <p class="stilton-p">Cadets of Earth,</p>
                        <p class="stilton-p">
                            Exactly seven years after Neil Armstrong set foot on the Moon, on <strong>July 20, 1976</strong>, I made history by touching down softly on Chryse Planitia—the Plains of Gold on Mars!
                        </p>
                        <p class="stilton-p">
                            Powered by twin SNAP-19 nuclear radioisotope generators (RTGs), I survived the blistering cold Martian nights for <strong>2,245 sols (over 6 Earth years!)</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">FIRST <span class="stilton-word-blast">COLOR SUNSET</span> ON MARS!</h2>
                        <p class="stilton-p">Just 25 seconds after my footpads touched Mars, my scanner camera began slowly revolving line by line!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... BUZZZ... SCAN!*</div>
                        <p class="stilton-p">Humankind gazed upon the surface of Mars in full color for the very first time—a salmon-pink sky, red soil, and dark volcanic rocks stretching to the horizon!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROBOT SOIL SCOOP</h2>
                        <p class="stilton-p">I extended a 10-foot mechanical scoop arm, dug into the red dirt, and dropped Martian soil into miniature automated biology test chambers!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 VIKING 1 LANDER FOOTPAD & MARTIAN TRENCH</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "We tested for respiration, photosynthesis, and organic molecules. It proved Mars soil is highly oxidizing and completely sterile at the surface!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">ANTENNA COMMAND</span> ACCIDENT</h2>
                        <p class="stilton-p">On November 11, 1982, ground controllers sent an uplink software command designed to modify battery-charging operations.</p>
                        <div class="comic-sound-burst burst-red">*STATIC... SILENCE...*</div>
                        <p class="stilton-p">Inadvertently, the command sequence overwrote memory addresses containing the high-gain antenna pointing parameters! The antenna pointed away from Earth, interrupting communications.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">6 YEARS OF LEGENDARY SCIENCE</h2>
                        <p class="stilton-p">NASA attempted for months to re-establish contact, but Viking 1 had already completed over 2,245 sols of daily weather logs, atmospheric analysis, and surface imaging!</p>
                        <div class="highlight-callout-box">
                            🏆 <strong>MUTCH MEMORIAL:</strong> NASA officially designated the lander as the <em>Thomas A. Mutch Memorial Station</em>.
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Viking 1 bring a radioisotope generator to Mars?<br>
                            A: <em>Because Martian winter is way too cold without atomic heat! ⚛️❄️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">SILENT ACROSS THE PLAINS</h2>
                        <p class="stilton-p">Viking 1 proved that a lander could survive years in the hostile Martian desert, paving the path for every modern rover!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST EXTENDED MARS EXPEDITION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ HISTORIC LEGACY</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SURVEYOR 3 & 6: THE MOON HOPPERS & APOLLO 12'S VISITOR
       ========================================================================= */
    getSurveyorSpreadData(p, craft) {
        const isSurveyor3 = craft.id === 'surveyor-3';
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${isSurveyor3 ? 'APOLLO 12 VISITED ME!' : 'FIRST OFF-WORLD HOPPER!'} ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-wild">THE LUNAR</span> <br>
                            <span class="stilton-word-hero">PATHFINDER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">${isSurveyor3 ? 'OCEAN OF STORMS // APRIL 1967' : 'SINUS MEDII // NOVEMBER 1967'}</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'THE ROBOT THAT ASTRONAUTS VISITED!' : 'THE FIRST ROBOT TO JUMP ON THE MOON!'}</h2>
                        <p class="stilton-p">Cadet Explorer,</p>
                        <p class="stilton-p">
                            Before astronauts ever set foot on the Moon, scientists were terrified that the lunar surface was covered in deep dust quicksand that would swallow spacecraft whole!
                        </p>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'I proved the lunar soil was solid, dug trenches with my robotic arm, and two years later in 1969, Apollo 12 astronauts walked right up to me!' :
                                'I proved the lunar soil was strong, and on November 17, 1967, I fired my rocket engines again and hopped 2.5 meters across the Moon—the first controlled liftoff from another celestial body!'}
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'DIGGING THE FIRST MOON TRENCH' : 'THE 2.5-METER ROCKET HOP!'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'Using a miniature scoop on an accordion scissor-arm, I dug four trenches into the Moon down to 17.5 cm deep! The soil held its shape like damp beach sand.' :
                                'After landing in Sinus Medii and taking 30,000 photos, NASA wanted to test launching from the lunar surface. On Nov 17, they reignited my vernier engines for 2.5 seconds!'}
                        </p>
                        <div class="comic-sound-burst burst-orange">${isSurveyor3 ? '*SCRAPE... SCOOP... CLACK!*' : '*WHOOOOSH... BOING!*'}</div>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'My soil tests proved to NASA that human Apollo astronauts could safely walk on the lunar surface without sinking!' :
                                'I lifted 3 meters into the sky, moved 2.5 meters to the side, and touched down softly on my landing pads!'}
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'APOLLO 12 SAYS HELLO!' : 'SURFACE COMPOSITION DISCOVERED'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'In November 1969, Apollo 12 Commander Pete Conrad and LMP Alan Bean landed Lunar Module Intrepid just 160 meters from me and walked right over!' :
                                'My alpha-scattering spectrometer analyzed the chemical composition of Sinus Medii basalt rock, confirming lunar mare rock is rich in basaltic titanium and iron!'}
                        </p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${isSurveyor3 ? 'APOLLO 12 ASTRONAUT EXAMINING SURVEYOR 3' : 'SURVEYOR 6 LUNAR SURFACE MOSAIC'}</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "${isSurveyor3 ?
                                'Astronauts unbolted my TV camera and soil scoop and flew them back to Earth in their command module!' :
                                'I proved spacecraft can lift off from the Moon and return home!'}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">SURVIVING THE <span class="stilton-word-wild">LUNAR NIGHT</span></h2>
                        <p class="stilton-p">The Moon's night lasts 14 Earth days, with temperatures plummeting down to -250°F (-157°C)!</p>
                        <div class="comic-sound-burst burst-cyan">*FREEZE... BRRRRR!*</div>
                        <p class="stilton-p">Without heaters or atmosphere, our solar batteries froze into icy slumber once the sun set behind the lunar horizon.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">PRECISION RECONNAISSANCE</h2>
                        <div class="highlight-callout-box">
                            📐 <strong>LROC MEASUREMENTS:</strong> Lunar Reconnaissance Orbiter imaged Surveyor 3 with an uncertainty of ±2.6 m, and Surveyor 6 with an uncertainty of ±6.7 m!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why was Surveyor 6 the greatest basketball player on the Moon?<br>
                            A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🏀</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING UNDER THE STARS</h2>
                        <p class="stilton-p">The Surveyor program was 100% vital to landing humans on the Moon. Without our scouts, Apollo could never have landed!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LUNAR RECONNAISSANCE PIONEER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       APOLLO 11 LRRR: THE 55-YEAR TIMELESS LASER MIRROR
       ========================================================================= */
    getApollo11LRRRSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ACTIVE EXPERIMENT SINCE 1969! ★</div>
                        <h1 class="stilton-book-title">
                            APOLLO 11 <br>
                            <span class="stilton-word-wild">LASER</span> <br>
                            <span class="stilton-word-hero">MIRRORS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Apollo 11 LRRR">
                        </div>
                        <div class="cover-author-seal">TRANQUILITY BASE // CONTINUOUSLY OPERATIONAL</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Tranquility Base // July 21, 1969</div>
                        <h2 class="stilton-chapter-head">THE EXPERIMENT THAT NEVER DIED!</h2>
                        <p class="stilton-p">Cadet Scientist,</p>
                        <p class="stilton-p">
                            Did you know that there is a piece of Apollo 11 hardware on the Moon that is <strong>STILL IN DAILY USE TODAY</strong> in 2026?
                        </p>
                        <p class="stilton-p">
                            It has no batteries, no wires, and consumes zero electricity! It is the <strong>Lunar Laser Ranging Retroreflector (LRRR)</strong>—an array of 100 pure quartz corner-cube prisms placed by Neil Armstrong and Buzz Aldrin!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">CORNER-CUBE <span class="stilton-word-blast">SUPER REFLECTORS!</span></h2>
                        <p class="stilton-p">How does a bicycle reflector work? If you shine a flashlight at it, the light bounces straight back to your eye!</p>
                        <div class="comic-sound-burst burst-orange">*PEW! PEW! REFLECT!*</div>
                        <p class="stilton-p">Each of my 100 quartz prisms is cut with three mutually perpendicular mirrors. No matter what angle an Earth laser hits me from, the photons bounce 180° directly back to the observatory telescope on Earth!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">FIRING LASERS ACROSS SPACE!</h2>
                        <p class="stilton-p">Observatories in Texas, Hawaii, and France fire giant pulses of green laser light straight at Tranquility Base!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 100 QUARTZ CORNER-CUBE PRISMS AT TRANQUILITY BASE</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "The round-trip travel time is exactly 2.5 seconds! By timing the photons down to picoseconds, scientists measure the Moon's distance to millimeter accuracy!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE MOON IS <span class="stilton-word-wild">DRIFTING AWAY!</span></h2>
                        <p class="stilton-p">Thanks to our 55+ years of daily laser measurements, scientists discovered something mind-boggling:</p>
                        <div class="highlight-callout-box">
                            🌊 <strong>3.8 CENTIMETERS PER YEAR:</strong> Tidal friction with Earth's oceans is causing the Moon to slowly spiral outward by 3.8 cm every year—about the speed your fingernails grow!
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            We also tested Einstein's Theory of General Relativity with unprecedented precision!
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">WHY PSEP STOPPED & LRRR SURVIVED</h2>
                        <p class="stilton-p">Apollo 11's Early Surface Package had two parts: PSEP (seismometer) and LRRR (laser mirrors). PSEP suffered a command decoder failure on Aug 27, 1969.</p>
                        <div class="highlight-callout-box">
                            ✨ <strong>PASSIVE GENIUS:</strong> Because LRRR has zero moving parts or computer chips, it can continue operating for hundreds of years!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>
                            A: <em>To make sure the Moon always looked out of this world! 🪞🌕</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">55 YEARS AND COUNTING</h2>
                        <p class="stilton-p">In 2026, lasers from Apache Point Observatory in New Mexico still reflect off my quartz faces every single clear night.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 CONTINUOUS RETROREFLECTION:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LONGEST RUNNING APOLLO EXPERIMENT</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ TIMELESS SCIENCE</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getLunarRoverSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ THE MOON SPORTS CAR ★</div>
                        <h1 class="stilton-book-title">
                            THE WILD <br>
                            <span class="stilton-word-wild">MOON BUGGY</span> <br>
                            <span class="stilton-word-hero">GRAND PRIX!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Lunar Rover">
                        </div>
                        <div class="cover-author-seal">FIRST OFF-ROAD CAR DRIVEN ON ANOTHER WORLD</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Hadley-Apennine // July 1971</div>
                        <h2 class="stilton-chapter-head">WHO WANTS TO GO FOR A DRIVE?!</h2>
                        <p class="stilton-p">Hey Speedsters!</p>
                        <p class="stilton-p">
                            I am the <span class="stilton-word-hero">Lunar Roving Vehicle (LRV)</span>—the original Moon Buggy!
                        </p>
                        <p class="stilton-p">I had no steering wheel (I used an airplane joystick!), four electric motors in my wheels, and piano-wire mesh tires!</p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">AN <span class="stilton-word-blast">ORIGAMI CAR!</span></h2>
                        <p class="stilton-p">How do you fit a full-sized 10-foot dune buggy into a tiny lunar module? You fold it up like a lawn chair!</p>
                        <div class="comic-sound-burst burst-orange">*CLICK... SNAP... BOING!*</div>
                        <p class="stilton-p">The astronauts pulled two nylon lanyards. Pulleys and springs kicked into action, and my four wheels snapped straight into place!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROOSTER TAIL DUST!</h2>
                        <p class="stilton-p">Driving in 1/6th gravity was pure joy! My top speed was 11 km/h, but it felt like racing at 100 mph!</p>

                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 APOLLO 15 ASTRONAUT & LRV ON THE MOON</span>
                        </div>

                        <div class="comic-sound-burst burst-cyan">*DRIFT! SKID!*</div>

                        <div class="speech-quote-bubble">
                            "Whenever Commander Dave Scott stomped on the throttle, my mesh wheels kicked up giant rooster tails into the black sky!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">DUCT TAPE</span> FIX!</h2>
                        <p class="stilton-p">On Apollo 17, Gene Cernan accidentally bumped the right rear fender with a hammer handle and snapped it off!</p>
                        <div class="comic-sound-burst burst-red">*CRACK! OOPS!*</div>
                        <p class="stilton-p">Moon dust rained down on their spacesuit helmets. Back on Earth, engineers devised a genius fix using: <strong>4 Laminated Maps + Gray Duct Tape!</strong></p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">HADLEY RILLE GRAND CANYON</h2>
                        <p class="stilton-p">Thanks to that duct-tape fender, they drove me all the way to the edge of Hadley Rille—a giant 1,000-foot deep lunar canyon!</p>
                        <div class="doodle-note-sticky">💡 <strong>Total Distance:</strong> The buggies drove over 90 kilometers across Apollo 15, 16, and 17!</div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">PARKED FOREVER</h2>
                        <p class="stilton-p">At the end of the mission, they parked me 100 meters away with my TV camera pointing right at the lunar module to broadcast liftoff!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 HADLEY BASE ODOMETER:</div>
                            <div class="famous-quote-large">"The finest electric buggy ever built."</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST OFF-WORLD SPORTS CAR</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K CINEMATIC FLY-AROUND!</h2>
                        <p class="stilton-p" style="font-size: 0.95rem;">Watch the legendary Lunar Rover parked on the Moon in 4K:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/apollo_lunar_rover.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ APOLLO LUNAR ROVER 4K FLY-AROUND ✦</div>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getSpiritSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TWIN SISTER TO OPPORTUNITY ★</div>
                        <h1 class="stilton-book-title">
                            SPIRIT: THE <br>
                            <span class="stilton-word-wild">UNSTOPPABLE</span> <br>
                            <span class="stilton-word-hero">EXPLORER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Spirit Rover">
                        </div>
                        <div class="cover-author-seal">GUSEV CRATER EXPEDITION LOG</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Gusev Crater // Sol 001</div>
                        <h2 class="stilton-chapter-head">MEET OPPORTUNITY'S TWIN SISTER!</h2>
                        <p class="stilton-p">Greetings Earth Cadet!</p>
                        <p class="stilton-p">
                            I am <strong>Spirit (MER-A)</strong>! Three weeks before my twin sister Opportunity bounced into Eagle Crater, I touched down on the other side of Mars inside giant Gusev Crater!
                        </p>
                        <p class="stilton-p">
                            They gave me a 90-day warranty. But I climbed mountains, survived freezing winters, and explored for <strong>2,210 Martian days!</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-blast">BROKEN WHEEL</span> MIRACLE!</h2>
                        <p class="stilton-p">In March 2006, after 779 sols of rugged rock climbing, my front-right wheel motor gave out and locked tight!</p>
                        <div class="comic-sound-burst burst-orange">*SCREEEEEECH!*</div>
                        <p class="stilton-p">Did I give up? No way! NASA flight controllers commanded me to drive backwards, dragging my dead wheel like a garden plow!</p>
                        <div class="doodle-note-sticky">
                            💡 <strong>REVERSE DRIVING:</strong> For the rest of my mission, I drove backwards everywhere!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">ACCIDENTAL PURE SILICA!</h2>
                        <p class="stilton-p">As my dead wheel dragged through the dirt, it sliced open a shallow trench in the ground...</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SPIRIT ROVER'S WHEEL TRENCH UNCOVERS SILICA</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*SPARKLE! SHINE!*</div>
                        <div class="speech-quote-bubble">
                            "Inside the trench was dazzling bright white sand! It was 90% pure silica—the kind made by bubbling hot springs and steam vents! Proof Mars once had habitable hot springs!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">TROY SAND TRAP</span></h2>
                        <p class="stilton-p">In April 2009, near a plateau called 'Home Plate', my wheels broke through a crusty layer of soil into hidden soft sulfate sand!</p>
                        <div class="comic-sound-burst burst-red">*SQUISH! SPIN! STUCK!*</div>
                        <p class="stilton-p">My belly touched the sand. NASA tried for 8 months in sandbox simulators to wiggle me free!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">STATIONARY SCIENCE HERO</h2>
                        <p class="stilton-p">When I couldn't roll anymore, NASA didn't shut me down. They declared me a <strong>Stationary Science Outpost!</strong></p>
                        <div class="highlight-callout-box" style="margin-bottom: 10px;">
                            🌡️ <strong>CORE TRACKING:</strong> I tracked the wobble of Mars' spin axis to help scientists learn if Mars has a liquid iron core!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Spirit drive backwards across Mars?<br>
                            A: <em>Because she wanted to look back at all the amazing ground she covered! 🛞❤️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING AT HOME PLATE</h2>
                        <p class="stilton-p">In the harsh Martian winter of 2010, the sun sat too low in the sky to charge my tilted solar arrays.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 LAST TELEMETRY PACKET (SOL 2,210):</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: PIONEER OF MARTIAN SPRINGS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch MER rover wheels rolling across the Martian surface:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ MER EXPLORATION IN 4K ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 0.8rem;">
                            "Spirit drove 7.73 km (4.8 mi) and proved water was once everywhere on Mars."
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SOJOURNER: THE SKATEBOARD ROVER THAT STARTED IT ALL
       ========================================================================= */
    getSojournerSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST WHEELS ON MARS (1997) ★</div>
                        <h1 class="stilton-book-title">
                            SOJOURNER: <br>
                            <span class="stilton-word-wild">THE TINY</span> <br>
                            <span class="stilton-word-hero">GIANT!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Sojourner Rover">
                        </div>
                        <div class="cover-author-seal">ARES VALLIS // SAGAN MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Ares Vallis // July 4, 1997</div>
                        <h2 class="stilton-chapter-head">THE SIZE OF A MICROWAVE OVEN!</h2>
                        <p class="stilton-p">Hello Earth Friend!</p>
                        <p class="stilton-p">
                            Before giant rovers like Curiosity or Perseverance ever existed, there was <strong>ME!</strong> My name is <strong>Sojourner</strong>, named after the heroic civil rights champion Sojourner Truth.
                        </p>
                        <p class="stilton-p">
                            I weighed only 23 pounds (10.5 kg) and was no bigger than a microwave oven! On July 4, 1997, I rolled down two metal ramps and made the first robotic tracks in Martian soil!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">ROLLING DOWN <span class="stilton-word-blast">THE RAMPS!</span></h2>
                        <p class="stilton-p">I hitched a ride to Mars tucked tightly inside the petals of the Mars Pathfinder lander!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... CLAT-TER!*</div>
                        <p class="stilton-p">On Sol 2, my little aluminum studded wheels touched the red sand. I had a top speed of 1 centimeter per second—slower than a garden snail, but unstoppable!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MEETING "BARNACLE BILL"!</h2>
                        <p class="stilton-p">Scientists at JPL named every rock around me after cartoon characters and shapes!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SOJOURNER SNIFFING ROCK "BARNACLE BILL"</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*ZAP! ALPHA PROTON RAY!*</div>
                        <div class="speech-quote-bubble">
                            "I drove up to a rock named 'Barnacle Bill' and pressed my Alpha Proton X-ray Spectrometer against it. It had andesite volcanic rock just like Earth!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">HUGGING <span class="stilton-word-wild">YOGI BEAR!</span></h2>
                        <p class="stilton-p">Next, I rolled over to a giant boulder shaped like a bear's face that scientists named <strong>Yogi Bear</strong>!</p>
                        <div class="comic-sound-burst burst-green">*BUMP! CLIMB!*</div>
                        <p class="stilton-p">My rocker-bogie suspension let my tiny wheels climb over rocks bigger than my entire wheels without tipping over!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">83 DAYS OF MAGIC</h2>
                        <p class="stilton-p">NASA designed me to last just 7 Martian days. I survived for <strong>83 SOLS</strong>—twelve times my planned lifespan!</p>
                        <div class="highlight-callout-box">
                            📸 <strong>550 PHOTOS:</strong> I took 550 photos and analyzed 15 rocks while Pathfinder sent 16,500 images to Earth!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: What did Sojourner say to the rock on Mars?<br>
                            A: <em>"You rock, but I roll!" 🪨🛞</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SLEEPING SCOUT</h2>
                        <p class="stilton-p">On September 27, 1997 (Sol 83), Pathfinder's battery failed. Without my base station to relay messages, I circled Pathfinder in standby mode, waiting for a signal that never came.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST ROVER ON MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE ROVER REVOLUTION</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       VIKING 1 LANDER: THE 6-YEAR NUCLEAR PIONEER (1976)
       ========================================================================= */
    getViking1SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST SUCCESSFUL MARS LANDER (1976) ★</div>
                        <h1 class="stilton-book-title">
                            VIKING 1: <br>
                            <span class="stilton-word-wild">THE NUCLEAR</span> <br>
                            <span class="stilton-word-hero">SENTINEL!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Viking 1 Lander">
                        </div>
                        <div class="cover-author-seal">CHRYSE PLANITIA // MUTCH MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Chryse Planitia // July 20, 1976</div>
                        <h2 class="stilton-chapter-head">TOUCHDOWN ON THE PLAINS OF GOLD!</h2>
                        <p class="stilton-p">Cadets of Earth,</p>
                        <p class="stilton-p">
                            Exactly seven years after Neil Armstrong set foot on the Moon, on <strong>July 20, 1976</strong>, I made history by touching down softly on Chryse Planitia—the Plains of Gold on Mars!
                        </p>
                        <p class="stilton-p">
                            Powered by twin SNAP-19 nuclear radioisotope generators (RTGs), I survived the blistering cold Martian nights for <strong>2,245 sols (over 6 Earth years!)</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">FIRST <span class="stilton-word-blast">COLOR SUNSET</span> ON MARS!</h2>
                        <p class="stilton-p">Just 25 seconds after my footpads touched Mars, my scanner camera began slowly revolving line by line!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... BUZZZ... SCAN!*</div>
                        <p class="stilton-p">Humankind gazed upon the surface of Mars in full color for the very first time—a salmon-pink sky, red soil, and dark volcanic rocks stretching to the horizon!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROBOT SOIL SCOOP</h2>
                        <p class="stilton-p">I extended a 10-foot mechanical scoop arm, dug into the red dirt, and dropped Martian soil into miniature automated biology test chambers!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 VIKING 1 LANDER FOOTPAD & MARTIAN TRENCH</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "We tested for respiration, photosynthesis, and organic molecules. It proved Mars soil is highly oxidizing and completely sterile at the surface!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">ANTENNA COMMAND</span> ACCIDENT</h2>
                        <p class="stilton-p">On November 11, 1982, ground controllers sent an uplink software command designed to modify battery-charging operations.</p>
                        <div class="comic-sound-burst burst-red">*STATIC... SILENCE...*</div>
                        <p class="stilton-p">Inadvertently, the command sequence overwrote memory addresses containing the high-gain antenna pointing parameters! The antenna pointed away from Earth, interrupting communications.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">6 YEARS OF LEGENDARY SCIENCE</h2>
                        <p class="stilton-p">NASA attempted for months to re-establish contact, but Viking 1 had already completed over 2,245 sols of daily weather logs, atmospheric analysis, and surface imaging!</p>
                        <div class="highlight-callout-box">
                            🏆 <strong>MUTCH MEMORIAL:</strong> NASA officially designated the lander as the <em>Thomas A. Mutch Memorial Station</em>.
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Viking 1 bring a radioisotope generator to Mars?<br>
                            A: <em>Because Martian winter is way too cold without atomic heat! ⚛️❄️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">SILENT ACROSS THE PLAINS</h2>
                        <p class="stilton-p">Viking 1 proved that a lander could survive years in the hostile Martian desert, paving the path for every modern rover!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST EXTENDED MARS EXPEDITION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ HISTORIC LEGACY</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SURVEYOR 3 & 6: THE MOON HOPPERS & APOLLO 12'S VISITOR
       ========================================================================= */
    getSurveyorSpreadData(p, craft) {
        const isSurveyor3 = craft.id === 'surveyor-3';
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${isSurveyor3 ? 'APOLLO 12 VISITED ME!' : 'FIRST OFF-WORLD HOPPER!'} ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-wild">THE LUNAR</span> <br>
                            <span class="stilton-word-hero">PATHFINDER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">${isSurveyor3 ? 'OCEAN OF STORMS // APRIL 1967' : 'SINUS MEDII // NOVEMBER 1967'}</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'THE ROBOT THAT ASTRONAUTS VISITED!' : 'THE FIRST ROBOT TO JUMP ON THE MOON!'}</h2>
                        <p class="stilton-p">Cadet Explorer,</p>
                        <p class="stilton-p">
                            Before astronauts ever set foot on the Moon, scientists were terrified that the lunar surface was covered in deep dust quicksand that would swallow spacecraft whole!
                        </p>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'I proved the lunar soil was solid, dug trenches with my robotic arm, and two years later in 1969, Apollo 12 astronauts walked right up to me!' :
                                'I proved the lunar soil was strong, and on November 17, 1967, I fired my rocket engines again and hopped 2.5 meters across the Moon—the first controlled liftoff from another celestial body!'}
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'DIGGING THE FIRST MOON TRENCH' : 'THE 2.5-METER ROCKET HOP!'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'Using a miniature scoop on an accordion scissor-arm, I dug four trenches into the Moon down to 17.5 cm deep! The soil held its shape like damp beach sand.' :
                                'After landing in Sinus Medii and taking 30,000 photos, NASA wanted to test launching from the lunar surface. On Nov 17, they reignited my vernier engines for 2.5 seconds!'}
                        </p>
                        <div class="comic-sound-burst burst-orange">${isSurveyor3 ? '*SCRAPE... SCOOP... CLACK!*' : '*WHOOOOSH... BOING!*'}</div>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'My soil tests proved to NASA that human Apollo astronauts could safely walk on the lunar surface without sinking!' :
                                'I lifted 3 meters into the sky, moved 2.5 meters to the side, and touched down softly on my landing pads!'}
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'APOLLO 12 SAYS HELLO!' : 'SURFACE COMPOSITION DISCOVERED'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'In November 1969, Apollo 12 Commander Pete Conrad and LMP Alan Bean landed Lunar Module Intrepid just 160 meters from me and walked right over!' :
                                'My alpha-scattering spectrometer analyzed the chemical composition of Sinus Medii basalt rock, confirming lunar mare rock is rich in basaltic titanium and iron!'}
                        </p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${isSurveyor3 ? 'APOLLO 12 ASTRONAUT EXAMINING SURVEYOR 3' : 'SURVEYOR 6 LUNAR SURFACE MOSAIC'}</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "${isSurveyor3 ?
                                'Astronauts unbolted my TV camera and soil scoop and flew them back to Earth in their command module!' :
                                'I proved spacecraft can lift off from the Moon and return home!'}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">SURVIVING THE <span class="stilton-word-wild">LUNAR NIGHT</span></h2>
                        <p class="stilton-p">The Moon's night lasts 14 Earth days, with temperatures plummeting down to -250°F (-157°C)!</p>
                        <div class="comic-sound-burst burst-cyan">*FREEZE... BRRRRR!*</div>
                        <p class="stilton-p">Without heaters or atmosphere, our solar batteries froze into icy slumber once the sun set behind the lunar horizon.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">PRECISION RECONNAISSANCE</h2>
                        <div class="highlight-callout-box">
                            📐 <strong>LROC MEASUREMENTS:</strong> Lunar Reconnaissance Orbiter imaged Surveyor 3 with an uncertainty of ±2.6 m, and Surveyor 6 with an uncertainty of ±6.7 m!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why was Surveyor 6 the greatest basketball player on the Moon?<br>
                            A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🏀</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING UNDER THE STARS</h2>
                        <p class="stilton-p">The Surveyor program was 100% vital to landing humans on the Moon. Without our scouts, Apollo could never have landed!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LUNAR RECONNAISSANCE PIONEER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       APOLLO 11 LRRR: THE 55-YEAR TIMELESS LASER MIRROR
       ========================================================================= */
    getApollo11LRRRSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ACTIVE EXPERIMENT SINCE 1969! ★</div>
                        <h1 class="stilton-book-title">
                            APOLLO 11 <br>
                            <span class="stilton-word-wild">LASER</span> <br>
                            <span class="stilton-word-hero">MIRRORS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Apollo 11 LRRR">
                        </div>
                        <div class="cover-author-seal">TRANQUILITY BASE // CONTINUOUSLY OPERATIONAL</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Tranquility Base // July 21, 1969</div>
                        <h2 class="stilton-chapter-head">THE EXPERIMENT THAT NEVER DIED!</h2>
                        <p class="stilton-p">Cadet Scientist,</p>
                        <p class="stilton-p">
                            Did you know that there is a piece of Apollo 11 hardware on the Moon that is <strong>STILL IN DAILY USE TODAY</strong> in 2026?
                        </p>
                        <p class="stilton-p">
                            It has no batteries, no wires, and consumes zero electricity! It is the <strong>Lunar Laser Ranging Retroreflector (LRRR)</strong>—an array of 100 pure quartz corner-cube prisms placed by Neil Armstrong and Buzz Aldrin!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">CORNER-CUBE <span class="stilton-word-blast">SUPER REFLECTORS!</span></h2>
                        <p class="stilton-p">How does a bicycle reflector work? If you shine a flashlight at it, the light bounces straight back to your eye!</p>
                        <div class="comic-sound-burst burst-orange">*PEW! PEW! REFLECT!*</div>
                        <p class="stilton-p">Each of my 100 quartz prisms is cut with three mutually perpendicular mirrors. No matter what angle an Earth laser hits me from, the photons bounce 180° directly back to the observatory telescope on Earth!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">FIRING LASERS ACROSS SPACE!</h2>
                        <p class="stilton-p">Observatories in Texas, Hawaii, and France fire giant pulses of green laser light straight at Tranquility Base!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 100 QUARTZ CORNER-CUBE PRISMS AT TRANQUILITY BASE</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "The round-trip travel time is exactly 2.5 seconds! By timing the photons down to picoseconds, scientists measure the Moon's distance to millimeter accuracy!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE MOON IS <span class="stilton-word-wild">DRIFTING AWAY!</span></h2>
                        <p class="stilton-p">Thanks to our 55+ years of daily laser measurements, scientists discovered something mind-boggling:</p>
                        <div class="highlight-callout-box">
                            🌊 <strong>3.8 CENTIMETERS PER YEAR:</strong> Tidal friction with Earth's oceans is causing the Moon to slowly spiral outward by 3.8 cm every year—about the speed your fingernails grow!
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            We also tested Einstein's Theory of General Relativity with unprecedented precision!
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">WHY PSEP STOPPED & LRRR SURVIVED</h2>
                        <p class="stilton-p">Apollo 11's Early Surface Package had two parts: PSEP (seismometer) and LRRR (laser mirrors). PSEP suffered a command decoder failure on Aug 27, 1969.</p>
                        <div class="highlight-callout-box">
                            ✨ <strong>PASSIVE GENIUS:</strong> Because LRRR has zero moving parts or computer chips, it can continue operating for hundreds of years!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>
                            A: <em>To make sure the Moon always looked out of this world! 🪞🌕</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">55 YEARS AND COUNTING</h2>
                        <p class="stilton-p">In 2026, lasers from Apache Point Observatory in New Mexico still reflect off my quartz faces every single clear night.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 CONTINUOUS RETROREFLECTION:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LONGEST RUNNING APOLLO EXPERIMENT</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ TIMELESS SCIENCE</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getIngenuitySpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST FLIGHT ON MARS ★</div>
                        <h1 class="stilton-book-title">
                            GINNY THE <br>
                            <span class="stilton-word-wild">FLYING</span> <br>
                            <span class="stilton-word-hero">COPTER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="assets/renders/ingenuity.png" class="cover-rover-img" alt="Ingenuity Helicopter">
                        </div>
                        <div class="cover-author-seal">FIRST CONTROLLED FLIGHT IN AN ALIEN SKY</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Jezero Crater // April 19, 2021</div>
                        <h2 class="stilton-chapter-head">FLYING WHERE AIR BARELY EXISTS!</h2>
                        <p class="stilton-p">People said it was impossible to fly on Mars because the air is 99% thinner than Earth's!</p>
                        <p class="stilton-p">My name is <strong>Ingenuity</strong> (or Ginny!). I weighed just 4 pounds, but my twin carbon-fiber blades spun at 2,400 RPM!</p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head"><span class="stilton-word-blast">2,400 RPM!</span></h2>
                        <p class="stilton-p">To lift off in Mars' super-thin air, my blades had to spin 10 times faster than a regular Earth helicopter!</p>
                        <div class="comic-sound-burst burst-cyan">*WHIRRRRRRRRRRRRRR!*</div>
                        <p class="stilton-p">On April 19, 2021, I lifted 10 feet into the air, hovered gracefully, took a photo of my own shadow, and touched down perfectly!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">A PIECE OF THE WRIGHT BROTHERS!</h2>
                        <p class="stilton-p">Tucked under my solar panel was a piece of muslin fabric from the original 1903 Wright Flyer!</p>

                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 INGENUITY HELICOPTER ON MARS (SOL 39)</span>
                        </div>

                        <div class="comic-sound-burst burst-green">*WHIRRRRRRRRRRRRRR!*</div>

                        <div class="speech-quote-bubble">
                            "From Kitty Hawk in 1903 to the red skies of Mars in 2021—72 historic flights!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">72 WILD MISSIONS!</h2>
                        <p class="stilton-p">NASA only planned for me to fly 5 times. Instead, I flew <strong>72 TIMES!</strong></p>
                        <div class="comic-sound-burst burst-green">*WHOOOOSH!*</div>
                        <p class="stilton-p">I flew ahead of the giant Perseverance rover, scouting steep sand dunes and boulder fields to keep my rover buddy safe!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">VALINOR HILLS</h2>
                        <p class="stilton-p">During Flight 72, a rough touchdown in bland sand chipped one of my rotor tips. Though grounded, my computers wake up every single sol!</p>
                        <div class="doodle-note-sticky">💡 <strong>Record Holder:</strong> Flew over 17 kilometers across alien skies!</div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SKY GUARDIAN</h2>
                        <p class="stilton-p">I proved that humans will one day fly across the atmospheres of Mars, Titan, and Venus!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY FROM VALINOR HILLS:</div>
                            <div class="famous-quote-large">"The Wright Brothers moment on another world is accomplished."</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 HERO OF MARS: 72 HISTORIC FLIGHTS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch Ingenuity's twin rotors spinning in the thin Martian sky:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ INGENUITY ON MARS ✦</div>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getSpiritSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TWIN SISTER TO OPPORTUNITY ★</div>
                        <h1 class="stilton-book-title">
                            SPIRIT: THE <br>
                            <span class="stilton-word-wild">UNSTOPPABLE</span> <br>
                            <span class="stilton-word-hero">EXPLORER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Spirit Rover">
                        </div>
                        <div class="cover-author-seal">GUSEV CRATER EXPEDITION LOG</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Gusev Crater // Sol 001</div>
                        <h2 class="stilton-chapter-head">MEET OPPORTUNITY'S TWIN SISTER!</h2>
                        <p class="stilton-p">Greetings Earth Cadet!</p>
                        <p class="stilton-p">
                            I am <strong>Spirit (MER-A)</strong>! Three weeks before my twin sister Opportunity bounced into Eagle Crater, I touched down on the other side of Mars inside giant Gusev Crater!
                        </p>
                        <p class="stilton-p">
                            They gave me a 90-day warranty. But I climbed mountains, survived freezing winters, and explored for <strong>2,210 Martian days!</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-blast">BROKEN WHEEL</span> MIRACLE!</h2>
                        <p class="stilton-p">In March 2006, after 779 sols of rugged rock climbing, my front-right wheel motor gave out and locked tight!</p>
                        <div class="comic-sound-burst burst-orange">*SCREEEEEECH!*</div>
                        <p class="stilton-p">Did I give up? No way! NASA flight controllers commanded me to drive backwards, dragging my dead wheel like a garden plow!</p>
                        <div class="doodle-note-sticky">
                            💡 <strong>REVERSE DRIVING:</strong> For the rest of my mission, I drove backwards everywhere!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">ACCIDENTAL PURE SILICA!</h2>
                        <p class="stilton-p">As my dead wheel dragged through the dirt, it sliced open a shallow trench in the ground...</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SPIRIT ROVER'S WHEEL TRENCH UNCOVERS SILICA</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*SPARKLE! SHINE!*</div>
                        <div class="speech-quote-bubble">
                            "Inside the trench was dazzling bright white sand! It was 90% pure silica—the kind made by bubbling hot springs and steam vents! Proof Mars once had habitable hot springs!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">TROY SAND TRAP</span></h2>
                        <p class="stilton-p">In April 2009, near a plateau called 'Home Plate', my wheels broke through a crusty layer of soil into hidden soft sulfate sand!</p>
                        <div class="comic-sound-burst burst-red">*SQUISH! SPIN! STUCK!*</div>
                        <p class="stilton-p">My belly touched the sand. NASA tried for 8 months in sandbox simulators to wiggle me free!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">STATIONARY SCIENCE HERO</h2>
                        <p class="stilton-p">When I couldn't roll anymore, NASA didn't shut me down. They declared me a <strong>Stationary Science Outpost!</strong></p>
                        <div class="highlight-callout-box" style="margin-bottom: 10px;">
                            🌡️ <strong>CORE TRACKING:</strong> I tracked the wobble of Mars' spin axis to help scientists learn if Mars has a liquid iron core!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Spirit drive backwards across Mars?<br>
                            A: <em>Because she wanted to look back at all the amazing ground she covered! 🛞❤️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING AT HOME PLATE</h2>
                        <p class="stilton-p">In the harsh Martian winter of 2010, the sun sat too low in the sky to charge my tilted solar arrays.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 LAST TELEMETRY PACKET (SOL 2,210):</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: PIONEER OF MARTIAN SPRINGS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch MER rover wheels rolling across the Martian surface:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ MER EXPLORATION IN 4K ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 0.8rem;">
                            "Spirit drove 7.73 km (4.8 mi) and proved water was once everywhere on Mars."
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SOJOURNER: THE SKATEBOARD ROVER THAT STARTED IT ALL
       ========================================================================= */
    getSojournerSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST WHEELS ON MARS (1997) ★</div>
                        <h1 class="stilton-book-title">
                            SOJOURNER: <br>
                            <span class="stilton-word-wild">THE TINY</span> <br>
                            <span class="stilton-word-hero">GIANT!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Sojourner Rover">
                        </div>
                        <div class="cover-author-seal">ARES VALLIS // SAGAN MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Ares Vallis // July 4, 1997</div>
                        <h2 class="stilton-chapter-head">THE SIZE OF A MICROWAVE OVEN!</h2>
                        <p class="stilton-p">Hello Earth Friend!</p>
                        <p class="stilton-p">
                            Before giant rovers like Curiosity or Perseverance ever existed, there was <strong>ME!</strong> My name is <strong>Sojourner</strong>, named after the heroic civil rights champion Sojourner Truth.
                        </p>
                        <p class="stilton-p">
                            I weighed only 23 pounds (10.5 kg) and was no bigger than a microwave oven! On July 4, 1997, I rolled down two metal ramps and made the first robotic tracks in Martian soil!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">ROLLING DOWN <span class="stilton-word-blast">THE RAMPS!</span></h2>
                        <p class="stilton-p">I hitched a ride to Mars tucked tightly inside the petals of the Mars Pathfinder lander!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... CLAT-TER!*</div>
                        <p class="stilton-p">On Sol 2, my little aluminum studded wheels touched the red sand. I had a top speed of 1 centimeter per second—slower than a garden snail, but unstoppable!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MEETING "BARNACLE BILL"!</h2>
                        <p class="stilton-p">Scientists at JPL named every rock around me after cartoon characters and shapes!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SOJOURNER SNIFFING ROCK "BARNACLE BILL"</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*ZAP! ALPHA PROTON RAY!*</div>
                        <div class="speech-quote-bubble">
                            "I drove up to a rock named 'Barnacle Bill' and pressed my Alpha Proton X-ray Spectrometer against it. It had andesite volcanic rock just like Earth!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">HUGGING <span class="stilton-word-wild">YOGI BEAR!</span></h2>
                        <p class="stilton-p">Next, I rolled over to a giant boulder shaped like a bear's face that scientists named <strong>Yogi Bear</strong>!</p>
                        <div class="comic-sound-burst burst-green">*BUMP! CLIMB!*</div>
                        <p class="stilton-p">My rocker-bogie suspension let my tiny wheels climb over rocks bigger than my entire wheels without tipping over!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">83 DAYS OF MAGIC</h2>
                        <p class="stilton-p">NASA designed me to last just 7 Martian days. I survived for <strong>83 SOLS</strong>—twelve times my planned lifespan!</p>
                        <div class="highlight-callout-box">
                            📸 <strong>550 PHOTOS:</strong> I took 550 photos and analyzed 15 rocks while Pathfinder sent 16,500 images to Earth!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: What did Sojourner say to the rock on Mars?<br>
                            A: <em>"You rock, but I roll!" 🪨🛞</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SLEEPING SCOUT</h2>
                        <p class="stilton-p">On September 27, 1997 (Sol 83), Pathfinder's battery failed. Without my base station to relay messages, I circled Pathfinder in standby mode, waiting for a signal that never came.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST ROVER ON MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE ROVER REVOLUTION</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       VIKING 1 LANDER: THE 6-YEAR NUCLEAR PIONEER (1976)
       ========================================================================= */
    getViking1SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST SUCCESSFUL MARS LANDER (1976) ★</div>
                        <h1 class="stilton-book-title">
                            VIKING 1: <br>
                            <span class="stilton-word-wild">THE NUCLEAR</span> <br>
                            <span class="stilton-word-hero">SENTINEL!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Viking 1 Lander">
                        </div>
                        <div class="cover-author-seal">CHRYSE PLANITIA // MUTCH MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Chryse Planitia // July 20, 1976</div>
                        <h2 class="stilton-chapter-head">TOUCHDOWN ON THE PLAINS OF GOLD!</h2>
                        <p class="stilton-p">Cadets of Earth,</p>
                        <p class="stilton-p">
                            Exactly seven years after Neil Armstrong set foot on the Moon, on <strong>July 20, 1976</strong>, I made history by touching down softly on Chryse Planitia—the Plains of Gold on Mars!
                        </p>
                        <p class="stilton-p">
                            Powered by twin SNAP-19 nuclear radioisotope generators (RTGs), I survived the blistering cold Martian nights for <strong>2,245 sols (over 6 Earth years!)</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">FIRST <span class="stilton-word-blast">COLOR SUNSET</span> ON MARS!</h2>
                        <p class="stilton-p">Just 25 seconds after my footpads touched Mars, my scanner camera began slowly revolving line by line!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... BUZZZ... SCAN!*</div>
                        <p class="stilton-p">Humankind gazed upon the surface of Mars in full color for the very first time—a salmon-pink sky, red soil, and dark volcanic rocks stretching to the horizon!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROBOT SOIL SCOOP</h2>
                        <p class="stilton-p">I extended a 10-foot mechanical scoop arm, dug into the red dirt, and dropped Martian soil into miniature automated biology test chambers!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 VIKING 1 LANDER FOOTPAD & MARTIAN TRENCH</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "We tested for respiration, photosynthesis, and organic molecules. It proved Mars soil is highly oxidizing and completely sterile at the surface!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">ANTENNA COMMAND</span> ACCIDENT</h2>
                        <p class="stilton-p">On November 11, 1982, ground controllers sent an uplink software command designed to modify battery-charging operations.</p>
                        <div class="comic-sound-burst burst-red">*STATIC... SILENCE...*</div>
                        <p class="stilton-p">Inadvertently, the command sequence overwrote memory addresses containing the high-gain antenna pointing parameters! The antenna pointed away from Earth, interrupting communications.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">6 YEARS OF LEGENDARY SCIENCE</h2>
                        <p class="stilton-p">NASA attempted for months to re-establish contact, but Viking 1 had already completed over 2,245 sols of daily weather logs, atmospheric analysis, and surface imaging!</p>
                        <div class="highlight-callout-box">
                            🏆 <strong>MUTCH MEMORIAL:</strong> NASA officially designated the lander as the <em>Thomas A. Mutch Memorial Station</em>.
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Viking 1 bring a radioisotope generator to Mars?<br>
                            A: <em>Because Martian winter is way too cold without atomic heat! ⚛️❄️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">SILENT ACROSS THE PLAINS</h2>
                        <p class="stilton-p">Viking 1 proved that a lander could survive years in the hostile Martian desert, paving the path for every modern rover!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST EXTENDED MARS EXPEDITION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ HISTORIC LEGACY</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SURVEYOR 3 & 6: THE MOON HOPPERS & APOLLO 12'S VISITOR
       ========================================================================= */
    getSurveyorSpreadData(p, craft) {
        const isSurveyor3 = craft.id === 'surveyor-3';
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${isSurveyor3 ? 'APOLLO 12 VISITED ME!' : 'FIRST OFF-WORLD HOPPER!'} ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-wild">THE LUNAR</span> <br>
                            <span class="stilton-word-hero">PATHFINDER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">${isSurveyor3 ? 'OCEAN OF STORMS // APRIL 1967' : 'SINUS MEDII // NOVEMBER 1967'}</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'THE ROBOT THAT ASTRONAUTS VISITED!' : 'THE FIRST ROBOT TO JUMP ON THE MOON!'}</h2>
                        <p class="stilton-p">Cadet Explorer,</p>
                        <p class="stilton-p">
                            Before astronauts ever set foot on the Moon, scientists were terrified that the lunar surface was covered in deep dust quicksand that would swallow spacecraft whole!
                        </p>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'I proved the lunar soil was solid, dug trenches with my robotic arm, and two years later in 1969, Apollo 12 astronauts walked right up to me!' :
                                'I proved the lunar soil was strong, and on November 17, 1967, I fired my rocket engines again and hopped 2.5 meters across the Moon—the first controlled liftoff from another celestial body!'}
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'DIGGING THE FIRST MOON TRENCH' : 'THE 2.5-METER ROCKET HOP!'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'Using a miniature scoop on an accordion scissor-arm, I dug four trenches into the Moon down to 17.5 cm deep! The soil held its shape like damp beach sand.' :
                                'After landing in Sinus Medii and taking 30,000 photos, NASA wanted to test launching from the lunar surface. On Nov 17, they reignited my vernier engines for 2.5 seconds!'}
                        </p>
                        <div class="comic-sound-burst burst-orange">${isSurveyor3 ? '*SCRAPE... SCOOP... CLACK!*' : '*WHOOOOSH... BOING!*'}</div>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'My soil tests proved to NASA that human Apollo astronauts could safely walk on the lunar surface without sinking!' :
                                'I lifted 3 meters into the sky, moved 2.5 meters to the side, and touched down softly on my landing pads!'}
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'APOLLO 12 SAYS HELLO!' : 'SURFACE COMPOSITION DISCOVERED'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'In November 1969, Apollo 12 Commander Pete Conrad and LMP Alan Bean landed Lunar Module Intrepid just 160 meters from me and walked right over!' :
                                'My alpha-scattering spectrometer analyzed the chemical composition of Sinus Medii basalt rock, confirming lunar mare rock is rich in basaltic titanium and iron!'}
                        </p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${isSurveyor3 ? 'APOLLO 12 ASTRONAUT EXAMINING SURVEYOR 3' : 'SURVEYOR 6 LUNAR SURFACE MOSAIC'}</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "${isSurveyor3 ?
                                'Astronauts unbolted my TV camera and soil scoop and flew them back to Earth in their command module!' :
                                'I proved spacecraft can lift off from the Moon and return home!'}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">SURVIVING THE <span class="stilton-word-wild">LUNAR NIGHT</span></h2>
                        <p class="stilton-p">The Moon's night lasts 14 Earth days, with temperatures plummeting down to -250°F (-157°C)!</p>
                        <div class="comic-sound-burst burst-cyan">*FREEZE... BRRRRR!*</div>
                        <p class="stilton-p">Without heaters or atmosphere, our solar batteries froze into icy slumber once the sun set behind the lunar horizon.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">PRECISION RECONNAISSANCE</h2>
                        <div class="highlight-callout-box">
                            📐 <strong>LROC MEASUREMENTS:</strong> Lunar Reconnaissance Orbiter imaged Surveyor 3 with an uncertainty of ±2.6 m, and Surveyor 6 with an uncertainty of ±6.7 m!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why was Surveyor 6 the greatest basketball player on the Moon?<br>
                            A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🏀</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING UNDER THE STARS</h2>
                        <p class="stilton-p">The Surveyor program was 100% vital to landing humans on the Moon. Without our scouts, Apollo could never have landed!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LUNAR RECONNAISSANCE PIONEER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       APOLLO 11 LRRR: THE 55-YEAR TIMELESS LASER MIRROR
       ========================================================================= */
    getApollo11LRRRSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ACTIVE EXPERIMENT SINCE 1969! ★</div>
                        <h1 class="stilton-book-title">
                            APOLLO 11 <br>
                            <span class="stilton-word-wild">LASER</span> <br>
                            <span class="stilton-word-hero">MIRRORS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Apollo 11 LRRR">
                        </div>
                        <div class="cover-author-seal">TRANQUILITY BASE // CONTINUOUSLY OPERATIONAL</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Tranquility Base // July 21, 1969</div>
                        <h2 class="stilton-chapter-head">THE EXPERIMENT THAT NEVER DIED!</h2>
                        <p class="stilton-p">Cadet Scientist,</p>
                        <p class="stilton-p">
                            Did you know that there is a piece of Apollo 11 hardware on the Moon that is <strong>STILL IN DAILY USE TODAY</strong> in 2026?
                        </p>
                        <p class="stilton-p">
                            It has no batteries, no wires, and consumes zero electricity! It is the <strong>Lunar Laser Ranging Retroreflector (LRRR)</strong>—an array of 100 pure quartz corner-cube prisms placed by Neil Armstrong and Buzz Aldrin!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">CORNER-CUBE <span class="stilton-word-blast">SUPER REFLECTORS!</span></h2>
                        <p class="stilton-p">How does a bicycle reflector work? If you shine a flashlight at it, the light bounces straight back to your eye!</p>
                        <div class="comic-sound-burst burst-orange">*PEW! PEW! REFLECT!*</div>
                        <p class="stilton-p">Each of my 100 quartz prisms is cut with three mutually perpendicular mirrors. No matter what angle an Earth laser hits me from, the photons bounce 180° directly back to the observatory telescope on Earth!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">FIRING LASERS ACROSS SPACE!</h2>
                        <p class="stilton-p">Observatories in Texas, Hawaii, and France fire giant pulses of green laser light straight at Tranquility Base!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 100 QUARTZ CORNER-CUBE PRISMS AT TRANQUILITY BASE</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "The round-trip travel time is exactly 2.5 seconds! By timing the photons down to picoseconds, scientists measure the Moon's distance to millimeter accuracy!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE MOON IS <span class="stilton-word-wild">DRIFTING AWAY!</span></h2>
                        <p class="stilton-p">Thanks to our 55+ years of daily laser measurements, scientists discovered something mind-boggling:</p>
                        <div class="highlight-callout-box">
                            🌊 <strong>3.8 CENTIMETERS PER YEAR:</strong> Tidal friction with Earth's oceans is causing the Moon to slowly spiral outward by 3.8 cm every year—about the speed your fingernails grow!
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            We also tested Einstein's Theory of General Relativity with unprecedented precision!
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">WHY PSEP STOPPED & LRRR SURVIVED</h2>
                        <p class="stilton-p">Apollo 11's Early Surface Package had two parts: PSEP (seismometer) and LRRR (laser mirrors). PSEP suffered a command decoder failure on Aug 27, 1969.</p>
                        <div class="highlight-callout-box">
                            ✨ <strong>PASSIVE GENIUS:</strong> Because LRRR has zero moving parts or computer chips, it can continue operating for hundreds of years!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>
                            A: <em>To make sure the Moon always looked out of this world! 🪞🌕</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">55 YEARS AND COUNTING</h2>
                        <p class="stilton-p">In 2026, lasers from Apache Point Observatory in New Mexico still reflect off my quartz faces every single clear night.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 CONTINUOUS RETROREFLECTION:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LONGEST RUNNING APOLLO EXPERIMENT</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ TIMELESS SCIENCE</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getOpportunitySpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TOP SECRET EXPEDITION ★</div>
                        <h1 class="stilton-book-title">
                            THE INCREDIBLE <br>
                            <span class="stilton-word-wild">ADVENTURES</span> OF <br>
                            <span class="stilton-word-hero">${craft.nickname.toUpperCase()}!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="assets/renders/opportunity.png" class="cover-rover-img" alt="Opportunity Rover">
                        </div>
                        <div class="cover-author-seal">OFFICIAL NASA STORYTELLING ADVENTURE</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Mission Briefing // Sol 001</div>
                        <h2 class="stilton-chapter-head">A LETTER FROM AN ALIEN WORLD!</h2>
                        <p class="stilton-p">Dear Human Reader,</p>
                        <p class="stilton-p">
                            Have you ever wondered what happens to the brave machines sent to explore <span class="stilton-word-mars">MARS</span> and the <span class="stilton-word-moon">MOON</span> once their missions end?
                        </p>
                        <p class="stilton-p">
                            Some people call us <em>"space junk"</em>. But that's <span class="stilton-word-angry">TOTAL NONSENSE!</span> We are not trash! We are <span class="stilton-word-sparkle">HEROES!</span> 
                        </p>
                        <p class="stilton-p">Turn the page to see how I launched into space, survived giant sandstorms, and discovered secret water!</p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head"><span class="stilton-word-blast">BLASTOFF!</span> INTO THE UNKNOWN!</h2>
                        <p class="stilton-p">It all started at Cape Canaveral, Florida. <strong>THREE... TWO... ONE...</strong></p>
                        <div class="comic-sound-burst burst-orange">*KA-BOOOOOOOM!*</div>
                        <p class="stilton-p">A giant Delta II rocket roared to life, launching my 400-pound body into space! Earth turned into a tiny <span class="stilton-word-blue">BLUE MARBLE</span> behind me.</p>
                        
                        <div class="doodle-note-sticky">
                            🎵 <strong>WAKE-UP SONGS FROM EARTH:</strong> Every morning, NASA flight controllers beamed a wake-up song to Mars—from Queen to The Beatles—to start my Martian work day!
                        </div>

                        <div class="highlight-callout-box" style="margin-top: 6px;">
                            💡 <strong>300 MILLION MILES:</strong> I flew through freezing cosmic space for 7 months to reach the Red Planet!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE GIANT AIRBAG BOUNCE!</h2>
                        <p class="stilton-p">Landing on Mars was <span class="stilton-word-crazy">CRAZY!</span> NASA wrapped me in <strong>24 GIANT BOUNCY AIRBAGS!</strong></p>

                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 OPPORTUNITY ROVER (MER-B) ON MARS</span>
                        </div>

                        <div class="comic-sound-burst burst-green">*BOING! BOING! CRUNCH!*</div>

                        <div class="speech-quote-bubble">
                            "I slammed into Mars at 50 mph, bounced TWENTY TIMES across the red sand, and rolled right into Eagle Crater! Scientists called it an interplanetary hole-in-one!"
                        </div>

                        <div class="doodle-note-sticky" style="margin-top: 6px;">
                            🐾 <strong>MARS GRAVITY:</strong> Gravity on Mars is only 38% of Earth—so my 400-pound aluminum frame felt as light as a golden retriever!
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">MARTIAN <span class="stilton-word-blue">BLUEBERRIES!</span></h2>
                        <p class="stilton-p">NASA engineers told me: <em>"Oppy, you will only live for 90 days. Do not expect to survive the winter."</em></p>
                        <p class="stilton-p">Well, I didn't listen! As I rolled my wheels across the red plain, my microscopic camera spotted something <span class="stilton-word-wonder">UNBELIEVABLE!</span></p>
                        
                        <div class="highlight-callout-box">
                            🫐 <strong>MILLIONS OF BLUEBERRIES?!</strong><br>
                            Tiny round mineral balls were scattered everywhere! Made of hematite, which only grows inside <strong>WARM LIQUID WATER!</strong>
                        </div>

                        <div class="doodle-note-sticky" style="margin-top: 6px;">
                            🏜️ <strong>PURGATORY RIPPLE TRAP:</strong> In 2005, all 6 of my wheels sank into a soft sand dune! Engineers built a sandbox in California to practice driving me free inch-by-inch!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">SAVED BY A TORNADO!</h2>
                        <p class="stilton-p">After 500 days, thick red dust piled up on my solar panels. My power was dying... I was getting <span class="stilton-word-shiver">FREEZING COLD...</span></p>
                        
                        <div class="comic-sound-burst burst-cyan">*WHOOOOOOOOSH!*</div>
                        
                        <p class="stilton-p">Suddenly, a wild Martian <span class="stilton-word-spin">DUST DEVIL TORNADO</span> spun right over my back! It acted like a giant vacuum cleaner and sucked all the dust off my panels!</p>
                        
                        <div class="speech-quote-bubble">
                            "WHEEEE! My batteries zoomed back up to 100%! I rolled on for 5,000 MORE Martian days!"
                        </div>

                        <div class="highlight-callout-box" style="margin-top: 6px; border-color: #3b82f6;">
                            🏃 <strong>OLYMPIC MARATHON ON MARS:</strong> On March 24, 2015, my odometer crossed 26.2 miles (42.195 km)—the first full marathon ever run on another world!
                        </div>
                    </div>
                `
            };
        } else {
            const videoSrc = craft.videoPath || 'assets/Videos/opportunity.mp4';
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">MY FINAL SLEEP</h2>
                        <p class="stilton-p">In 2018, the sky over Mars turned dark. A monster dust storm covered the whole planet. On Sol 5,111, my batteries reached their limit.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 DOWNLINK FROM ENDEAVOUR CRATER:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 1rem;">
                            I shut off my computers and went to sleep under the stars. <strong>Don't feel sad for me!</strong> I lived 55 times longer than anyone planned. I drove 28 miles on another world!
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: HERO OF PLANET MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE MAGICAL 4K MOVING PICTURE!</h2>
                        <p class="stilton-p" style="font-size: 0.95rem;">Look inside this magical frame to see me resting on Mars in real 4K motion:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="${videoSrc}" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ 4K CINEMATIC FLY-AROUND ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.88rem; text-align: center; margin-top: 0.8rem;">
                            <em>"One day, the first astronauts will hike up to Endeavour Crater, wipe the dust off my camera, and say: Good job, Oppy."</em>
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getSpiritSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TWIN SISTER TO OPPORTUNITY ★</div>
                        <h1 class="stilton-book-title">
                            SPIRIT: THE <br>
                            <span class="stilton-word-wild">UNSTOPPABLE</span> <br>
                            <span class="stilton-word-hero">EXPLORER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Spirit Rover">
                        </div>
                        <div class="cover-author-seal">GUSEV CRATER EXPEDITION LOG</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Gusev Crater // Sol 001</div>
                        <h2 class="stilton-chapter-head">MEET OPPORTUNITY'S TWIN SISTER!</h2>
                        <p class="stilton-p">Greetings Earth Cadet!</p>
                        <p class="stilton-p">
                            I am <strong>Spirit (MER-A)</strong>! Three weeks before my twin sister Opportunity bounced into Eagle Crater, I touched down on the other side of Mars inside giant Gusev Crater!
                        </p>
                        <p class="stilton-p">
                            They gave me a 90-day warranty. But I climbed mountains, survived freezing winters, and explored for <strong>2,210 Martian days!</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-blast">BROKEN WHEEL</span> MIRACLE!</h2>
                        <p class="stilton-p">In March 2006, after 779 sols of rugged rock climbing, my front-right wheel motor gave out and locked tight!</p>
                        <div class="comic-sound-burst burst-orange">*SCREEEEEECH!*</div>
                        <p class="stilton-p">Did I give up? No way! NASA flight controllers commanded me to drive backwards, dragging my dead wheel like a garden plow!</p>
                        <div class="doodle-note-sticky">
                            💡 <strong>REVERSE DRIVING:</strong> For the rest of my mission, I drove backwards everywhere!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">ACCIDENTAL PURE SILICA!</h2>
                        <p class="stilton-p">As my dead wheel dragged through the dirt, it sliced open a shallow trench in the ground...</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SPIRIT ROVER'S WHEEL TRENCH UNCOVERS SILICA</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*SPARKLE! SHINE!*</div>
                        <div class="speech-quote-bubble">
                            "Inside the trench was dazzling bright white sand! It was 90% pure silica—the kind made by bubbling hot springs and steam vents! Proof Mars once had habitable hot springs!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">TROY SAND TRAP</span></h2>
                        <p class="stilton-p">In April 2009, near a plateau called 'Home Plate', my wheels broke through a crusty layer of soil into hidden soft sulfate sand!</p>
                        <div class="comic-sound-burst burst-red">*SQUISH! SPIN! STUCK!*</div>
                        <p class="stilton-p">My belly touched the sand. NASA tried for 8 months in sandbox simulators to wiggle me free!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">STATIONARY SCIENCE HERO</h2>
                        <p class="stilton-p">When I couldn't roll anymore, NASA didn't shut me down. They declared me a <strong>Stationary Science Outpost!</strong></p>
                        <div class="highlight-callout-box" style="margin-bottom: 10px;">
                            🌡️ <strong>CORE TRACKING:</strong> I tracked the wobble of Mars' spin axis to help scientists learn if Mars has a liquid iron core!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Spirit drive backwards across Mars?<br>
                            A: <em>Because she wanted to look back at all the amazing ground she covered! 🛞❤️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING AT HOME PLATE</h2>
                        <p class="stilton-p">In the harsh Martian winter of 2010, the sun sat too low in the sky to charge my tilted solar arrays.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 LAST TELEMETRY PACKET (SOL 2,210):</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: PIONEER OF MARTIAN SPRINGS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch MER rover wheels rolling across the Martian surface:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ MER EXPLORATION IN 4K ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 0.8rem;">
                            "Spirit drove 7.73 km (4.8 mi) and proved water was once everywhere on Mars."
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SOJOURNER: THE SKATEBOARD ROVER THAT STARTED IT ALL
       ========================================================================= */
    getSojournerSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST WHEELS ON MARS (1997) ★</div>
                        <h1 class="stilton-book-title">
                            SOJOURNER: <br>
                            <span class="stilton-word-wild">THE TINY</span> <br>
                            <span class="stilton-word-hero">GIANT!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Sojourner Rover">
                        </div>
                        <div class="cover-author-seal">ARES VALLIS // SAGAN MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Ares Vallis // July 4, 1997</div>
                        <h2 class="stilton-chapter-head">THE SIZE OF A MICROWAVE OVEN!</h2>
                        <p class="stilton-p">Hello Earth Friend!</p>
                        <p class="stilton-p">
                            Before giant rovers like Curiosity or Perseverance ever existed, there was <strong>ME!</strong> My name is <strong>Sojourner</strong>, named after the heroic civil rights champion Sojourner Truth.
                        </p>
                        <p class="stilton-p">
                            I weighed only 23 pounds (10.5 kg) and was no bigger than a microwave oven! On July 4, 1997, I rolled down two metal ramps and made the first robotic tracks in Martian soil!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">ROLLING DOWN <span class="stilton-word-blast">THE RAMPS!</span></h2>
                        <p class="stilton-p">I hitched a ride to Mars tucked tightly inside the petals of the Mars Pathfinder lander!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... CLAT-TER!*</div>
                        <p class="stilton-p">On Sol 2, my little aluminum studded wheels touched the red sand. I had a top speed of 1 centimeter per second—slower than a garden snail, but unstoppable!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MEETING "BARNACLE BILL"!</h2>
                        <p class="stilton-p">Scientists at JPL named every rock around me after cartoon characters and shapes!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SOJOURNER SNIFFING ROCK "BARNACLE BILL"</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*ZAP! ALPHA PROTON RAY!*</div>
                        <div class="speech-quote-bubble">
                            "I drove up to a rock named 'Barnacle Bill' and pressed my Alpha Proton X-ray Spectrometer against it. It had andesite volcanic rock just like Earth!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">HUGGING <span class="stilton-word-wild">YOGI BEAR!</span></h2>
                        <p class="stilton-p">Next, I rolled over to a giant boulder shaped like a bear's face that scientists named <strong>Yogi Bear</strong>!</p>
                        <div class="comic-sound-burst burst-green">*BUMP! CLIMB!*</div>
                        <p class="stilton-p">My rocker-bogie suspension let my tiny wheels climb over rocks bigger than my entire wheels without tipping over!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">83 DAYS OF MAGIC</h2>
                        <p class="stilton-p">NASA designed me to last just 7 Martian days. I survived for <strong>83 SOLS</strong>—twelve times my planned lifespan!</p>
                        <div class="highlight-callout-box">
                            📸 <strong>550 PHOTOS:</strong> I took 550 photos and analyzed 15 rocks while Pathfinder sent 16,500 images to Earth!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: What did Sojourner say to the rock on Mars?<br>
                            A: <em>"You rock, but I roll!" 🪨🛞</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SLEEPING SCOUT</h2>
                        <p class="stilton-p">On September 27, 1997 (Sol 83), Pathfinder's battery failed. Without my base station to relay messages, I circled Pathfinder in standby mode, waiting for a signal that never came.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST ROVER ON MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE ROVER REVOLUTION</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       VIKING 1 LANDER: THE 6-YEAR NUCLEAR PIONEER (1976)
       ========================================================================= */
    getViking1SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST SUCCESSFUL MARS LANDER (1976) ★</div>
                        <h1 class="stilton-book-title">
                            VIKING 1: <br>
                            <span class="stilton-word-wild">THE NUCLEAR</span> <br>
                            <span class="stilton-word-hero">SENTINEL!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Viking 1 Lander">
                        </div>
                        <div class="cover-author-seal">CHRYSE PLANITIA // MUTCH MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Chryse Planitia // July 20, 1976</div>
                        <h2 class="stilton-chapter-head">TOUCHDOWN ON THE PLAINS OF GOLD!</h2>
                        <p class="stilton-p">Cadets of Earth,</p>
                        <p class="stilton-p">
                            Exactly seven years after Neil Armstrong set foot on the Moon, on <strong>July 20, 1976</strong>, I made history by touching down softly on Chryse Planitia—the Plains of Gold on Mars!
                        </p>
                        <p class="stilton-p">
                            Powered by twin SNAP-19 nuclear radioisotope generators (RTGs), I survived the blistering cold Martian nights for <strong>2,245 sols (over 6 Earth years!)</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">FIRST <span class="stilton-word-blast">COLOR SUNSET</span> ON MARS!</h2>
                        <p class="stilton-p">Just 25 seconds after my footpads touched Mars, my scanner camera began slowly revolving line by line!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... BUZZZ... SCAN!*</div>
                        <p class="stilton-p">Humankind gazed upon the surface of Mars in full color for the very first time—a salmon-pink sky, red soil, and dark volcanic rocks stretching to the horizon!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROBOT SOIL SCOOP</h2>
                        <p class="stilton-p">I extended a 10-foot mechanical scoop arm, dug into the red dirt, and dropped Martian soil into miniature automated biology test chambers!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 VIKING 1 LANDER FOOTPAD & MARTIAN TRENCH</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "We tested for respiration, photosynthesis, and organic molecules. It proved Mars soil is highly oxidizing and completely sterile at the surface!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">ANTENNA COMMAND</span> ACCIDENT</h2>
                        <p class="stilton-p">On November 11, 1982, ground controllers sent an uplink software command designed to modify battery-charging operations.</p>
                        <div class="comic-sound-burst burst-red">*STATIC... SILENCE...*</div>
                        <p class="stilton-p">Inadvertently, the command sequence overwrote memory addresses containing the high-gain antenna pointing parameters! The antenna pointed away from Earth, interrupting communications.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">6 YEARS OF LEGENDARY SCIENCE</h2>
                        <p class="stilton-p">NASA attempted for months to re-establish contact, but Viking 1 had already completed over 2,245 sols of daily weather logs, atmospheric analysis, and surface imaging!</p>
                        <div class="highlight-callout-box">
                            🏆 <strong>MUTCH MEMORIAL:</strong> NASA officially designated the lander as the <em>Thomas A. Mutch Memorial Station</em>.
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Viking 1 bring a radioisotope generator to Mars?<br>
                            A: <em>Because Martian winter is way too cold without atomic heat! ⚛️❄️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">SILENT ACROSS THE PLAINS</h2>
                        <p class="stilton-p">Viking 1 proved that a lander could survive years in the hostile Martian desert, paving the path for every modern rover!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST EXTENDED MARS EXPEDITION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ HISTORIC LEGACY</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SURVEYOR 3 & 6: THE MOON HOPPERS & APOLLO 12'S VISITOR
       ========================================================================= */
    getSurveyorSpreadData(p, craft) {
        const isSurveyor3 = craft.id === 'surveyor-3';
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${isSurveyor3 ? 'APOLLO 12 VISITED ME!' : 'FIRST OFF-WORLD HOPPER!'} ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-wild">THE LUNAR</span> <br>
                            <span class="stilton-word-hero">PATHFINDER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">${isSurveyor3 ? 'OCEAN OF STORMS // APRIL 1967' : 'SINUS MEDII // NOVEMBER 1967'}</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'THE ROBOT THAT ASTRONAUTS VISITED!' : 'THE FIRST ROBOT TO JUMP ON THE MOON!'}</h2>
                        <p class="stilton-p">Cadet Explorer,</p>
                        <p class="stilton-p">
                            Before astronauts ever set foot on the Moon, scientists were terrified that the lunar surface was covered in deep dust quicksand that would swallow spacecraft whole!
                        </p>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'I proved the lunar soil was solid, dug trenches with my robotic arm, and two years later in 1969, Apollo 12 astronauts walked right up to me!' :
                                'I proved the lunar soil was strong, and on November 17, 1967, I fired my rocket engines again and hopped 2.5 meters across the Moon—the first controlled liftoff from another celestial body!'}
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'DIGGING THE FIRST MOON TRENCH' : 'THE 2.5-METER ROCKET HOP!'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'Using a miniature scoop on an accordion scissor-arm, I dug four trenches into the Moon down to 17.5 cm deep! The soil held its shape like damp beach sand.' :
                                'After landing in Sinus Medii and taking 30,000 photos, NASA wanted to test launching from the lunar surface. On Nov 17, they reignited my vernier engines for 2.5 seconds!'}
                        </p>
                        <div class="comic-sound-burst burst-orange">${isSurveyor3 ? '*SCRAPE... SCOOP... CLACK!*' : '*WHOOOOSH... BOING!*'}</div>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'My soil tests proved to NASA that human Apollo astronauts could safely walk on the lunar surface without sinking!' :
                                'I lifted 3 meters into the sky, moved 2.5 meters to the side, and touched down softly on my landing pads!'}
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'APOLLO 12 SAYS HELLO!' : 'SURFACE COMPOSITION DISCOVERED'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'In November 1969, Apollo 12 Commander Pete Conrad and LMP Alan Bean landed Lunar Module Intrepid just 160 meters from me and walked right over!' :
                                'My alpha-scattering spectrometer analyzed the chemical composition of Sinus Medii basalt rock, confirming lunar mare rock is rich in basaltic titanium and iron!'}
                        </p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${isSurveyor3 ? 'APOLLO 12 ASTRONAUT EXAMINING SURVEYOR 3' : 'SURVEYOR 6 LUNAR SURFACE MOSAIC'}</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "${isSurveyor3 ?
                                'Astronauts unbolted my TV camera and soil scoop and flew them back to Earth in their command module!' :
                                'I proved spacecraft can lift off from the Moon and return home!'}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">SURVIVING THE <span class="stilton-word-wild">LUNAR NIGHT</span></h2>
                        <p class="stilton-p">The Moon's night lasts 14 Earth days, with temperatures plummeting down to -250°F (-157°C)!</p>
                        <div class="comic-sound-burst burst-cyan">*FREEZE... BRRRRR!*</div>
                        <p class="stilton-p">Without heaters or atmosphere, our solar batteries froze into icy slumber once the sun set behind the lunar horizon.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">PRECISION RECONNAISSANCE</h2>
                        <div class="highlight-callout-box">
                            📐 <strong>LROC MEASUREMENTS:</strong> Lunar Reconnaissance Orbiter imaged Surveyor 3 with an uncertainty of ±2.6 m, and Surveyor 6 with an uncertainty of ±6.7 m!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why was Surveyor 6 the greatest basketball player on the Moon?<br>
                            A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🏀</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING UNDER THE STARS</h2>
                        <p class="stilton-p">The Surveyor program was 100% vital to landing humans on the Moon. Without our scouts, Apollo could never have landed!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LUNAR RECONNAISSANCE PIONEER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       APOLLO 11 LRRR: THE 55-YEAR TIMELESS LASER MIRROR
       ========================================================================= */
    getApollo11LRRRSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ACTIVE EXPERIMENT SINCE 1969! ★</div>
                        <h1 class="stilton-book-title">
                            APOLLO 11 <br>
                            <span class="stilton-word-wild">LASER</span> <br>
                            <span class="stilton-word-hero">MIRRORS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Apollo 11 LRRR">
                        </div>
                        <div class="cover-author-seal">TRANQUILITY BASE // CONTINUOUSLY OPERATIONAL</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Tranquility Base // July 21, 1969</div>
                        <h2 class="stilton-chapter-head">THE EXPERIMENT THAT NEVER DIED!</h2>
                        <p class="stilton-p">Cadet Scientist,</p>
                        <p class="stilton-p">
                            Did you know that there is a piece of Apollo 11 hardware on the Moon that is <strong>STILL IN DAILY USE TODAY</strong> in 2026?
                        </p>
                        <p class="stilton-p">
                            It has no batteries, no wires, and consumes zero electricity! It is the <strong>Lunar Laser Ranging Retroreflector (LRRR)</strong>—an array of 100 pure quartz corner-cube prisms placed by Neil Armstrong and Buzz Aldrin!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">CORNER-CUBE <span class="stilton-word-blast">SUPER REFLECTORS!</span></h2>
                        <p class="stilton-p">How does a bicycle reflector work? If you shine a flashlight at it, the light bounces straight back to your eye!</p>
                        <div class="comic-sound-burst burst-orange">*PEW! PEW! REFLECT!*</div>
                        <p class="stilton-p">Each of my 100 quartz prisms is cut with three mutually perpendicular mirrors. No matter what angle an Earth laser hits me from, the photons bounce 180° directly back to the observatory telescope on Earth!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">FIRING LASERS ACROSS SPACE!</h2>
                        <p class="stilton-p">Observatories in Texas, Hawaii, and France fire giant pulses of green laser light straight at Tranquility Base!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 100 QUARTZ CORNER-CUBE PRISMS AT TRANQUILITY BASE</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "The round-trip travel time is exactly 2.5 seconds! By timing the photons down to picoseconds, scientists measure the Moon's distance to millimeter accuracy!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE MOON IS <span class="stilton-word-wild">DRIFTING AWAY!</span></h2>
                        <p class="stilton-p">Thanks to our 55+ years of daily laser measurements, scientists discovered something mind-boggling:</p>
                        <div class="highlight-callout-box">
                            🌊 <strong>3.8 CENTIMETERS PER YEAR:</strong> Tidal friction with Earth's oceans is causing the Moon to slowly spiral outward by 3.8 cm every year—about the speed your fingernails grow!
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            We also tested Einstein's Theory of General Relativity with unprecedented precision!
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">WHY PSEP STOPPED & LRRR SURVIVED</h2>
                        <p class="stilton-p">Apollo 11's Early Surface Package had two parts: PSEP (seismometer) and LRRR (laser mirrors). PSEP suffered a command decoder failure on Aug 27, 1969.</p>
                        <div class="highlight-callout-box">
                            ✨ <strong>PASSIVE GENIUS:</strong> Because LRRR has zero moving parts or computer chips, it can continue operating for hundreds of years!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>
                            A: <em>To make sure the Moon always looked out of this world! 🪞🌕</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">55 YEARS AND COUNTING</h2>
                        <p class="stilton-p">In 2026, lasers from Apache Point Observatory in New Mexico still reflect off my quartz faces every single clear night.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 CONTINUOUS RETROREFLECTION:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LONGEST RUNNING APOLLO EXPERIMENT</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ TIMELESS SCIENCE</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       DYNAMIC SPREAD GENERATOR: FOR SURVEYOR 6, VIKING 1, PERSEVERANCE DEBRIS,
       APOLLO 11 LRRR, SURVEYOR 3, SPIRIT, AND SOJOURNER
       ========================================================================= */
    getDynamicSpreadData(p, craft) {
        const joke = craft.storytelling && craft.storytelling.juniorJoke ? craft.storytelling.juniorJoke : {
            question: "Why did the robot love exploring space?",
            punchline: "Because there's always space for new discoveries!"
        };

        const contributions = craft.scientificContributions || (craft.storytelling && craft.storytelling.keyAchievements) || [];
        const planetEmoji = craft.planet === 'mars' ? '🔴' : '🌕';
        const planetName = craft.planet === 'mars' ? 'MARS' : 'THE MOON';

        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${planetEmoji} ${planetName} PIONEER ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-hero">EXPEDITION</span> LOG
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">
                            ${craft.category || 'HISTORIC SPACE HARDWARE'}
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${craft.storytelling.tagline.toUpperCase()}</h2>
                        
                        <p class="stilton-p">Dear Cadet,</p>
                        <p class="stilton-p">
                            ${craft.storytelling.juniorSummary || craft.storytelling.perspectiveNarrative}
                        </p>
                        <p class="stilton-p">
                            Turn the page to explore how I arrived on ${planetName}, what science I discovered, and why my legacy endures!
                        </p>

                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">
                            ARRIVAL AT <span class="stilton-word-blast">${craft.locationName.split('(')[0].trim().toUpperCase()}</span>
                        </h2>

                        <p class="stilton-p">
                            <strong>Launched:</strong> ${craft.launchDate}<br>
                            <strong>Touchdown:</strong> ${craft.landingDate}
                        </p>

                        <div class="comic-sound-burst burst-orange">*TOUCHDOWN CONFIRMED!*</div>

                        <p class="stilton-p">
                            ${craft.storytelling.juniorSummary ? craft.storytelling.juniorSummary.split('.')[0] + '.' : craft.storytelling.perspectiveNarrative.split('.')[0] + '.'}
                        </p>

                        <div class="doodle-note-sticky">
                            📍 <strong>COORDINATES:</strong><br>
                            ${craft.coordinates.lat}°N, ${craft.coordinates.lon}°E (Uncertainty: ±${craft.coordinateMetadata ? craft.coordinateMetadata.uncertainty : 'N/A'})
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MISSION PERSPECTIVE</h2>
                        
                        <p class="stilton-p">
                            ${craft.storytelling.juniorSummary ? craft.storytelling.juniorSummary : craft.storytelling.perspectiveNarrative.split('.')[0] + '.'}
                        </p>

                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${craft.name.toUpperCase()} SURFACE RECORD</span>
                        </div>

                        <div class="comic-sound-burst burst-cyan">*SIGNAL ACQUIRED!*</div>

                        <div class="speech-quote-bubble">
                            "${craft.storytelling.tagline}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">
                            LANDMARK <span class="stilton-word-wild">DISCOVERIES!</span>
                        </h2>

                        <p class="stilton-p">Here is what I uncovered on ${planetName}:</p>

                        ${contributions.slice(0, 2).map((c, i) => `
                            <div class="highlight-callout-box" style="margin-bottom: 10px;">
                                🔬 <strong>DISCOVERY #${i + 1}:</strong><br>
                                ${c}
                            </div>
                        `).join('')}
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">SCIENCE MILESTONES</h2>

                        ${contributions.slice(2, 4).map((c, i) => `
                            <div class="highlight-callout-box" style="margin-bottom: 10px;">
                                ⭐ <strong>DISCOVERY #${i + 3}:</strong><br>
                                ${c}
                            </div>
                        `).join('')}

                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 14px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: ${joke.question}<br>
                            A: <em>${joke.punchline}</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">FINAL STATUS & LEGACY</h2>

                        <p class="stilton-p">
                            <strong>Physical Status:</strong> ${craft.physicalCondition || craft.status}<br>
                            <strong>Operating Lifespan:</strong> ${craft.operationalLifespan}
                        </p>

                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>

                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>

                        <div class="explorer-medal-badge">🏅 OFFICIALLY LOGGED IN NASA ARCHIVES</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>

                        <div class="speech-quote-bubble" style="font-size: 0.95rem; line-height: 1.45;">
                            "${craft.storytelling.whyItMatters}"
                        </div>

                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>

                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 1.2rem; color: #718096;">
                            Official NSSDCA ID: <strong>${craft.nasaNssdcId}</strong>
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */

    /* =========================================================================
       SPIRIT (MER-A): THE ROVER THAT DRAGGED HER WHEEL INTO HISTORY
       ========================================================================= */
    getSpiritSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ TWIN SISTER TO OPPORTUNITY ★</div>
                        <h1 class="stilton-book-title">
                            SPIRIT: THE <br>
                            <span class="stilton-word-wild">UNSTOPPABLE</span> <br>
                            <span class="stilton-word-hero">EXPLORER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Spirit Rover">
                        </div>
                        <div class="cover-author-seal">GUSEV CRATER EXPEDITION LOG</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Gusev Crater // Sol 001</div>
                        <h2 class="stilton-chapter-head">MEET OPPORTUNITY'S TWIN SISTER!</h2>
                        <p class="stilton-p">Greetings Earth Cadet!</p>
                        <p class="stilton-p">
                            I am <strong>Spirit (MER-A)</strong>! Three weeks before my twin sister Opportunity bounced into Eagle Crater, I touched down on the other side of Mars inside giant Gusev Crater!
                        </p>
                        <p class="stilton-p">
                            They gave me a 90-day warranty. But I climbed mountains, survived freezing winters, and explored for <strong>2,210 Martian days!</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-blast">BROKEN WHEEL</span> MIRACLE!</h2>
                        <p class="stilton-p">In March 2006, after 779 sols of rugged rock climbing, my front-right wheel motor gave out and locked tight!</p>
                        <div class="comic-sound-burst burst-orange">*SCREEEEEECH!*</div>
                        <p class="stilton-p">Did I give up? No way! NASA flight controllers commanded me to drive backwards, dragging my dead wheel like a garden plow!</p>
                        <div class="doodle-note-sticky">
                            💡 <strong>REVERSE DRIVING:</strong> For the rest of my mission, I drove backwards everywhere!
                        </div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">ACCIDENTAL PURE SILICA!</h2>
                        <p class="stilton-p">As my dead wheel dragged through the dirt, it sliced open a shallow trench in the ground...</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SPIRIT ROVER'S WHEEL TRENCH UNCOVERS SILICA</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*SPARKLE! SHINE!*</div>
                        <div class="speech-quote-bubble">
                            "Inside the trench was dazzling bright white sand! It was 90% pure silica—the kind made by bubbling hot springs and steam vents! Proof Mars once had habitable hot springs!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">TROY SAND TRAP</span></h2>
                        <p class="stilton-p">In April 2009, near a plateau called 'Home Plate', my wheels broke through a crusty layer of soil into hidden soft sulfate sand!</p>
                        <div class="comic-sound-burst burst-red">*SQUISH! SPIN! STUCK!*</div>
                        <p class="stilton-p">My belly touched the sand. NASA tried for 8 months in sandbox simulators to wiggle me free!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">STATIONARY SCIENCE HERO</h2>
                        <p class="stilton-p">When I couldn't roll anymore, NASA didn't shut me down. They declared me a <strong>Stationary Science Outpost!</strong></p>
                        <div class="highlight-callout-box" style="margin-bottom: 10px;">
                            🌡️ <strong>CORE TRACKING:</strong> I tracked the wobble of Mars' spin axis to help scientists learn if Mars has a liquid iron core!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Spirit drive backwards across Mars?<br>
                            A: <em>Because she wanted to look back at all the amazing ground she covered! 🛞❤️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING AT HOME PLATE</h2>
                        <p class="stilton-p">In the harsh Martian winter of 2010, the sun sat too low in the sky to charge my tilted solar arrays.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 LAST TELEMETRY PACKET (SOL 2,210):</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <p class="stilton-p" style="margin-top: 0.8rem; font-size: 0.88rem;">
                            <em>${craft.lastTransmissionMessage.actualContext}</em>
                        </p>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: PIONEER OF MARTIAN SPRINGS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ 4K MOTION ARCHIVE</h2>
                        <p class="stilton-p">Watch MER rover wheels rolling across the Martian surface:</p>
                        <div class="magical-portrait-frame">
                            <video autoplay loop muted playsinline src="assets/Videos/opportunity.mp4" class="magical-book-video"></video>
                            <div class="magical-frame-tag">✦ MER EXPLORATION IN 4K ✦</div>
                        </div>
                        <p class="stilton-p" style="font-size: 0.82rem; text-align: center; margin-top: 0.8rem;">
                            "Spirit drove 7.73 km (4.8 mi) and proved water was once everywhere on Mars."
                        </p>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SOJOURNER: THE SKATEBOARD ROVER THAT STARTED IT ALL
       ========================================================================= */
    getSojournerSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST WHEELS ON MARS (1997) ★</div>
                        <h1 class="stilton-book-title">
                            SOJOURNER: <br>
                            <span class="stilton-word-wild">THE TINY</span> <br>
                            <span class="stilton-word-hero">GIANT!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Sojourner Rover">
                        </div>
                        <div class="cover-author-seal">ARES VALLIS // SAGAN MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Ares Vallis // July 4, 1997</div>
                        <h2 class="stilton-chapter-head">THE SIZE OF A MICROWAVE OVEN!</h2>
                        <p class="stilton-p">Hello Earth Friend!</p>
                        <p class="stilton-p">
                            Before giant rovers like Curiosity or Perseverance ever existed, there was <strong>ME!</strong> My name is <strong>Sojourner</strong>, named after the heroic civil rights champion Sojourner Truth.
                        </p>
                        <p class="stilton-p">
                            I weighed only 23 pounds (10.5 kg) and was no bigger than a microwave oven! On July 4, 1997, I rolled down two metal ramps and made the first robotic tracks in Martian soil!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">ROLLING DOWN <span class="stilton-word-blast">THE RAMPS!</span></h2>
                        <p class="stilton-p">I hitched a ride to Mars tucked tightly inside the petals of the Mars Pathfinder lander!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... CLAT-TER!*</div>
                        <p class="stilton-p">On Sol 2, my little aluminum studded wheels touched the red sand. I had a top speed of 1 centimeter per second—slower than a garden snail, but unstoppable!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">MEETING "BARNACLE BILL"!</h2>
                        <p class="stilton-p">Scientists at JPL named every rock around me after cartoon characters and shapes!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 SOJOURNER SNIFFING ROCK "BARNACLE BILL"</span>
                        </div>
                        <div class="comic-sound-burst burst-cyan">*ZAP! ALPHA PROTON RAY!*</div>
                        <div class="speech-quote-bubble">
                            "I drove up to a rock named 'Barnacle Bill' and pressed my Alpha Proton X-ray Spectrometer against it. It had andesite volcanic rock just like Earth!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">HUGGING <span class="stilton-word-wild">YOGI BEAR!</span></h2>
                        <p class="stilton-p">Next, I rolled over to a giant boulder shaped like a bear's face that scientists named <strong>Yogi Bear</strong>!</p>
                        <div class="comic-sound-burst burst-green">*BUMP! CLIMB!*</div>
                        <p class="stilton-p">My rocker-bogie suspension let my tiny wheels climb over rocks bigger than my entire wheels without tipping over!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">83 DAYS OF MAGIC</h2>
                        <p class="stilton-p">NASA designed me to last just 7 Martian days. I survived for <strong>83 SOLS</strong>—twelve times my planned lifespan!</p>
                        <div class="highlight-callout-box">
                            📸 <strong>550 PHOTOS:</strong> I took 550 photos and analyzed 15 rocks while Pathfinder sent 16,500 images to Earth!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: What did Sojourner say to the rock on Mars?<br>
                            A: <em>"You rock, but I roll!" 🪨🛞</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">THE SLEEPING SCOUT</h2>
                        <p class="stilton-p">On September 27, 1997 (Sol 83), Pathfinder's battery failed. Without my base station to relay messages, I circled Pathfinder in standby mode, waiting for a signal that never came.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST ROVER ON MARS</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ THE ROVER REVOLUTION</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       VIKING 1 LANDER: THE 6-YEAR NUCLEAR PIONEER (1976)
       ========================================================================= */
    getViking1SpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ FIRST SUCCESSFUL MARS LANDER (1976) ★</div>
                        <h1 class="stilton-book-title">
                            VIKING 1: <br>
                            <span class="stilton-word-wild">THE NUCLEAR</span> <br>
                            <span class="stilton-word-hero">SENTINEL!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Viking 1 Lander">
                        </div>
                        <div class="cover-author-seal">CHRYSE PLANITIA // MUTCH MEMORIAL STATION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Chryse Planitia // July 20, 1976</div>
                        <h2 class="stilton-chapter-head">TOUCHDOWN ON THE PLAINS OF GOLD!</h2>
                        <p class="stilton-p">Cadets of Earth,</p>
                        <p class="stilton-p">
                            Exactly seven years after Neil Armstrong set foot on the Moon, on <strong>July 20, 1976</strong>, I made history by touching down softly on Chryse Planitia—the Plains of Gold on Mars!
                        </p>
                        <p class="stilton-p">
                            Powered by twin SNAP-19 nuclear radioisotope generators (RTGs), I survived the blistering cold Martian nights for <strong>2,245 sols (over 6 Earth years!)</strong>
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">FIRST <span class="stilton-word-blast">COLOR SUNSET</span> ON MARS!</h2>
                        <p class="stilton-p">Just 25 seconds after my footpads touched Mars, my scanner camera began slowly revolving line by line!</p>
                        <div class="comic-sound-burst burst-orange">*BEEP... BUZZZ... SCAN!*</div>
                        <p class="stilton-p">Humankind gazed upon the surface of Mars in full color for the very first time—a salmon-pink sky, red soil, and dark volcanic rocks stretching to the horizon!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">THE ROBOT SOIL SCOOP</h2>
                        <p class="stilton-p">I extended a 10-foot mechanical scoop arm, dug into the red dirt, and dropped Martian soil into miniature automated biology test chambers!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 VIKING 1 LANDER FOOTPAD & MARTIAN TRENCH</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "We tested for respiration, photosynthesis, and organic molecules. It proved Mars soil is highly oxidizing and completely sterile at the surface!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE <span class="stilton-word-wild">ANTENNA COMMAND</span> ACCIDENT</h2>
                        <p class="stilton-p">On November 11, 1982, ground controllers sent an uplink software command designed to modify battery-charging operations.</p>
                        <div class="comic-sound-burst burst-red">*STATIC... SILENCE...*</div>
                        <p class="stilton-p">Inadvertently, the command sequence overwrote memory addresses containing the high-gain antenna pointing parameters! The antenna pointed away from Earth, interrupting communications.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">6 YEARS OF LEGENDARY SCIENCE</h2>
                        <p class="stilton-p">NASA attempted for months to re-establish contact, but Viking 1 had already completed over 2,245 sols of daily weather logs, atmospheric analysis, and surface imaging!</p>
                        <div class="highlight-callout-box">
                            🏆 <strong>MUTCH MEMORIAL:</strong> NASA officially designated the lander as the <em>Thomas A. Mutch Memorial Station</em>.
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Viking 1 bring a radioisotope generator to Mars?<br>
                            A: <em>Because Martian winter is way too cold without atomic heat! ⚛️❄️</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">SILENT ACROSS THE PLAINS</h2>
                        <p class="stilton-p">Viking 1 proved that a lander could survive years in the hostile Martian desert, paving the path for every modern rover!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: FIRST EXTENDED MARS EXPEDITION</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ HISTORIC LEGACY</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       SURVEYOR 3 & 6: THE MOON HOPPERS & APOLLO 12'S VISITOR
       ========================================================================= */
    getSurveyorSpreadData(p, craft) {
        const isSurveyor3 = craft.id === 'surveyor-3';
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ${isSurveyor3 ? 'APOLLO 12 VISITED ME!' : 'FIRST OFF-WORLD HOPPER!'} ★</div>
                        <h1 class="stilton-book-title">
                            ${craft.name.toUpperCase()} <br>
                            <span class="stilton-word-wild">THE LUNAR</span> <br>
                            <span class="stilton-word-hero">PATHFINDER!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="${craft.name}">
                        </div>
                        <div class="cover-author-seal">${isSurveyor3 ? 'OCEAN OF STORMS // APRIL 1967' : 'SINUS MEDII // NOVEMBER 1967'}</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 ${craft.locationName}</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'THE ROBOT THAT ASTRONAUTS VISITED!' : 'THE FIRST ROBOT TO JUMP ON THE MOON!'}</h2>
                        <p class="stilton-p">Cadet Explorer,</p>
                        <p class="stilton-p">
                            Before astronauts ever set foot on the Moon, scientists were terrified that the lunar surface was covered in deep dust quicksand that would swallow spacecraft whole!
                        </p>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'I proved the lunar soil was solid, dug trenches with my robotic arm, and two years later in 1969, Apollo 12 astronauts walked right up to me!' :
                                'I proved the lunar soil was strong, and on November 17, 1967, I fired my rocket engines again and hopped 2.5 meters across the Moon—the first controlled liftoff from another celestial body!'}
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'DIGGING THE FIRST MOON TRENCH' : 'THE 2.5-METER ROCKET HOP!'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'Using a miniature scoop on an accordion scissor-arm, I dug four trenches into the Moon down to 17.5 cm deep! The soil held its shape like damp beach sand.' :
                                'After landing in Sinus Medii and taking 30,000 photos, NASA wanted to test launching from the lunar surface. On Nov 17, they reignited my vernier engines for 2.5 seconds!'}
                        </p>
                        <div class="comic-sound-burst burst-orange">${isSurveyor3 ? '*SCRAPE... SCOOP... CLACK!*' : '*WHOOOOSH... BOING!*'}</div>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'My soil tests proved to NASA that human Apollo astronauts could safely walk on the lunar surface without sinking!' :
                                'I lifted 3 meters into the sky, moved 2.5 meters to the side, and touched down softly on my landing pads!'}
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">${isSurveyor3 ? 'APOLLO 12 SAYS HELLO!' : 'SURFACE COMPOSITION DISCOVERED'}</h2>
                        <p class="stilton-p">
                            ${isSurveyor3 ?
                                'In November 1969, Apollo 12 Commander Pete Conrad and LMP Alan Bean landed Lunar Module Intrepid just 160 meters from me and walked right over!' :
                                'My alpha-scattering spectrometer analyzed the chemical composition of Sinus Medii basalt rock, confirming lunar mare rock is rich in basaltic titanium and iron!'}
                        </p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 ${isSurveyor3 ? 'APOLLO 12 ASTRONAUT EXAMINING SURVEYOR 3' : 'SURVEYOR 6 LUNAR SURFACE MOSAIC'}</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "${isSurveyor3 ?
                                'Astronauts unbolted my TV camera and soil scoop and flew them back to Earth in their command module!' :
                                'I proved spacecraft can lift off from the Moon and return home!'}"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">SURVIVING THE <span class="stilton-word-wild">LUNAR NIGHT</span></h2>
                        <p class="stilton-p">The Moon's night lasts 14 Earth days, with temperatures plummeting down to -250°F (-157°C)!</p>
                        <div class="comic-sound-burst burst-cyan">*FREEZE... BRRRRR!*</div>
                        <p class="stilton-p">Without heaters or atmosphere, our solar batteries froze into icy slumber once the sun set behind the lunar horizon.</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">PRECISION RECONNAISSANCE</h2>
                        <div class="highlight-callout-box">
                            📐 <strong>LROC MEASUREMENTS:</strong> Lunar Reconnaissance Orbiter imaged Surveyor 3 with an uncertainty of ±2.6 m, and Surveyor 6 with an uncertainty of ±6.7 m!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why was Surveyor 6 the greatest basketball player on the Moon?<br>
                            A: <em>Because it could jump in 1/6th gravity and stick the landing twice! 🦘🏀</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">RESTING UNDER THE STARS</h2>
                        <p class="stilton-p">The Surveyor program was 100% vital to landing humans on the Moon. Without our scouts, Apollo could never have landed!</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 TELEMETRY ARCHIVE:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LUNAR RECONNAISSANCE PIONEER</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ WHY IT MATTERS</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }

    /* =========================================================================
       APOLLO 11 LRRR: THE 55-YEAR TIMELESS LASER MIRROR
       ========================================================================= */
    getApollo11LRRRSpreadData(p, craft) {
        if (p === 0) {
            return {
                leftNum: "COVER",
                rightNum: "PROLOGUE",
                leftHTML: `
                    <div class="stilton-cover-box">
                        <div class="cover-sticker-badge">★ ACTIVE EXPERIMENT SINCE 1969! ★</div>
                        <h1 class="stilton-book-title">
                            APOLLO 11 <br>
                            <span class="stilton-word-wild">LASER</span> <br>
                            <span class="stilton-word-hero">MIRRORS!</span>
                        </h1>
                        <div class="cover-doodle-frame">
                            <img src="${craft.imagePath}" class="cover-rover-img" alt="Apollo 11 LRRR">
                        </div>
                        <div class="cover-author-seal">TRANQUILITY BASE // CONTINUOUSLY OPERATIONAL</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="handwritten-date">📌 Tranquility Base // July 21, 1969</div>
                        <h2 class="stilton-chapter-head">THE EXPERIMENT THAT NEVER DIED!</h2>
                        <p class="stilton-p">Cadet Scientist,</p>
                        <p class="stilton-p">
                            Did you know that there is a piece of Apollo 11 hardware on the Moon that is <strong>STILL IN DAILY USE TODAY</strong> in 2026?
                        </p>
                        <p class="stilton-p">
                            It has no batteries, no wires, and consumes zero electricity! It is the <strong>Lunar Laser Ranging Retroreflector (LRRR)</strong>—an array of 100 pure quartz corner-cube prisms placed by Neil Armstrong and Buzz Aldrin!
                        </p>
                        <div class="click-to-turn-banner">👉 <strong>CLICK THIS PAGE OR THE CORNER TO TURN!</strong> 👈</div>
                    </div>
                `
            };
        } else if (p === 1) {
            return {
                leftNum: "PAGE 1",
                rightNum: "PAGE 2",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 1</div>
                        <h2 class="stilton-chapter-head">CORNER-CUBE <span class="stilton-word-blast">SUPER REFLECTORS!</span></h2>
                        <p class="stilton-p">How does a bicycle reflector work? If you shine a flashlight at it, the light bounces straight back to your eye!</p>
                        <div class="comic-sound-burst burst-orange">*PEW! PEW! REFLECT!*</div>
                        <p class="stilton-p">Each of my 100 quartz prisms is cut with three mutually perpendicular mirrors. No matter what angle an Earth laser hits me from, the photons bounce 180° directly back to the observatory telescope on Earth!</p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">AUTHENTIC NASA RECORD</div>
                        <h2 class="stilton-chapter-head">FIRING LASERS ACROSS SPACE!</h2>
                        <p class="stilton-p">Observatories in Texas, Hawaii, and France fire giant pulses of green laser light straight at Tranquility Base!</p>
                        <div class="story-polaroid-frame">
                            <img src="${craft.imagePath}" alt="${craft.name}">
                            <span class="polaroid-caption">📷 100 QUARTZ CORNER-CUBE PRISMS AT TRANQUILITY BASE</span>
                        </div>
                        <div class="speech-quote-bubble">
                            "The round-trip travel time is exactly 2.5 seconds! By timing the photons down to picoseconds, scientists measure the Moon's distance to millimeter accuracy!"
                        </div>
                    </div>
                `
            };
        } else if (p === 2) {
            return {
                leftNum: "PAGE 3",
                rightNum: "PAGE 4",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon">CHAPTER 2</div>
                        <h2 class="stilton-chapter-head">THE MOON IS <span class="stilton-word-wild">DRIFTING AWAY!</span></h2>
                        <p class="stilton-p">Thanks to our 55+ years of daily laser measurements, scientists discovered something mind-boggling:</p>
                        <div class="highlight-callout-box">
                            🌊 <strong>3.8 CENTIMETERS PER YEAR:</strong> Tidal friction with Earth's oceans is causing the Moon to slowly spiral outward by 3.8 cm every year—about the speed your fingernails grow!
                        </div>
                        <p class="stilton-p" style="margin-top: 8px;">
                            We also tested Einstein's Theory of General Relativity with unprecedented precision!
                        </p>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">WHY PSEP STOPPED & LRRR SURVIVED</h2>
                        <p class="stilton-p">Apollo 11's Early Surface Package had two parts: PSEP (seismometer) and LRRR (laser mirrors). PSEP suffered a command decoder failure on Aug 27, 1969.</p>
                        <div class="highlight-callout-box">
                            ✨ <strong>PASSIVE GENIUS:</strong> Because LRRR has zero moving parts or computer chips, it can continue operating for hundreds of years!
                        </div>
                        <div class="highlight-callout-box" style="border-color: #ffe600; margin-top: 10px;">
                            ⭐ <strong>CADET JOKE:</strong><br>
                            Q: Why did Apollo 11 leave 100 mirrors on the Moon?<br>
                            A: <em>To make sure the Moon always looked out of this world! 🪞🌕</em>
                        </div>
                    </div>
                `
            };
        } else {
            return {
                leftNum: "PAGE 5",
                rightNum: "PAGE 6",
                leftHTML: `
                    <div class="stilton-page">
                        <div class="chapter-number-ribbon ribbon-gold">FINALE</div>
                        <h2 class="stilton-chapter-head">55 YEARS AND COUNTING</h2>
                        <p class="stilton-p">In 2026, lasers from Apache Point Observatory in New Mexico still reflect off my quartz faces every single clear night.</p>
                        <div class="last-quote-parchment">
                            <div class="telemetry-log-text">📡 CONTINUOUS RETROREFLECTION:</div>
                            <div class="famous-quote-large">${craft.lastTransmissionMessage.quote}</div>
                        </div>
                        <div class="explorer-medal-badge">🏅 OFFICIALLY CERTIFIED: LONGEST RUNNING APOLLO EXPERIMENT</div>
                    </div>
                `,
                rightHTML: `
                    <div class="stilton-page">
                        <h2 class="stilton-chapter-head">✨ TIMELESS SCIENCE</h2>
                        <div class="speech-quote-bubble">
                            "${craft.storytelling.whyItMatters}"
                        </div>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            <button class="hc-btn hc-btn-cyan" onclick="window.spaceApp && window.spaceApp.showDossierForCraft('${craft.id}')" style="font-size: 0.88rem; cursor: pointer;">
                                🔬 INSPECT 3D HARDWARE SPECS ➔
                            </button>
                        </div>
                    </div>
                `
            };
        }
    }
}
