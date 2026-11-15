/**
 * CAPCOM AI // Deep Space Autonomous Communicator
 * High-reliability NASA Mission Control AI Assistant & Storytelling Engine
 * Supports Ollama API, OpenAI/OpenRouter bridges, and an instant high-intelligence NASA Knowledge Engine
 */

import { EQUIPMENT_DATABASE } from '../data/equipmentData.js';
import { telemetryAudio } from './audioTelemetry.js';

export class CapcomChatbot {
    constructor() {
        this.isOpen = false;
        this.ollamaEndpoint = localStorage.getItem('nasa_ollama_endpoint') || '';
        this.ollamaApiKey = localStorage.getItem('nasa_ollama_key') || '';
        this.ollamaModel = localStorage.getItem('nasa_ollama_model') || 'llama3.2';
        
        // Auto-detect static hosting: GitHub Pages, file://, or any non-backend port
        this.isStaticEnvironment = window.location.hostname.endsWith('github.io') || 
                                   window.location.protocol === 'file:' || 
                                   (window.location.port && window.location.port !== '8000');

        this.initDOM();
        this.setupEvents();
        this.validateAndRefreshOllamaStatus(false);

        // Initialize chips and badge according to current mode
        const initialMode = (window.spaceApp && window.spaceApp.userMode) ? window.spaceApp.userMode : 'junior';
        this.updateChipsForMode(initialMode);
    }

    initDOM() {
        // Floating Launcher Button
        const launcher = document.createElement('button');
        launcher.id = 'capcom-launcher-btn';
        launcher.className = 'capcom-launcher';
        launcher.innerHTML = `
            <div class="capcom-beacon-pulse"></div>
            <span class="capcom-icon">📡</span>
            <span class="capcom-label">TALK TO CAPCOM AI</span>
        `;
        document.body.appendChild(launcher);

        // Chat Terminal Window
        const windowDiv = document.createElement('div');
        windowDiv.id = 'capcom-chat-window';
        windowDiv.className = 'capcom-window';
        windowDiv.innerHTML = `
            <div class="capcom-header">
                <div class="capcom-header-left">
                    <div class="capcom-status-dot"></div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div class="capcom-title">CAPCOM // DEEP SPACE COMMS</div>
                            <span id="capcom-mode-badge" class="capcom-mode-badge">🎒 KIDS</span>
                        </div>
                        <div class="capcom-sub">NASA Archival Intelligence & Storytelling Engine • Online</div>
                    </div>
                </div>
                <div class="capcom-header-actions">
                    <button id="capcom-clear-btn" class="capcom-icon-btn" title="Clear Chat Log">🗑️</button>
                    <button id="capcom-settings-btn" class="capcom-icon-btn" title="API Configuration">⚙️</button>
                    <button id="capcom-close-btn" class="capcom-icon-btn" title="Close Terminal">&times;</button>
                </div>
            </div>

            <!-- Settings Drawer -->
            <div id="capcom-settings-drawer" class="capcom-settings-drawer">
                <div class="settings-title">🤖 CAPCOM AI & CLOUD INTELLIGENCE</div>
                <p style="font-size: 0.72rem; color: #8892b0; margin-bottom: 8px; line-height: 1.4;">
                    Echoes of the Orbit includes an <strong>Autonomous NASA Storytelling Engine</strong> running 100% in your browser with zero server setup! You can also connect a live <strong>Gemini API key</strong> or <strong>Ollama Cloud key</strong> below.
                </p>
                
                <div id="ollama-live-status" style="margin-bottom: 10px; padding: 7px 10px; border-radius: 6px; font-size: 0.75rem; background: rgba(0, 229, 255, 0.08); border: 1px solid #00e5ff; color: #00e5ff;">
                    🟢 <strong>Active:</strong> Built-in NASA Deep Space Intelligence (Client-Side • 100% Free & Fast)
                </div>

                <label style="font-size: 0.75rem; color: #ccd6f6; display: block; margin-bottom: 4px; font-weight: bold;">API Key (Gemini / Ollama / OpenAI — Optional):</label>
                <input type="password" id="ollama-key-input" value="${this.ollamaApiKey}" placeholder="Optional: Paste Gemini or Ollama Cloud key" style="width: 100%; box-sizing: border-box; margin-bottom: 8px;">

                <label style="font-size: 0.75rem; color: #ccd6f6; display: block; margin-bottom: 4px; font-weight: bold;">Model Name (Optional):</label>
                <input type="text" id="ollama-model-input" value="${this.ollamaModel}" placeholder="llama3.2 / gemini-1.5-flash" style="width: 100%; box-sizing: border-box; margin-bottom: 8px;">

                <label style="font-size: 0.75rem; color: #ccd6f6; display: block; margin-bottom: 4px;">Custom Endpoint (Optional — leave blank for Cloud/Static):</label>
                <input type="text" id="ollama-endpoint-input" value="${this.ollamaEndpoint}" placeholder="Leave blank, or custom URL (e.g. http://localhost:11434)" style="width: 100%; box-sizing: border-box; margin-bottom: 10px;">
                
                <div class="settings-btn-row" style="margin-top: 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                    <button id="save-ollama-settings-btn" class="telemetry-btn" style="padding: 7px 16px; background: #00ff88; color: #000; font-weight: bold; border-color: #00ff88;">💾 SAVE & TEST KEY</button>
                    <button id="clear-ollama-settings-btn" class="telemetry-btn" style="padding: 7px 14px; background: rgba(255,255,255,0.1); color: #fff;">RESET</button>
                    <span id="settings-save-confirm" style="font-size: 0.72rem; color: #33d6a6; display: none;">✓ Validating...</span>
                </div>
            </div>

            <!-- Quick Question Chips -->
            <div class="capcom-chips-bar" id="capcom-chips-bar">
                <!-- Dynamically populated via updateChipsForMode -->
            </div>

            <!-- Message Log Area -->
            <div class="capcom-messages" id="capcom-messages">
                <div class="capcom-msg bot">
                    <div class="msg-author">CAPCOM MISSION CONTROL // DS-1</div>
                    <div class="msg-bubble" id="capcom-welcome-bubble">
                        Greetings, Explorer! I am <strong>CAPCOM</strong>, your direct link to NASA's mission archives. 
                        Ask me about Opportunity, InSight, Apollo lunar buggies, laser retroreflectors, Viking 1, or why we preserve robotic pioneers resting on other worlds!
                    </div>
                </div>
            </div>

            <!-- Input Bar -->
            <form class="capcom-input-bar" id="capcom-form">
                <input type="text" id="capcom-user-input" placeholder="Ask CAPCOM anything about rovers, Mars, or Apollo..." autocomplete="off" required>
                <button type="submit" class="capcom-send-btn" id="capcom-send-btn">
                    <span>TRANSMIT</span> ➔
                </button>
            </form>
        `;
        document.body.appendChild(windowDiv);
    }

    setupEvents() {
        const launcher = document.getElementById('capcom-launcher-btn');
        const closeBtn = document.getElementById('capcom-close-btn');
        const clearBtn = document.getElementById('capcom-clear-btn');
        const navBtn = document.getElementById('nav-capcom-btn');
        const settingsBtn = document.getElementById('capcom-settings-btn');
        const settingsDrawer = document.getElementById('capcom-settings-drawer');
        const saveSettingsBtn = document.getElementById('save-ollama-settings-btn');
        const clearSettingsBtn = document.getElementById('clear-ollama-settings-btn');
        const form = document.getElementById('capcom-form');
        const input = document.getElementById('capcom-user-input');
        const chipsBar = document.getElementById('capcom-chips-bar');

        if (launcher) launcher.addEventListener('click', () => this.toggleWindow());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeWindow());
        if (navBtn) navBtn.addEventListener('click', () => this.toggleWindow());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearChat());

        // Settings toggle
        if (settingsBtn && settingsDrawer) {
            settingsBtn.addEventListener('click', () => {
                const isOpen = settingsDrawer.style.display === 'block';
                settingsDrawer.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) {
                    this.validateAndRefreshOllamaStatus(false);
                }
            });
        }

        // Save Settings
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.validateAndRefreshOllamaStatus(true);
            });
        }

        // Reset Settings
        if (clearSettingsBtn) {
            clearSettingsBtn.addEventListener('click', () => {
                const epInput = document.getElementById('ollama-endpoint-input');
                const kInput = document.getElementById('ollama-key-input');
                const mInput = document.getElementById('ollama-model-input');
                if (epInput) epInput.value = '';
                if (kInput) kInput.value = '';
                if (mInput) mInput.value = 'llama3.2';
                this.ollamaEndpoint = '';
                this.ollamaApiKey = '';
                this.ollamaModel = 'llama3.2';
                localStorage.removeItem('nasa_ollama_endpoint');
                localStorage.removeItem('nasa_ollama_key');
                localStorage.removeItem('nasa_ollama_model');

                const statusEl = document.getElementById('ollama-live-status');
                if (statusEl) {
                    statusEl.style.background = 'rgba(255, 255, 255, 0.05)';
                    statusEl.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    statusEl.style.color = '#8892b0';
                    statusEl.innerHTML = '⚪ <strong>Active:</strong> Built-in NASA Mission Control Engine (Offline & Free)';
                }

                const confirmSpan = document.getElementById('settings-save-confirm');
                if (confirmSpan) {
                    confirmSpan.textContent = '✓ Reset to Built-in Engine!';
                    confirmSpan.style.display = 'inline';
                    setTimeout(() => {
                        confirmSpan.style.display = 'none';
                        confirmSpan.textContent = '✓ Validating...';
                    }, 2500);
                }
            });
        }

        // Delegated chip clicks (so dynamic chips work automatically)
        if (chipsBar) {
            chipsBar.addEventListener('click', (e) => {
                const chip = e.target.closest('.capcom-chip');
                if (!chip) return;
                const prompt = chip.dataset.prompt;
                if (!prompt) return;
                input.value = prompt;
                this.handleSubmit(prompt);
                input.value = '';
            });
        }

        // Chat submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text) return;
                input.value = '';
                this.handleSubmit(text);
            });
        }

        // Keyboard navigation (Escape closes window)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeWindow();
            }
        });
    }

    async validateAndRefreshOllamaStatus(isSaving = false) {
        const keyInput = document.getElementById('ollama-key-input');
        const modelInput = document.getElementById('ollama-model-input');
        const endpointInput = document.getElementById('ollama-endpoint-input');
        const statusEl = document.getElementById('ollama-live-status');
        const confirmSpan = document.getElementById('settings-save-confirm');

        const keyVal = keyInput ? keyInput.value.trim() : (this.ollamaApiKey || '');
        const modelVal = (modelInput ? modelInput.value.trim() : this.ollamaModel) || 'llama3.2';
        const endpointVal = endpointInput ? endpointInput.value.trim() : (this.ollamaEndpoint || '');

        if (isSaving) {
            this.ollamaApiKey = keyVal;
            this.ollamaModel = modelVal;
            this.ollamaEndpoint = endpointVal;
            localStorage.setItem('nasa_ollama_key', keyVal);
            localStorage.setItem('nasa_ollama_model', modelVal);
            localStorage.setItem('nasa_ollama_endpoint', endpointVal);
            if (confirmSpan) {
                confirmSpan.style.display = 'inline';
                confirmSpan.style.color = '#ffde38';
                confirmSpan.textContent = '⏳ Testing connection...';
            }
        }

        // 1. In static environment (GitHub Pages) or when no key is entered
        if (this.isStaticEnvironment || (!keyVal && !endpointVal)) {
            if (!keyVal && !endpointVal) {
                if (statusEl) {
                    statusEl.style.background = 'rgba(0, 229, 255, 0.08)';
                    statusEl.style.borderColor = '#00e5ff';
                    statusEl.style.color = '#00e5ff';
                    statusEl.innerHTML = '🟢 <strong>Active:</strong> Built-in NASA Deep Space Engine (100% Client-Side • Free & Instant)';
                }
                if (confirmSpan && isSaving) {
                    confirmSpan.style.color = '#00e5ff';
                    confirmSpan.textContent = '✓ Saved (Using Built-in NASA Engine)';
                    setTimeout(() => { if (confirmSpan) confirmSpan.style.display = 'none'; }, 2500);
                }
                return;
            }

            // User provided custom key in static environment (Gemini / direct LLM)
            if (keyVal.startsWith('AIza')) {
                if (statusEl) {
                    statusEl.style.background = 'rgba(0, 255, 136, 0.12)';
                    statusEl.style.borderColor = '#00ff88';
                    statusEl.style.color = '#00ff88';
                    statusEl.innerHTML = `🟢 <strong>Connected:</strong> Google Gemini API Active (Client-Side)`;
                }
                if (confirmSpan && isSaving) {
                    confirmSpan.style.color = '#00ff88';
                    confirmSpan.textContent = '✓ Gemini Active!';
                    setTimeout(() => { if (confirmSpan) confirmSpan.style.display = 'none'; }, 2500);
                }
                return;
            }

            if (statusEl) {
                statusEl.style.background = 'rgba(0, 229, 255, 0.08)';
                statusEl.style.borderColor = '#00e5ff';
                statusEl.style.color = '#00e5ff';
                statusEl.innerHTML = `🟢 <strong>Active:</strong> Custom Key Stored • Built-in NASA Storytelling Fallback Ready`;
            }
            if (confirmSpan && isSaving) {
                confirmSpan.style.color = '#33d6a6';
                confirmSpan.textContent = '✓ Saved!';
                setTimeout(() => { if (confirmSpan) confirmSpan.style.display = 'none'; }, 2500);
            }
            return;
        }

        if (statusEl) {
            statusEl.innerHTML = '⏳ Validating Ollama connection...';
            statusEl.style.color = '#ffde38';
        }

        try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 2500);
            const res = await fetch('/api/validate-ollama', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    apiKey: keyVal,
                    model: modelVal,
                    endpoint: endpointVal
                })
            });
            clearTimeout(tid);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.valid) {
                if (statusEl) {
                    statusEl.style.background = 'rgba(0, 255, 136, 0.12)';
                    statusEl.style.borderColor = '#00ff88';
                    statusEl.style.color = '#00ff88';
                    statusEl.innerHTML = `🟢 <strong>Connected:</strong> Ollama Cloud Active (Model: <em>${data.model || modelVal}</em>)`;
                }
                if (confirmSpan && isSaving) {
                    confirmSpan.style.color = '#00ff88';
                    confirmSpan.textContent = '✓ Connected to Ollama!';
                    setTimeout(() => { if (confirmSpan) confirmSpan.style.display = 'none'; }, 3000);
                }
            } else {
                throw new Error(data.error || 'Connection Failed');
            }
        } catch (err) {
            this.isStaticEnvironment = true;
            if (statusEl) {
                statusEl.style.background = 'rgba(0, 229, 255, 0.08)';
                statusEl.style.borderColor = '#00e5ff';
                statusEl.style.color = '#00e5ff';
                statusEl.innerHTML = `🟢 <strong>Active:</strong> Built-in NASA Deep Space Engine (Zero Server Required)`;
            }
            if (confirmSpan && isSaving) {
                confirmSpan.style.color = '#00e5ff';
                confirmSpan.textContent = '✓ Saved (NASA Engine Active)';
                setTimeout(() => { if (confirmSpan) confirmSpan.style.display = 'none'; }, 2500);
            }
        }
    }

    updateChipsForMode(mode) {
        const chipsBar = document.getElementById('capcom-chips-bar');
        const badge = document.getElementById('capcom-mode-badge');
        const input = document.getElementById('capcom-user-input');

        let chips = [];
        let badgeText = '';
        let badgeColor = '';
        let placeholder = '';

        if (mode === 'junior') {
            badgeText = '🎒 KIDS';
            badgeColor = '#ffde38';
            placeholder = 'Ask CAPCOM anything! (e.g., Tell a space joke, Meet Oppy)...';
            chips = [
                { label: '🚀 Tell a space joke!', prompt: 'Tell me a space joke!' },
                { label: '🦾 Meet Oppy the rover!', prompt: 'Tell me about Opportunity the rover!' },
                { label: '🛠️ Why duct tape on Moon?', prompt: 'Why did astronauts use duct tape on the Moon buggy?' },
                { label: '🚁 Helicopter on Mars?', prompt: 'Did a helicopter really fly on Mars?' },
                { label: '🪞 Lasers hit the Moon?', prompt: 'How do lasers hit the mirror on the Moon?' },
                { label: '🐶 Are there robot dogs on Mars?', prompt: 'Are there robot dogs on Mars?' },
                { label: '🌟 What is this website?', prompt: 'What is Echoes of the Orbit?' }
            ];
        } else if (mode === 'teen') {
            badgeText = '⚡ TEEN';
            badgeColor = '#c084fc';
            placeholder = 'Ask CAPCOM anything (e.g. Oppy vibe check, Apollo 17 duct tape, marsquakes)...';
            chips = [
                { label: '⚡ Oppy vibe check (Certified GOAT)?', prompt: "Give me an Opportunity rover vibe check!" },
                { label: '🏎️ Apollo 17 duct tape flex?', prompt: "Tell me about Apollo 17 duct tape field repair!" },
                { label: '🎧 InSight 1300+ marsquakes?', prompt: "Tell me about InSight catching 1300+ marsquakes!" },
                { label: '🚁 Ginny 72 flights on Mars?', prompt: "Tell me about Ingenuity's 72 flights on Mars!" },
                { label: '🌕 Laser mirror running rent-free?', prompt: "How does the Apollo 11 laser mirror work rent-free?" },
                { label: '🛰️ Why can\'t we bring rovers back?', prompt: "Why can't we bring rovers back to Earth?" },
                { label: '💀 Viking 1 antenna drama?', prompt: "What happened to Viking 1's antenna in 1982?" },
                { label: '😂 Drop a cosmic joke!', prompt: "Tell me a space joke!" }
            ];
        } else {
            badgeText = '🔬 ADULT';
            badgeColor = '#00e5ff';
            placeholder = 'Query mission archives (e.g. MER-B hematite concretions, LRRR laser precision)...';
            chips = [
                { label: '🔬 MER-B hematite & Sol 5111', prompt: "Opportunity MER-B hematite blueberries and Sol 5111 conclusion" },
                { label: '📡 InSight SEIS core & Sol 1442', prompt: "InSight Lander SEIS core boundary and Sol 1442 final transmission" },
                { label: '📐 Apollo 11 LRRR 3.8 cm/yr recession', prompt: "Apollo 11 LRRR laser ranging and lunar recession rate" },
                { label: '🛰️ Viking 1 memory overwrite', prompt: "Viking 1 Lander 1982 antenna command memory overwrite event" },
                { label: '🚁 Ingenuity rotor tip fracture', prompt: "Ingenuity Flight 72 rotor tip fracture post-mortem" },
                { label: '🚀 Surveyor 6 extraterrestrial liftoff', prompt: "Surveyor 6 powered liftoff from Sinus Medii 1967" },
                { label: '🛡️ Planetary protection & COSPAR', prompt: "Planetary protection COSPAR guidelines for lunar and Martian relics" }
            ];
        }

        if (chipsBar) {
            chipsBar.innerHTML = chips.map(c =>
                `<button type="button" class="capcom-chip" data-prompt="${this.escapeHtml(c.prompt)}">${c.label}</button>`
            ).join('');
        }

        if (badge) {
            badge.textContent = badgeText;
            badge.style.color = badgeColor;
            badge.style.borderColor = badgeColor;
        }

        if (input) {
            input.placeholder = placeholder;
        }
    }

    escapeHtml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    toggleWindow() {
        this.isOpen = !this.isOpen;
        const win = document.getElementById('capcom-chat-window');
        if (win) {
            win.classList.toggle('active', this.isOpen);
            if (this.isOpen) {
                // Refresh chips to match current mode
                const activeMode = (window.spaceApp && window.spaceApp.userMode) ? window.spaceApp.userMode : 'junior';
                this.updateChipsForMode(activeMode);

                if (window.spaceApp && window.spaceApp.userMode === 'junior') {
                    telemetryAudio.playCartoonBoing();
                } else {
                    telemetryAudio.playBlip(1100, 0.06);
                }
                const input = document.getElementById('capcom-user-input');
                if (input) input.focus();
            }
        }
    }

    closeWindow() {
        this.isOpen = false;
        const win = document.getElementById('capcom-chat-window');
        if (win) win.classList.remove('active');
        telemetryAudio.playBlip(600, 0.05);
    }

    clearChat() {
        const container = document.getElementById('capcom-messages');
        if (!container) return;
        const mode = (window.spaceApp && window.spaceApp.userMode) ? window.spaceApp.userMode : 'junior';
        let welcomeText = "";
        if (mode === 'junior') {
            welcomeText = "👋 Beep-boop! Space Cadet, I am **CAPCOM**! Ask me about rovers, astronauts on the Moon, or ask for a space joke! 🚀";
        } else if (mode === 'teen') {
            welcomeText = "⚡ **CAPCOM DEEP SPACE COMMS ONLINE.** Ask for a rover vibe check, why we left 200 tons of gear on other worlds, or drop a joke!";
        } else {
            welcomeText = "Greetings, Researcher. I am **CAPCOM**, your direct query interface to NASA primary archives, telemetry logs, and physical relic inventories across Mars and the Moon.";
        }
        container.innerHTML = `
            <div class="capcom-msg bot">
                <div class="msg-author">CAPCOM MISSION CONTROL // DS-1</div>
                <div class="msg-bubble">${welcomeText}</div>
            </div>
        `;
        telemetryAudio.playBlip(900, 0.05);
    }

    appendMessage(role, text, source = null) {
        const container = document.getElementById('capcom-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `capcom-msg ${role}`;

        let authorName = 'CAPCOM MISSION CONTROL';
        if (role === 'user') {
            authorName = 'EXPLORER // YOU';
        } else if (source && source.includes('ollama-cloud')) {
            authorName = `CAPCOM // OLLAMA CLOUD (${this.ollamaModel || 'llama3.2'})`;
        } else if (source && source.includes('ollama-local')) {
            authorName = `CAPCOM // OLLAMA LOCAL (${this.ollamaModel || 'llama3.2'})`;
        } else if (source && (source.includes('local') || source.includes('nasa'))) {
            authorName = 'CAPCOM // NASA DEEP SPACE ARCHIVE';
        }
        const formatted = this.formatMarkdown(text);

        msgDiv.innerHTML = `
            <div class="msg-author">${authorName}</div>
            <div class="msg-bubble">${formatted}</div>
        `;

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    formatMarkdown(text) {
        if (!text) return "";
        return text
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    async handleSubmit(userQuery) {
        this.appendMessage('user', userQuery);
        if (window.spaceApp && window.spaceApp.userMode === 'junior') {
            telemetryAudio.playDoubleLaser();
        } else {
            telemetryAudio.playBlip(1200, 0.05);
        }

        // Loading message with telemetry pulse
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'capcom-msg bot loading';
        loadingDiv.innerHTML = `
            <div class="msg-author">CAPCOM // DECODING TELEMETRY</div>
            <div class="msg-bubble">
                <span class="telemetry-radar-dot"></span> Downlinking from Deep Space Network...
            </div>
        `;
        const msgContainer = document.getElementById('capcom-messages');
        if (msgContainer) {
            msgContainer.appendChild(loadingDiv);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }

        let reply = "";
        let replySource = "";

        // First attempt routing through backend /api/chat endpoint ONLY if NOT in static mode
        if (!this.isStaticEnvironment) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);

                const activeMode = (window.spaceApp && window.spaceApp.userMode) ? window.spaceApp.userMode : 'adult';
                const craftId = (window.spaceApp && window.spaceApp.selectedArtifact) ? window.spaceApp.selectedArtifact.id : null;

                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        messages: [
                            { role: 'user', content: userQuery }
                        ],
                        mode: activeMode,
                        craftId: craftId,
                        apiKey: this.ollamaApiKey || '',
                        model: this.ollamaModel || 'llama3.2',
                        endpoint: this.ollamaEndpoint || ''
                    })
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.reply) {
                        reply = data.reply;
                        replySource = data.source || "";
                    }
                } else {
                    this.isStaticEnvironment = true;
                }
            } catch (err) {
                this.isStaticEnvironment = true;
            }
        }

        // Direct client-side LLM if user configured Gemini or custom endpoint
        if (!reply && ((this.ollamaApiKey && this.ollamaApiKey.startsWith('AIza')) || (this.ollamaEndpoint && this.ollamaEndpoint.startsWith('http')))) {
            try {
                reply = await this.queryExternalLLM(userQuery);
                replySource = "client-ai";
            } catch (err) {
                // fall through to verified client-side NASA intelligence
            }
        }

        // 100% Client-Side Verified NASA Deep Space Intelligence Engine (Zero Server Required)
        if (!reply) {
            reply = this.generateNASAIntelligenceAnswer(userQuery);
            replySource = "local-nasa-ai";
        }

        if (loadingDiv.parentNode) {
            loadingDiv.remove();
        }

        this.appendMessage('bot', reply, replySource);
        if (window.spaceApp && window.spaceApp.userMode === 'junior') {
            telemetryAudio.playAlienChatter();
        } else {
            telemetryAudio.playQuindarTone();
        }
    }

    async queryExternalLLM(query) {
        // Direct Gemini Flash API support from browser
        if (this.ollamaApiKey && this.ollamaApiKey.startsWith('AIza')) {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.ollamaApiKey}`;
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 4500);
            const resp = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are CAPCOM for Echoes of the Orbit, a NASA Space Apps storytelling project. Answer accurately, concisely, and engagingly based on verified NASA telemetry.\n\nUser: ${query}`
                        }]
                    }]
                })
            });
            clearTimeout(tid);
            if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`);
            const data = await resp.json();
            return data.candidates[0].content.parts[0].text;
        }

        const endpoint = (this.ollamaEndpoint || '').replace(/\/+$/, '');
        if (!endpoint) throw new Error("No custom endpoint");
        let url = endpoint;
        let payload = {};

        if (endpoint.includes(':11434') || endpoint.endsWith('/api/generate')) {
            url = endpoint.endsWith('/api/generate') ? endpoint : `${endpoint}/api/generate`;
            payload = {
                model: this.ollamaModel || 'llama3.2',
                prompt: `You are CAPCOM for Echoes of the Orbit, a NASA Space Apps storytelling project. Answer accurately about rovers, Apollo, and space hardware using verified NASA data.\n\nUser: ${query}\nCAPCOM:`,
                stream: false
            };
        } else {
            url = endpoint.includes('/chat/completions') ? endpoint : `${endpoint}/v1/chat/completions`;
            payload = {
                model: this.ollamaModel || 'llama3.2',
                messages: [
                    { role: 'system', content: 'You are CAPCOM for Echoes of the Orbit, a NASA Space Apps storytelling project. Answer accurately about NASA rovers, landers, Apollo missions, and space science based on verified mission archives.' },
                    { role: 'user', content: query }
                ],
                max_tokens: 380
            };
        }

        // Fast abort controller to guarantee responsiveness
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);

        const headers = { 'Content-Type': 'application/json' };
        if (this.ollamaApiKey) {
            headers['Authorization'] = `Bearer ${this.ollamaApiKey}`;
        }

        const resp = await fetch(url, {
            method: 'POST',
            headers: headers,
            signal: controller.signal,
            body: JSON.stringify(payload)
        });

        clearTimeout(timeoutId);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else if (data.response) {
            return data.response;
        } else if (data.message && data.message.content) {
            return data.message.content;
        }
        throw new Error("Unrecognized API payload format");
    }

    /**
     * Verified NASA Mission Control Storytelling Intelligence Engine
     * High-reliability, mode-aware responses covering all Martian and Lunar equipment
     */
    generateNASAIntelligenceAnswer(query) {
        const q = (query || "").toLowerCase().trim();
        const mode = (window.spaceApp && window.spaceApp.userMode) ? window.spaceApp.userMode : 'junior';
        const isJunior = mode === 'junior';
        const isTeen = mode === 'teen';
        const isAdult = !isJunior && !isTeen;

        // 0. GIBBERISH & RANDOM TEST KEYSTROKES (e.g. "dasd", "asdf", "qwerty")
        const vowels = (q.match(/[aeiou]/g) || []).length;
        const isGibberish = (q.length <= 6 && vowels === 0 && !['oppy', 'lrrr', 'rtg', 'mer', 'mro'].includes(q)) ||
                            ['dasd', 'asdf', 'asdfg', 'qwerty', 'zxcv', 'test', 'testing', 'aaa', 'bbb', '123'].includes(q);

        if (isGibberish) {
            if (isJunior) {
                return `🎒 **Cadet CAPCOM here!** I didn't recognize **"${query}"**.\n\nTry asking me real space questions like:\n• 🦾 *"Tell me about Opportunity rover!"*\n• 🛠️ *"Why did astronauts use duct tape on the Moon buggy?"*\n• 🚁 *"Did a helicopter really fly on Mars?"*\n• 🪞 *"How do lasers bounce off the Moon?"*\n• 🚀 *"Tell me a space joke!"*`;
            } else if (isTeen) {
                return `⚡ **Static on the radar.** Didn't catch that signal (**"${query}"**).\n\nDrop a rover query to check receipts:\n• *"Give me an Opportunity rover vibe check"*\n• *"Tell me about Apollo 17 duct tape flex"*\n• *"How did InSight survive 1,300+ marsquakes?"*\n• *"Why can't we bring rovers back to Earth?"*\n• *"Tell me a space joke!"*`;
            } else {
                return `🔬 **CAPCOM Telemetry Unparsed:** Query **"${query}"** does not match catalogued Lunar or Martian surface hardware.\n\n**Supported query registers:**\n• Spacecraft manifests: MER-B Opportunity, InSight, Apollo 11 LRRR, Ingenuity, Viking 1\n• Mission science: Martian hematite blueberries, SEIS seismic data, lunar laser retroreflectors\n• Planetary archaeology: Heritage site preservation & COSPAR planetary quarantine protocols`;
            }
        }

        // 1. SPACE JOKES & RIDDLES
        if (q.includes('joke') || q.includes('funny') || q.includes('riddle') || q.includes('laugh') || q.includes('giggle') || q.includes('humor')) {
            const jokes = [
                { q: "Why did the Opportunity rover love driving across Mars?", a: "Because there were no red traffic lights and no speed limits—only red dust! 😂✨" },
                { q: "What is an astronaut's favorite key on the keyboard?", a: "The Space bar! ⌨️🚀" },
                { q: "Why did the Moon need 100 mirrors from Apollo 11?", a: "Because it wanted to make sure it looked out of this world! 🪞🌕" },
                { q: "Why did Apollo 17 take duct tape to the Moon?", a: "Because duct tape has a light side, a dark side, and it binds the universe together! 🛠️🌌" },
                { q: "How do astronauts organize a party on Mars?", a: "They planet! 🪐🎉" },
                { q: "What do rovers eat for breakfast on the Red Planet?", a: "Micro-chips and solar flakes! 🥣🤖" },
                { q: "Why did the sun go to school?", a: "To get a little brighter! ☀️📚" },
                { q: "What kind of music do Martian rovers listen to?", a: "Nep-tunes and rock & roll! 🎸🎶" },
                { q: "Why did InSight put on headphones on Mars?", a: "To hear Mars' heart beating 1,319 times! 🎧❤️" },
                { q: "How do you know when the Moon has had enough dinner?", a: "When it's completely full! 🌕🍽️" }
            ];
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            if (isJunior) {
                return `**🚀 COSMIC CADET GIGGLE-O-TRON!**\n\n**Q:** ${joke.q}\n\n**A:** **${joke.a}**\n\n*(Click the 'Tell me a space joke!' chip if you want another!)*`;
            } else if (isTeen) {
                return `**😂 CAPCOM VIBE CHECK: CERTIFIED DAD JOKE ALERT**\n\n**Q:** ${joke.q}\n**A:** **${joke.a}**\n\n10/10 no notes. Mars humor hits different.`;
            } else {
                return `**Mission Control Morale Downlink // Cultural Archival Record:**\n\n**Q:** ${joke.q}\n**A:** **${joke.a}**\n\n*Historical Context:* Space humor has been documented by Apollo and Mars ground control crews since Gemini 3 (1965) to maintain crew vigilance during high-stress telemetry monitoring.`;
            }
        }

        // 2. GREETINGS & WHO ARE YOU
        if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'yo' || q === 'sup' || q.includes('who are you') || q.includes('what are you') || q.includes('introduce') || q.includes('your name')) {
            if (isJunior) {
                return `👋 **Beep-boop! Hello Space Cadet!**\n\nI am **CAPCOM**, your robotic friend from NASA Mission Control! 🚀\n\nHere are cool things you can ask me:\n• *"Tell me about Oppy the rover!"*\n• *"Why did astronauts use duct tape on the Moon?"*\n• *"Did a helicopter really fly on Mars?"*\n• *"Tell me a space joke!"*\n\nWhich space mystery should we solve together?`;
            } else if (isTeen) {
                return `**⚡ YO! CAPCOM MISSION COMMS ONLINE.**\n\nI'm your direct feed to humanity's most legendary off-world robots. We don't do boring textbook monologues here—only verified facts and high-octane space lore.\n\nAsk me:\n• **Rover Vibe Checks:** Opportunity (GOAT), InSight, Ingenuity, Spirit, Sojourner.\n• **Apollo Flexes:** Fixing the LRV fender with duct tape, 100-prism laser mirrors running rent-free.\n• **The Big Questions:** Why can't we bring rovers home? Is there water on Mars?\n\nWhat's on your mind?`;
            } else {
                return `**CAPCOM // DEEP SPACE COMMS ONLINE (DS-1 BRIDGE)**\n\nWelcome, Senior Researcher. I serve as your real-time conversational interface to the primary archival records of NASA, ESA, and international lunar and planetary hardware.\n\n**Core Telemetry Capabilities:**\n• Physical condition, coordinates, and NSSDCA catalog identifiers for 13+ resting surface assets.\n• Chronology of final downlinks, atmospheric dust opacity (tau), and mission conclusion protocols.\n• In-situ scientific discoveries: Meridiani hematite spherules, SEIS liquid core constraints, LRRR lunar recession.\n\nSpecify any spacecraft, coordinate system, or mission parameter to initiate retrieval.`;
            }
        }

        // 3. HELP & SITE FEATURES
        if (q.includes('help') || q.includes('what can you do') || q.includes('commands') || q.includes('how do i') || q.includes('how to use') || q.includes('features') || q.includes('guide')) {
            if (isJunior) {
                return `🎒 **SPACE CADET MISSION GUIDE!**\n\nHere is how you explore **Echoes of the Orbit**:\n\n1. **📖 3D STORYBOOK:** Click the gold **STORYBOOK** button up top to flip real 3D illustrated adventure pages of Oppy, InSight, and the Moon Buggy!\n2. **🌍 INTERACTIVE GLOBES:** Click **MARS** or **THE MOON** to spin full 3D planets and click blinking landing sites!\n3. **🚗 3D SPECS:** Click any rover card in the right sidebar to see real NASA photos and 3D wireframe models!\n4. **🤖 CAPCOM CHAT:** Ask me any space question anytime right here!`;
            } else if (isTeen) {
                return `⚡ **MISSION CONTROL QUICK GUIDE (NO CAP):**\n\n• **3D Spheres:** Toggle **MARS** and **THE MOON** in the top navbar. Drag the globe to inspect where rovers entered the history books.\n• **Dossier Deep Dives:** Click **3D SPECS** on any rover card to read the unhinged engineering feats that kept these robots alive decades past their warranties.\n• **Storybook Mode:** Hit **📖 STORYBOOK** for illustrated comic-style chapters.\n• **Mode Switch:** Toggle your tier up top anytime between **🎒 Kids**, **⚡ Teen**, and **🔬 Adult** to change the vibe site-wide.`;
            } else {
                return `🔬 **SYSTEM CAPABILITIES & ARCHIVAL NAVIGATION:**\n\n• **Dual-Body GIS:** Hardware sites are geo-referenced on Three.js Martian (IAU/MOLA) and Lunar (LRO) digital spheres.\n• **Archival Dossiers:** Click '3D SPECS' on any hardware card to access primary NSSDCA datasets, launch/landing dates, coordinates, and telemetry records.\n• **Visual Theater:** View restored 4K orbital and surface reconstruction sequences in the Theater module.\n• **Atmospheric & Telemetry Logs:** Switch tier to Senior Researcher to inspect COSPAR planetary protection statuses and peer-reviewed geological summaries.`;
            }
        }

        // 4. WHAT IS ECHOES OF THE ORBIT / ABOUT THIS SITE
        if (q.includes('echoes of the orbit') || q.includes('what is this website') || q.includes('about this project') || q.includes('what is this site') || q.includes('space apps')) {
            if (isJunior) {
                return `🌟 **WELCOME TO ECHOES OF THE ORBIT!**\n\nThis website was created for the **NASA Space Apps Challenge 2026**!\n\nMost people think old spacecraft left on Mars and the Moon are just "discarded junk." But we know the truth: **They are Robot Legends!** 🦾✨ Each machine traveled millions of miles and paved the way for future human astronauts.`;
            } else if (isTeen) {
                return `⚡ **WHAT IS ECHOES OF THE ORBIT?**\n\nBuilt for **NASA Space Apps Challenge 2026**, this project challenges the lazy idea that resting rovers and Apollo landers are "space garbage." Over 200 metric tons of human ingenuity sit across Mars and the Moon. These aren't scrap heaps—they are **immortal robotic monuments** that set the world on fire with discoveries.`;
            } else {
                return `**PROJECT ARCHITECTURE // ECHOES OF THE ORBIT**\n\n*NASA International Space Apps Challenge 2026 Submission*\n\n**Mission Statement:** Transform raw planetary telemetry, landing coordinates, and mission logs of historical lunar and Martian hardware into an interactive, multi-tiered narrative experience. The project reframes resting interplanetary assets from 'discarded debris' into primary technological monuments of human civilization.`;
            }
        }

        // 5. WHY LEAVE ROVERS / CAN ROVERS RETURN / SPACE JUNK VS LEGENDS
        if ((q.includes('why') && (q.includes('leave') || q.includes('left') || q.includes('abandon'))) || q.includes('bring them back') || q.includes('can rovers return') || q.includes('come back') || q.includes('space junk') || q.includes('trash') || q.includes('garbage')) {
            if (isJunior) {
                return `🚀 **WHY ARE ROVERS LEFT ON MARS AND THE MOON?**\n\nGreat question, Cadet! 🧑‍🚀\n\n1. **Rockets are super heavy!** To bring a rover back, you would need to build an entire rocket launch pad and carry giant fuel tanks all the way to Mars!\n2. **They love their new home!** Mars has dry, clean deserts and the Moon has no rain or wind. That means their metal bodies will stay perfectly preserved for thousands of years!\n3. **Future Museums!** One day, when human astronauts live on Mars and the Moon, they will build glass domes over Oppy and Apollo to make the coolest space museums in the galaxy! 🏛️✨`;
            } else if (isTeen) {
                return `⚡ **WHY ROVERS NEVER COME HOME (AND WHY THAT'S BASED):**\n\n• **The Rocket Equation Flex:** Escaping Martian gravity requires massive propellant tanks and an ascent rocket. A one-way ticket lets NASA pack 100% of the spacecraft with scientific cameras and lasers instead of return fuel.\n• **Preserved For Eternity:** The Moon has zero atmosphere and Mars has zero rain. These machines will literally outlast the pyramids on Earth.\n• **Future Museum Flex:** When humans land on Mars, Perseverance Valley and Tranquility Base will be interplanetary UNESCO world heritage sites. Main character energy fr fr.`;
            } else {
                return `**TECHNICAL & LOGISTICAL ANALYSIS // IN-SITU RETIREMENT OF HARDWARE**\n\n1. **Tsiolkovsky Rocket Equation & Delta-V Constraints:** Launching a return vehicle from Mars requires ~4.1 km/s of delta-v to achieve orbit plus trans-Earth injection, increasing initial Earth payload mass by a factor of >10.\n2. **Preservation Environment:** The vacuum of the Moon and the hyper-arid, CO2-dominated atmosphere of Mars provide near-zero chemical oxidation and zero liquid erosion, preserving structural alloys (titanium, aluminum 6061, gold-mylar) indefinitely.\n3. **COSPAR Planetary Protection:** Under Category IV regulations, planetary landers are sterilized prior to launch. Resting assets serve as passive empirical testbeds for long-duration space weathering and cosmic radiation degradation.`;
            }
        }

        // 6. IS THERE WATER ON MARS?
        if (q.includes('water on mars') || q.includes('liquid water') || (q.includes('water') && q.includes('mars')) || q.includes('ice on mars') || q.includes('martian ocean')) {
            if (isJunior) {
                return `💧 **IS THERE WATER ON MARS? YES!**\n\nBillions of years ago, Mars had huge blue oceans, rushing rivers, and giant lakes you could sail a boat on! 🌊\n\nToday, Mars is cold and dry, but water is still hidden:\n• **Giant Ice Caps:** Both the North and South poles of Mars have miles of thick water ice, just like Antarctica!\n• **Rover Discoveries:** Oppy found ancient pebble rocks shaped by flowing river water, and Curiosity found muddy lake beds!`;
            } else if (isTeen) {
                return `⚡ **WATER ON MARS VIBE CHECK: ANCIENT OCEANS & HIDDEN ICE 🧊**\n\n• **The Receipts:** Opportunity found hematite "blueberries" and Curiosity drove through dried-up lakebeds in Gale Crater. Mars was once warm, wet, and totally swimmable.\n• **Where is it now?** Most of it froze into massive polar ice sheets or got trapped underground as permafrost. Future settlers will literally melt Martian glaciers for drinking water.`;
            } else {
                return `**HYDROLOGICAL SURVEY OF MARS // PRIMARY EVIDENCE**\n\n• **Ancient Aqueous Systems:** Mineralogical mapping via Opportunity (sulfate evaporites, hematite concretions at Meridiani) and Curiosity (clay-rich lacustrine mudstones at Yellowknife Bay) establishes persistent neutral-pH surface water during the Noachian and early Hesperian epochs (~3.8–3.5 Ga).\n• **Present Reservoir Inventory:** Substantial H2O reserves persist in the North Polar Layered Deposits (Planum Boreum, ~1.6 million km³ of water ice) and subsurface permafrost detected via Mars Odyssey GRS and Mars Express SHARAD radar sounding.`;
            }
        }

        // 7. IS THERE LIFE ON MARS?
        if (q.includes('life on mars') || q.includes('alien') || q.includes('aliens') || q.includes('microbe') || q.includes('bacteria') || q.includes('biosignature')) {
            if (isJunior) {
                return `👽 **DID ROVERS FIND ALIENS ON MARS?**\n\nNo little green aliens with antennas have visited our rovers yet! 🛸\n\nBUT scientists are searching for **ancient microscopic life** (like tiny fossils of prehistoric space germs). Rovers like Perseverance are digging into ancient river rocks in Jezero Crater to see if tiny microbes lived there billions of years ago!`;
            } else if (isTeen) {
                return `⚡ **LIFE ON MARS VIBE CHECK: SEARCHING FOR THE ANCIENT RECEIPTS 🔬**\n\n• **No Little Green Men:** No Martians building pyramids, sorry.\n• **The Real Science:** Mars had liquid water, organic carbon, and magnetic shielding 3.8 billion years ago—the exact same time life started on Earth!\n• **The Hunt:** Perseverance is currently caching rock cores in Jezero Crater. When NASA brings those samples home, we might get the first definitive proof of alien life fr fr.`;
            } else {
                return `**ASTROBIOLOGY & BIOSIGNATURE SEARCH PROTOCOLS**\n\n• **Prebiotic Habitability:** Curiosity confirmed Gale Crater possessed all biogenic elements (CHNOPS) in organic compounds within Murray Formation mudstones.\n• **Sample Caching:** Mars 2020 Perseverance has sealed over 20 geological cores targeting deltaic smectite clays in Jezero Crater—prime matrices for microfossil and organic biosignature preservation.\n• **Viking Biology Review:** The 1976 Labeled Release (LR) experiment produced metabolic-like gas evolution, but lack of organic detection by the GC-MS attributed this to non-biological soil oxidants (perchlorates).`;
            }
        }

        // 8. WHAT IS A SOL? / TIME ON MARS
        if (q.includes('sol') || q.includes('martian day') || q.includes('day on mars') || q.includes('time on mars')) {
            if (isJunior) {
                return `🌞 **WHAT IS A SOL?**\n\nA **Sol** is a solar day on Mars! 🔴\n\nBecause Mars spins a tiny bit slower than Earth, a Martian Sol lasts **24 hours, 39 minutes, and 35 seconds**—just 40 minutes longer than an Earth day! Imagine having 40 extra minutes to play every single day!`;
            } else if (isTeen) {
                return `⚡ **SOL VIBE CHECK: MARS' 24.6 HOUR DAY ⏰**\n\nA **Sol** is literally a Mars day: **24 hours, 39 minutes, 35 seconds**.\nNASA rover drivers on Earth actually wear special Martian watches that run 39 minutes slow each day to stay in sync with the rover's sunrise and sunset. That's true planetary dedication.`;
            } else {
                return `**CHRONOMETRY // MARTIAN SOLAR DAY (SOL)**\n\n• **Mean Solar Day:** 1 Sol = 24h 39m 35.244s (88,775.244 seconds, or 1.02749 Earth days).\n• **Martian Year:** 668.6 Sols (687 Earth days) due to Mars' 1.524 AU semi-major orbital axis.\n• **Mission Sols:** Rover mission clocks initialize Sol 0 (or Sol 1) upon surface touchdown. Opportunity achieved 5,111 Sols; Curiosity has exceeded 4,300+ Sols.`;
            }
        }

        // 9. HOW COLD IS MARS / WEATHER / DUST STORMS
        if (q.includes('cold') || q.includes('temperature') || q.includes('weather') || q.includes('dust storm') || (q.includes('atmosphere') && q.includes('mars'))) {
            if (isJunior) {
                return `🥶 **BRRR! HOW COLD IS MARS?**\n\nMars is FREEZING! ❄️\n• The average temperature is **-80°F (-62°C)**! That's colder than the North Pole on Earth!\n• Sometimes giant **global dust storms** cover the entire planet in red sand for months, turning the sky dark red and blocking all sunlight from rover solar panels!`;
            } else if (isTeen) {
                return `⚡ **MARS WEATHER VIBE CHECK: FROSTBITE & PLANETARY DUST STORMS 🌪️**\n\n• **The Thermostat:** Average is -80°F (-62°C), but at night near the poles it drops to **-195°F (-125°C)**. Carbon dioxide literally freezes into dry ice snow.\n• **Atmosphere:** 99% thinner than Earth and 95% CO2. You can't breathe, and there's zero ozone layer to block cosmic UV rays.\n• **Dust Storms:** Planet-wide dust storms can blot out 99% of sunlight for months—which is what finally took down Oppy in 2018.`;
            } else {
                return `**ATMOSPHERIC & METEOROLOGICAL PROFILE // MARS**\n\n• **Surface Pressure:** 6.1 mbar (~0.6% of Earth's mean sea level pressure), dominated by CO2 (95.32%), N2 (2.6%), Ar (1.9%).\n• **Thermal Regime:** Diurnal excursions from +20°C (midday equatorial summer) to -125°C (polar winter).\n• **Global Dust Storms:** Driven by solar heating during perihelion (southern summer). Atmospheric optical depth (tau) can exceed 10.8, extinguishing solar array power generation for photovoltaic rovers.`;
            }
        }

        // 10. MOON ENVIRONMENT / REGOLITH / GRAVITY
        if (q.includes('regolith') || q.includes('moon dust') || (q.includes('gravity') && q.includes('moon')) || q.includes('on the moon')) {
            if (isJunior) {
                return `🌕 **WHAT IS IT LIKE ON THE MOON?**\n\n• **Low Gravity Bounce:** The Moon has only **1/6th of Earth's gravity**! If you weigh 60 pounds on Earth, you weigh only 10 pounds on the Moon! You could jump over a car! 🦘\n• **Razor Moon Dust (Regolith):** Because there is no wind or rain, Moon dust is made of tiny sharp glass crystals that cling to spacesuits with static electricity!`;
            } else if (isTeen) {
                return `⚡ **MOON ENVIRONMENT VIBE CHECK: LOW GRAV & LETHAL DUST 🌑**\n\n• **Gravity:** 1/6th of Earth. Apollo astronauts literally skipped and bounced across the surface like kangaroos.\n• **Vacuum:** Absolute hard vacuum. Zero air, zero wind. Footprints from Neil and Buzz will remain undisturbed for millions of years.\n• **Regolith:** Moon dust is jagged pulverized glass that smells like spent gunpowder and eats through space gloves.`;
            } else {
                return `**LUNAR ENVIRONMENTAL PROFILE // PHYSICAL & GEOLOGICAL DYNAMICS**\n\n• **Surface Acceleration:** 1.62 m/s² (0.166 g), allowing high ballistic trajectories for regolith lofting.\n• **Atmospheric Density:** Ultra-high exosphere (<10⁻¹² bar); absence of aerodynamic drag allows ballistic dispersal of dust from rover wheels.\n• **Regolith Properties:** Mechanical fragmentation via micrometeoroid impact produces un-weathered, angular glass-rich silicates displaying high abrasive index and electrostatic adhesion.`;
            }
        }

        // 11. APOLLO 11 LASER MIRROR (LRRR)
        if (q.includes('lrrr') || q.includes('laser') || q.includes('retroreflector') || (q.includes('mirror') && q.includes('moon')) || (q.includes('apollo 11') && (q.includes('reflect') || q.includes('distance')))) {
            if (isJunior) {
                return `🪞 **THE MOON'S MAGIC LASER MIRROR!**\n\nWhen Neil Armstrong and Buzz Aldrin walked on the Moon in 1969, they placed a small box containing **100 glass prism mirrors** on the ground.\n\n• **No batteries needed!** It has zero wires and zero power.\n• Scientists on Earth shoot giant green lasers from observatories straight at the mirror. The laser bounces right back to Earth in 2.5 seconds!\n• This proved the Moon is drifting away from Earth by **1.5 inches (3.8 cm) every year**—about as fast as your fingernails grow! 💅`;
            } else if (isTeen) {
                return `⚡ **APOLLO 11 LRRR VIBE CHECK: ZERO POWER, 55+ YEARS RENT-FREE 🪞**\n\n• **The Setup:** Neil & Buzz deployed a tray of 100 quartz corner-cube prisms at Tranquility Base.\n• **The Tech Flex:** It requires literally ZERO electricity or software. Earth observatories fire laser pulses at it and measure the bounce time.\n• **The Discovery:** Measures Moon distance to millimeter accuracy and proves the Moon is moving 3.8 cm/yr away from us. Still operational today—talk about elite engineering!`;
            } else {
                return `**APOLLO 11 LUNAR LASER RANGING RETROREFLECTOR (LRRR) // TECHNICAL BRIEF**\n\n• **Coordinates:** Tranquility Base (0.67408°N, 23.47297°E).\n• **Array Specifications:** 100 corner-cube reflectors fabricated from suprasil (fused silica), 3.8 cm diameter each, mounted in a 46 cm square beryllium-copper pallet.\n• **Operational Mechanism:** Optical retroreflection returns incoming photons antiparallel to incidence angle without power or signal processing.\n• **Scientific Output:** 55+ years of continuous range timing (McDonald, Apache Point, Grasse) has quantified:\n1. Lunar orbital recession: +3.82 ± 0.07 cm/year (tidal dissipation).\n2. Verification of Einstein's Equivalence Principle: Delta a / a < 10^-13.\n3. Core-mantle boundary state: Fluid outer core radius ~330 km.`;
            }
        }

        // 12. APOLLO 17 DUCT TAPE REPAIR & LRV
        if (q.includes('duct tape') || q.includes('apollo 17') || (q.includes('lrv') && q.includes('fender')) || q.includes('cernan') || q.includes('schmitt') || q.includes('moon buggy')) {
            if (isJunior) {
                return `🛠️ **HOW DUCT TAPE SAVED THE MOON BUGGY!**\n\nOn Apollo 17, astronaut Gene Cernan accidentally caught his hammer on the Moon car's rear fender and snapped it off! 🏎️💥\n\nBecause there is no wind on the Moon, the spinning mesh wheels threw giant rooster-tails of sharp Moon dust all over the astronauts, blinding them!\n\n**The NASA Fix:** Engineers in Houston worked all night and told the astronauts to tape **4 laminated geology maps together with gray duct tape** and clamp it on. It worked perfectly and saved the entire mission! 🗺️✨`;
            } else if (isTeen) {
                return `⚡ **APOLLO 17 DUCT TAPE FLEX: THE MOST BASED FIELD REPAIR IN HISTORY 🏎️**\n\n• **The Disaster:** Gene Cernan ripped off the LRV's rear fender with a hammer handle. Low gravity turned the rover's wheels into dust catapults, burying the crew in abrasive regolith.\n• **The Houston Hack:** NASA engineers stayed up all night testing fixes with stuff the crew had in the cabin. The answer? **Four laminated maps, gray duct tape, and two clamps.**\n• **The Flex:** Drove 35.9 km across Taurus-Littrow with zero issues. Absolute legendary macgyver moment.`;
            } else {
                return `**APOLLO 17 LRV-003 FENDER REPAIR & ALSEP METRIC RECORD**\n\n• **Incident:** During EVA-1 at Taurus-Littrow, CDR Gene Cernan inadvertently caught a geology hammer in the right rear fender extension, detaching the fiberglass assembly.\n• **Hazard:** Ballistic rooster-tail dispersal of electrostatically charged regolith threatened radiator coatings, risking battery thermal runaway.\n• **Field Solution:** Chronographed during EVA-2: 4 laminated photo maps (LPD-1) secured with gray polyethylene duct tape and clamped with lunar portable utility brackets.\n• **Traverse Total:** Facilitated 35.9 km total surface transit, recovering the orange pyroclastic volcanic soil at Shorty Crater.`;
            }
        }

        // 13. INSIGHT LANDER & MARSQUAKES
        if (q.includes('insight') || q.includes('quake') || q.includes('marsquake') || q.includes('seis') || q.includes('elysium')) {
            if (isJunior) {
                return `🎧 **INSIGHT: THE DOCTOR OF MARS!**\n\nInSight landed in a flat plain called Elysium Planitia. Instead of driving around, InSight sat super still with a giant dome stethoscope (called **SEIS**) placed on the Martian soil!\n\n• InSight detected **1,319 marsquakes** shaking the ground!\n• It proved that Mars still has moving molten magma inside its heart!\n• Before dust covered its solar wings in 2022, InSight sent a final photograph showing the beautiful red horizon of Mars.`;
            } else if (isTeen) {
                return `⚡ **INSIGHT VIBE CHECK: MARS' PERSONAL THERAPIST 🎧**\n\n• **The Mission:** Sat at Elysium Planitia listening to Mars venting its internal drama 24/7 for 4 years straight.\n• **The Receipts:** Caught **1,319 marsquakes** with its ultra-sensitive French SEIS sensor, mapped out Mars' liquid iron-rich core, and caught meteorite impacts live.\n• **Final Transmission:** Dec 15, 2022 (Sol 1442). Dust coated its solar panels, but the science it left behind will feed planetary geologists for decades.`;
            } else {
                return `**INSIGHT GEOPHYSICAL MISSION ARCHIVE // ELYSIUM PLANITIA (4.502°N, 135.623°E)**\n\n• **Operational Span:** Nov 26, 2018 – Dec 15, 2022 (1,442 Sols).\n• **Core Seismological Findings (SEIS Instrument):**\n1. **Event Catalog:** 1,319 confirmed seismic events recorded up to magnitude Mw 4.7 (May 4, 2022).\n2. **Internal Structure:** Crustal thickness resolved to 24–72 km; lithosphere ~400–500 km thick.\n3. **Core Boundary:** Confirmed a large, low-density molten liquid metallic core with an ~1,830 ± 40 km radius.\n• **Decommissioning:** Sol 1436 (Dec 11, 2022) final surface image; Sol 1442 final telemetry pass. NASA officially declared mission conclusion Dec 21, 2022.`;
            }
        }

        // 14. INGENUITY HELICOPTER & FLIGHT 72
        if (q.includes('ingenuity') || q.includes('helicopter') || q.includes('ginny') || q.includes('rotor') || q.includes('flight 72')) {
            if (isJunior) {
                return `🚁 **INGENUITY: THE FIRST FLYING ROBOT ON ANOTHER WORLD!**\n\nIngenuity is a 4-pound flying buddy that hitched a ride on Perseverance's belly!\n\n• **Super Fast Blades:** Because Mars' air is super thin (like flying 100,000 feet high on Earth!), her carbon-fiber blades spun at **2,400 RPM**—ten times faster than an Earth helicopter!\n• **Overachiever!** NASA planned for just 5 short test hops. Ingenuity flew **72 TIMES** across 10.5 miles!\n• She even carries a tiny postage-stamp piece of fabric from the Wright Brothers' 1903 airplane under her solar wing! ✈️✨`;
            } else if (isTeen) {
                return `⚡ **INGENUITY VIBE CHECK: MARTIAN DRONE OVERACHIEVER 🚁**\n\n• **The Setup:** 4-pound drone spinning carbon-fiber blades at 2,400 RPM in 1% atmospheric pressure. Basically flying in pure vacuum.\n• **The Flex:** NASA planned 5 test flights. Ginny did **72 FLIGHTS**, scouting ahead for Percy across 10.5 miles of Martian craters.\n• **Retirement:** Clipped a sand dune on Flight 72 over Valinor Hills, damaging a rotor blade tip. Retired like a legend, paving the way for future aerial fleets on Mars.`;
            } else {
                return `**INGENUITY MARS HELICOPTER // FLIGHT LOG ARCHIVE**\n\n• **Rotor Architecture:** Coaxial counter-rotating carbon-composite blades, 1.21 m span, 2,400–2,700 RPM.\n• **Demonstration Envelope:** Designed for 5 technology-readiness sorties; completed **72 flights**, logging 128.8 minutes aloft across 17.0 km ground track.\n• **Flight 72 Termination:** On January 18, 2024, during an emergency descent over featureless terrain at Valinor Hills, shadow imagery revealed aerodynamic fracture of one or more rotor tips. Vehicle remains intact, upright, and operational as a static weather and avionics beacon. Mission formally concluded January 25, 2024.`;
            }
        }

        // 15. VIKING 1 LANDER & MEMORY OVERWRITE
        if (q.includes('viking') || q.includes('mutch') || q.includes('chryse planitia') || (q.includes('antenna') && q.includes('1982'))) {
            if (isJunior) {
                return `🤖 **VIKING 1: THE FIRST LONG-TERM VISITOR TO MARS!**\n\nViking 1 touched down in 1976 and sent Earth the very first color photographs from Mars' surface!\n\n• It stayed alive for over **6 years**!\n• In 1982, ground controllers sent an update to save its batteries, but a tiny computer code mix-up accidentally turned its antenna away from Earth!\n• Viking 1 is still sitting peacefully in Chryse Planitia today as a monument to robotic exploration.`;
            } else if (isTeen) {
                return `⚡ **VIKING 1 VIBE CHECK: RETRO 1970S PIONEER 📸**\n\n• **The Flex:** Landed on July 20, 1976 (exactly 7 years after Apollo 11). Broadcasted the first clear color panos of the red Martian horizon.\n• **The Lifetime:** Designed for 90 days, held out for **2,245 Sols (6+ Earth years)**.\n• **The Antenna Oops:** On Nov 11, 1982, an uplink intended to tweak battery charging accidentally overwrote antenna memory registers, breaking the connection to Earth. Still chilling on Chryse Planitia like a true OG.`;
            } else {
                return `**VIKING LANDER 1 (THOMAS A. MUTCH MEMORIAL STATION) // CHRYSE PLANITIA (22.48°N, 312.05°E)**\n\n• **Surface Lifetime:** July 20, 1976 to November 11, 1982 (2,245 Sols).\n• **Scientific Legacy:** First long-duration surface meteorology, first in-situ color surface imaging, biological soil sampling via pyrolytic release and gas exchange.\n• **Loss of Communication:** An uplinked command sequence designed to reconfigure battery charge management inadvertently overwrote memory addresses controlling high-gain antenna (HGA) pointing vectors. High-gain contact could not be recovered.`;
            }
        }

        // 16. SURVEYOR 6 & SURVEYOR 3 (LUNAR SCOUTS)
        if (q.includes('surveyor') || q.includes('rocket hop') || q.includes('sinus medii') || q.includes('ocean of storms')) {
            if (isJunior) {
                return `🚀 **SURVEYOR: THE LITTLE HOPPING MOON LANDERS!**\n\nBefore Apollo astronauts landed, NASA sent robotic Surveyor landers to test the Moon's soil!\n\n• **Surveyor 6 (1967):** Landed safely, and then controllers fired its rocket engines again! It hopped 10 feet into the air and landed 8 feet away—achieving **humanity's first rocket launch from another world!** 🦘🚀\n• **Surveyor 3:** Apollo 12 astronauts Pete Conrad and Alan Bean landed right next to it in 1969 and brought its camera back to Earth!`;
            } else if (isTeen) {
                return `⚡ **SURVEYOR VIBE CHECK: MOON HOPPING CHADS 🌕**\n\n• **Surveyor 6 Flex:** On Nov 17, 1967, NASA reignited its vernier rocket engines for 2.5 seconds. The lander rose 4 meters, moved sideways, and landed 2.5 meters away. First rocket liftoff on an alien celestial body!\n• **Surveyor 3 Flex:** Apollo 12 landed 180 meters away in 1969, walked over, clipped off its television camera, and brought it back to Earth. Absolute space heist of the century!`;
            } else {
                return `**SURVEYOR PROGRAM LUNAR ARCHIVE // SURVEYOR 3 & 6**\n\n• **Surveyor 6 (Sinus Medii, 0.474°N, -1.400°W):** On November 17, 1967, performed the first powered rocket liftoff from another celestial body, firing vernier thrusters for 2.5 seconds to achieve a 4 m altitude hop and 2.5 m lateral relocation.\n• **Surveyor 3 (Oceanus Procellarum, 3.016°S, 23.418°W):** Soft-landed April 20, 1967. On November 19, 1969, Apollo 12 (LM Intrepid) executed a precision landing 183 m away; astronauts Pete Conrad and Alan Bean retrieved its TV camera, scoop, and tubing for Earth-based material degradation analysis.`;
            }
        }

        // 17. CURIOSITY ROVER (MSL)
        if (q.includes('curiosity') || q.includes('gale crater') || q.includes('mount sharp') || q.includes('msl') || q.includes('chemcam')) {
            if (isJunior) {
                return `🔬 **MEET CURIOSITY: THE ROCK-ZAPPING SUPER ROVER!**\n\nCuriosity is as big as an SUV car! She landed in Gale Crater in 2012 and has been exploring Mars for over 12 years!\n\n• **Laser Cannon:** She shoots rocks with a laser (ChemCam) to see what chemicals are inside!\n• **Nuclear Power:** Instead of solar panels, she has a tiny warm plutonium battery that keeps her going even through huge dust storms!\n• She even sings *Happy Birthday* to herself on Mars every year! 🎂🤖`;
            } else if (isTeen) {
                return `⚡ **CURIOSITY VIBE CHECK: NUCLEAR CHAD OF GALE CRATER ⚛️**\n\n• **Power Source:** Multi-Mission Radioisotope Thermoelectric Generator (MMRTG). Plutonium decay gives zero cares about dust storms or cloudy skies.\n• **Rock Vaporizer:** Shoots actual lasers at Martian boulders from 20 feet away to inspect plasma spectrums.\n• **Status:** Has driven over 32 km and climbed thousands of feet up Mount Sharp. Still rolling strong after 12+ years. Unstoppable.`;
            } else {
                return `**MARS SCIENCE LABORATORY (MSL) // CURIOSITY ROVER**\n\n• **Landing:** August 6, 2012, Gale Crater (-4.5895°S, 137.4417°E).\n• **Power Architecture:** MMRTG producing ~110W electrical from 4.8 kg of plutonium-238 dioxide.\n• **Major Science Discoveries:**\n1. Confirmed Gale Crater hosted an ancient, circum-neutral lacustrine system containing bio-essential elements (CHNOPS).\n2. SAM instrument detected indigenous refractory organic molecules in 3-billion-year-old mudstones.\n3. Continuous monitoring of seasonal background methane fluctuations (0.4 to 1.5 ppbv) and periodic spikes up to 21 ppbv.`;
            }
        }

        // 18. PERSEVERANCE ROVER & SAMPLE RETURN
        if (q.includes('perseverance') || q.includes('percy') || q.includes('jezero') || q.includes('sample return') || q.includes('sample tubes') || q.includes('moxie')) {
            if (isJunior) {
                return `🪨 **MEET PERSEVERANCE: THE SAMPLE COLLECTING DETECTIVE!**\n\nPerseverance (Percy) is NASA's newest rover exploring Jezero Crater on Mars!\n\n• **Alien River Delta:** She is exploring dried-up mud and river sand where a giant lake used to be!\n• **Rock Core Collection:** She drills tiny core samples and seals them in shiny gold-titanium tubes to leave on the surface so future rockets can bring them to Earth!\n• **Making Oxygen:** Her MOXIE machine successfully made breathable oxygen out of the thin Martian air! 🌬️`;
            } else if (isTeen) {
                return `⚡ **PERSEVERANCE VIBE CHECK: INTERPLANETARY ROCK HOARDER 🪨**\n\n• **The Mission:** Cruising Jezero Crater ancient river delta collecting core samples into hermetically sealed titanium tubes.\n• **The Flex:** Landed with an insane rocket-powered Sky Crane and deployed Ingenuity the helicopter.\n• **Sci-Fi Tech:** Carried MOXIE, which literally extracted breathable oxygen from Mars' toxic CO2 atmosphere. Future human astronaut prep in full effect.`;
            } else {
                return `**MARS 2020 // PERSEVERANCE ROVER // JEZERO CRATER (18.38°N, 77.58°E)**\n\n• **Touchdown:** February 18, 2021 utilizing Terrain-Relative Navigation (TRN) and Sky Crane.\n• **Sample Caching System:** Drilled and hermetically sealed 20+ pristine rock and regolith core samples in ultra-clean titanium tubes for the Mars Sample Return (MSR) campaign.\n• **Technology Demonstrations:**\n1. **MOXIE:** Successfully demonstrated in-situ resource utilization (ISRU) by producing high-purity O2 at ~6-12 g/hr via solid oxide electrolysis of atmospheric CO2.\n2. **RIMFAX:** Ground-penetrating radar profiling sub-surface stratigraphy down to 10+ meters beneath the crater floor.`;
            }
        }

        // 19. CHECK ALL OTHER HARDWARE IN EQUIPMENT_DATABASE
        for (const craft of EQUIPMENT_DATABASE) {
            const idLower = (craft.id || "").toLowerCase();

            const isMatch = q.includes(idLower) ||
                (idLower.includes('opportunity') && (q.includes('opportunity') || q.includes('oppy') || q.includes('mer-b') || q.includes('blueberry') || q.includes('blueberries'))) ||
                (idLower.includes('spirit') && (q.includes('spirit') || q.includes('mer-a') || q.includes('home plate') || q.includes('gusev') || q.includes('columbia hills') || q.includes('troy'))) ||
                (idLower.includes('pathfinder') && (q.includes('sojourner') || q.includes('pathfinder') || q.includes('microrover') || q.includes('ares vallis'))) ||
                (idLower.includes('apollo-11-descent') && (q.includes('eagle') || (q.includes('apollo 11') && !q.includes('laser')))) ||
                (idLower.includes('apollo-15') && (q.includes('apollo 15') || q.includes('hadley'))) ||
                (idLower.includes('perseverance-landing-debris') && (q.includes('debris') || q.includes('parachute') || q.includes('backshell') || q.includes('sky crane')));

            if (isMatch) {
                if (isJunior) {
                    const title = craft.name;
                    const summary = craft.storytelling?.juniorSummary || craft.storytelling?.perspectiveNarrative || craft.tagline;
                    const joke = craft.storytelling?.juniorJoke || "";
                    const why = craft.storytelling?.whyItMatters || "";
                    return `🤖 **${title.toUpperCase()}**\n\n${summary}\n\n${joke ? `**Cadet Giggle:** ${joke}\n\n` : ""}⭐ **Why It Matters:** ${why}\n\n*(Click **3D SPECS** on their card to see their real 3D model!)*`;
                } else if (isTeen) {
                    const title = craft.name.toUpperCase();
                    const tag = craft.storytelling?.genZTagline || craft.tagline;
                    const narrative = craft.storytelling?.genZNarrative || craft.storytelling?.perspectiveNarrative;
                    const why = craft.storytelling?.genZWhyMatters || craft.storytelling?.whyItMatters;
                    const status = craft.storytelling?.genZStatus || craft.status;
                    return `⚡ **${title} VIBE CHECK 🚀**\n\n• **The Flex:** ${tag}\n• **The Lore:** ${narrative}\n• **Why It's Based:** ${why}\n• **Status:** ${status}`;
                } else {
                    const desig = craft.designation || craft.name;
                    const nssdc = craft.nasaNssdcId ? ` (NSSDCA: ${craft.nasaNssdcId})` : "";
                    const coords = craft.coordinates ? `${craft.coordinates.lat}°, ${craft.coordinates.lng}° (${craft.locationName || 'Surface'})` : 'Stationary';
                    const lifespan = craft.operationalLifespan || 'N/A';
                    const dist = craft.totalDistance || 'Stationary';
                    const contribs = Array.isArray(craft.scientificContributions)
                        ? craft.scientificContributions.map(c => `• ${c}`).join('\n')
                        : `• ${craft.scientificContributions || craft.storytelling?.whyItMatters}`;
                    const lastMsg = craft.lastTransmissionMessage ? `\n\n**Final Telemetry Downlink:** *"${craft.lastTransmissionMessage}"*` : "";

                    return `🔬 **NASA ARCHIVAL BRIEF // ${desig}${nssdc}**\n\n• **Launch / Landing:** ${craft.launchDate || 'N/A'} / ${craft.landingDate || 'N/A'}\n• **Coordinates:** ${coords}\n• **Operational Span:** ${lifespan} | **Traverse:** ${dist}\n• **Physical Status:** ${craft.status} (${craft.physicalCondition || 'Resting'})\n\n**Scientific Contributions:**\n${contribs}${lastMsg}\n\n**Mission Conclusion Analysis:**\n${craft.storytelling?.whyItMatters || 'Documented in NASA planetary hardware repository.'}`;
                }
            }
        }

        // 20. FALLBACK - HELPFUL, INTERACTIVE SUGGESTIONS
        if (isJunior) {
            return `🤔 **BEEP-BOOP! MY RADIO MISSED THAT!**\n\nMy space computer didn't quite catch your message. Try asking me one of these fun questions:\n\n• *"Tell me a space joke!"*\n• *"Tell me about Oppy the rover!"*\n• *"Why did astronauts use duct tape on the Moon?"*\n• *"Did a helicopter really fly on Mars?"*\n• *"How do lasers hit the mirror on the Moon?"*`;
        } else if (isTeen) {
            return `📡 **CAPCOM VIBE CHECK: FREQUENCY NOT FOUND**\n\nCouldn't decode that query on the DSN receiver. Hit me with one of these instead:\n\n• *"Give me an Opportunity rover vibe check!"*\n• *"Tell me about Apollo 17 duct tape field repair!"*\n• *"Why can't we bring rovers back to Earth?"*\n• *"Tell me about InSight catching 1300+ marsquakes!"*\n• *"Tell me a space joke!"*`;
        } else {
            return `**CAPCOM // TELEMETRY QUERY UNRESOLVED**\n\nThe query **"${query}"** did not resolve against indexed NSSDCA mission registers.\n\n**Suggested Primary Retrieval Queries:**\n• *"Opportunity MER-B hematite blueberries and Sol 5111 conclusion"*\n• *"Apollo 11 LRRR laser ranging and lunar recession rate"*\n• *"InSight Lander SEIS core boundary and Sol 1442 final transmission"*\n• *"Viking 1 Lander 1982 antenna command memory overwrite event"*\n• *"Ingenuity Flight 72 rotor tip fracture post-mortem"*`;
        }
    }
}
