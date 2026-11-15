/**
 * Procedural Space Telemetry Audio Engine
 * Uses the Web Audio API to generate authentic retro radio static,
 * Apollo Quindar tones, satellite telemetry chirp, and teletype audio.
 */

class AudioTelemetryEngine {
    constructor() {
        this.ctx = null;
        this.staticNode = null;
        this.staticGain = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.initialized = true;
    }

    ensureContext() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.staticGain) {
            this.staticGain.gain.setValueAtTime(this.isMuted ? 0 : 0.03, this.ctx ? this.ctx.currentTime : 0);
        }
        return this.isMuted;
    }

    /**
     * Authentic Apollo Quindar Beep
     * 2524 Hz tone burst used by NASA to key remote radio transmitters
     */
    playQuindarTone() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2524, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.01);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    /**
     * Planetary Telemetry Chirp (Beep on marker hover or selection)
     */
    playBlip(freq = 880, duration = 0.08) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    /**
     * Ambient Deep Space Radio Static
     */
    startCosmicRadio() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx || this.staticNode) return;

        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02; // Pink-ish noise filter
            lastOut = output[i];
            output[i] *= 1.5;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1200;
        bandpass.Q.value = 3.0;

        this.staticGain = this.ctx.createGain();
        this.staticGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

        whiteNoise.connect(bandpass);
        bandpass.connect(this.staticGain);
        this.staticGain.connect(this.ctx.destination);

        whiteNoise.start();
        this.staticNode = whiteNoise;
    }

    /**
     * Authentic Book Page Turn / Shimmer sound effect
     */
    playPageTurn() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);
        filter.Q.value = 2.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.16);
    }

    /**
     * Soft paper landing tap when turning leaf settles
     */
    playPaperLand() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
    }

    /**
     * Sol / Teletype mechanical tick for incoming transcript stream
     */
    playTeletypeTick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
    }

    /**
     * Plays a dramatic "Last Signal" sound sequence based on equipment telemetry type
     */
    playLastTransmissionSequence(type) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        if (type === 'apollo-quindar') {
            this.playQuindarTone();
            return;
        }

        // Fading carrier wave sequence
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const baseFreq = type === 'rotor-spin' ? 220 : (type === 'seismic-pulse' ? 180 : 750);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, this.ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }

    /**
     * Clear & Understandable Voice Synthesizer (Web Speech API)
     * Speaks narrations with clear, natural cadence and high-fidelity speech synthesis
     */
    speakCadetVoice(text) {
        if (this.isMuted) return;
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*_#]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.95; // Comfortable, easy-to-follow speaking rate
            utterance.pitch = 1.0; // Natural, realistic pitch (no grating robotic distortion)
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            // Blacklist antique/novelty robotic voices that sound distorted or unintelligible
            const avoidNames = ['Fred', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos', 'Deranged', 'Good News', 'Hysterical', 'Pipe Organ', 'Trinoids', 'Whisper', 'Zarvox', 'Albert', 'Kathy', 'Princess', 'Ralph', 'Vicki', 'Victoria'];
            const validVoices = voices.filter(v => v.lang && v.lang.startsWith('en') && !avoidNames.some(bad => v.name.includes(bad)));
            
            // Prioritize clear, natural, modern voices
            const preferred = validVoices.find(v => 
                v.name.includes('Samantha') || 
                v.name.includes('Alex') || 
                v.name.includes('Ava') || 
                v.name.includes('Karen') || 
                v.name.includes('Daniel') || 
                v.name.includes('Serena') || 
                v.name.includes('Natural') || 
                v.name.includes('Google US English')
            ) || validVoices[0] || voices[0];

            if (preferred) utterance.voice = preferred;

            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.warn('Speech synthesis unavailable:', err);
        }
    }

    /**
     * Cartoon Spring Boing SFX (Kids interactive bounce)
     */
    playCartoonBoing() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.35);

        mod.type = 'triangle';
        mod.frequency.setValueAtTime(14, this.ctx.currentTime);
        modGain.gain.setValueAtTime(50, this.ctx.currentTime);
        modGain.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + 0.35);

        mod.connect(modGain);
        modGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        mod.start();
        osc.start();
        mod.stop(this.ctx.currentTime + 0.38);
        osc.stop(this.ctx.currentTime + 0.38);
    }

    /**
     * Retro Sci-Fi Space Laser Blast (Kids comic interaction)
     */
    playLaserZap() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.16);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
    }

    /**
     * Cheerful Kids Fanfare / Victory Arpeggio (C5 -> E5 -> G5 -> C6)
     */
    playKidsFanfare() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + (idx * 0.08);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.06, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.22);
        });
    }

    /**
     * Playful Robot Giggle / Chatter Beeps
     */
    playRoboticGiggle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const freqs = [1200, 1500, 1800, 1600, 2000];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + (idx * 0.05);

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.03, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.05);
        });
    }

    /**
     * Retro Dual Laser Blast (Pew-Pew!)
     */
    playDoubleLaser() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        [0, 0.09].forEach(delay => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = this.ctx.currentTime + delay;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(2200, t);
            osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.12);
        });
    }

    /**
     * Retro 8-Bit Coin / Star Collect Chime (Sparkly arcade pickup)
     */
    playCoinPickup() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, t); // B5
        osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.setValueAtTime(0.08, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
    }

    /**
     * Arcade Level-Up / Power-Up Chime (Ascending magic fanfare)
     */
    playPowerUp() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const chord = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, i) => {
            const t = this.ctx.currentTime + (i * 0.06);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.07, t + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.22);
        });
    }

    /**
     * Rocket Thruster Roar / Liftoff Whoosh
     */
    playRocketBoost() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const dur = 0.55;
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - (i / bufferSize) * 0.3);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, t);
        filter.frequency.exponentialRampToValueAtTime(1400, t + 0.25);
        filter.frequency.exponentialRampToValueAtTime(250, t + dur);
        filter.Q.value = 4.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(t);
        noise.stop(t + dur);
    }

    /**
     * Hyperspace Warp Jump / Cosmic Sci-Fi Sweep
     */
    playWarpSpeed() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(2400, t + 0.4);

        gain.gain.setValueAtTime(0.03, t);
        gain.gain.linearRampToValueAtTime(0.09, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.45);
    }

    /**
     * Droid Alien Chatter / R2-D2 Whistles
     */
    playAlienChatter() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const pattern = [
            { f: 880, d: 0.05 },
            { f: 1400, d: 0.07 },
            { f: 1100, d: 0.04 },
            { f: 1900, d: 0.08 },
            { f: 1300, d: 0.06 }
        ];

        let cursor = this.ctx.currentTime;
        pattern.forEach(step => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(step.f, cursor);

            gain.gain.setValueAtTime(0.03, cursor);
            gain.gain.exponentialRampToValueAtTime(0.0001, cursor + step.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(cursor);
            osc.stop(cursor + step.d);
            cursor += step.d + 0.02;
        });
    }

    /**
     * Bubble Pop / Playful Squeak for kids clicking items
     */
    playPopSound() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.045);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.045);
    }

    /**
     * Cheerful Cosmic Music Jingle (8-bit Adventure theme)
     */
    playKidsMusicJingle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const melody = [
            { f: 392.00, d: 0.12 }, // G4
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.16 }, // G5
            { f: 880.00, d: 0.16 }, // A5
            { f: 783.99, d: 0.16 }, // G5
            { f: 1046.50, d: 0.32 } // C6
        ];

        let cursor = this.ctx.currentTime;
        melody.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, cursor);

            gain.gain.setValueAtTime(0, cursor);
            gain.gain.linearRampToValueAtTime(0.05, cursor + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, cursor + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(cursor);
            osc.stop(cursor + item.d);
            cursor += item.d * 0.95;
        });
    }
}

export const telemetryAudio = new AudioTelemetryEngine();
