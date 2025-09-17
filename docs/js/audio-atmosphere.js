/**
 * Drakkenheim Audio Atmosphere System
 * Creates subtle, immersive horror audio that responds to user interactions
 */

class DrakkenheimAudioAtmosphere {
    constructor() {
        this.audioContext = null;
        this.isEnabled = false;
        this.volume = 0.15; // Keep it subtle
        this.sources = {};
        this.oscillators = {};
        this.userInteracted = false;

        // Audio state
        this.ambientPlaying = false;
        this.lastInteraction = Date.now();

        // Initialize on first user interaction (browser requirement)
        this.initializeOnInteraction();
    }

    initializeOnInteraction() {
        const initHandler = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                this.initialize();
                // Remove listeners after first interaction
                document.removeEventListener('click', initHandler);
                document.removeEventListener('keydown', initHandler);
                document.removeEventListener('scroll', initHandler);
            }
        };

        document.addEventListener('click', initHandler);
        document.addEventListener('keydown', initHandler);
        document.addEventListener('scroll', initHandler);
    }

    initialize() {
        // Check for Web Audio API support
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            console.log('Web Audio API not supported');
            return;
        }

        try {
            this.audioContext = new AudioContext();
            this.setupAudioNodes();
            this.bindEventListeners();
            this.isEnabled = true;

            // Start ambient atmosphere after a short delay
            setTimeout(() => this.startAmbientAtmosphere(), 1000);
        } catch (e) {
            console.log('Audio initialization failed:', e);
        }
    }

    setupAudioNodes() {
        // Master gain for volume control
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.audioContext.destination);

        // Reverb for ethereal effect
        this.convolver = this.audioContext.createConvolver();
        this.convolver.connect(this.masterGain);

        // Create impulse response for reverb
        this.createReverbImpulse();

        // Filters for different effects
        this.lowPassFilter = this.audioContext.createBiquadFilter();
        this.lowPassFilter.type = 'lowpass';
        this.lowPassFilter.frequency.value = 800;
        this.lowPassFilter.connect(this.convolver);

        this.highPassFilter = this.audioContext.createBiquadFilter();
        this.highPassFilter.type = 'highpass';
        this.highPassFilter.frequency.value = 100;
        this.highPassFilter.connect(this.lowPassFilter);
    }

    createReverbImpulse() {
        const length = this.audioContext.sampleRate * 3; // 3 second reverb
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Exponential decay with some randomness for organic feel
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }

        this.convolver.buffer = impulse;
    }

    bindEventListeners() {
        // Navigation hover - crystalline resonance
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('mouseenter', () => this.playCrystallineChime());
            link.addEventListener('click', () => this.playContaminationSpread());
        });

        // FAQ items - organic breathing
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('mouseenter', () => this.playOrganicBreath());
            item.addEventListener('click', () => this.playInfectionPulse());
        });

        // Buttons - mutation sounds
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => this.playMutationWhisper());
            btn.addEventListener('click', () => this.playCorruptionClick());
        });

        // Content cards - subtle membrane sounds
        document.querySelectorAll('.content').forEach(content => {
            content.addEventListener('mouseenter', () => this.playMembraneRustle());
        });

        // Scroll - distant corruption
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            if (!this.scrollSoundPlaying) {
                this.playDistantCorruption();
                this.scrollSoundPlaying = true;
            }
            scrollTimeout = setTimeout(() => {
                this.scrollSoundPlaying = false;
            }, 300);
        });

        // Page visibility change - fade in/out
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.fadeOut();
            } else {
                this.fadeIn();
            }
        });
    }

    startAmbientAtmosphere() {
        if (!this.isEnabled || this.ambientPlaying) return;

        this.ambientPlaying = true;

        // Deep drone - the ever-present corruption
        this.createAmbientDrone();

        // Occasional whispers
        this.scheduleWhispers();

        // Random crystalline sounds
        this.scheduleCrystalSounds();
    }

    createAmbientDrone() {
        if (!this.audioContext) return;

        // Create multiple oscillators for rich drone
        const drone1 = this.audioContext.createOscillator();
        const drone2 = this.audioContext.createOscillator();
        const drone3 = this.audioContext.createOscillator();

        // Very low frequencies for deep rumble
        drone1.frequency.value = 40;
        drone2.frequency.value = 41.5;
        drone3.frequency.value = 60;

        drone1.type = 'sine';
        drone2.type = 'triangle';
        drone3.type = 'sine';

        // Create subtle LFO for movement
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.1; // Very slow
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 2;

        lfo.connect(lfoGain);
        lfoGain.connect(drone1.frequency);
        lfoGain.connect(drone2.frequency);

        // Connect through gain nodes for control
        const droneGain = this.audioContext.createGain();
        droneGain.gain.value = 0.03; // Very subtle

        drone1.connect(droneGain);
        drone2.connect(droneGain);
        drone3.connect(droneGain);
        droneGain.connect(this.highPassFilter);

        // Start oscillators
        drone1.start();
        drone2.start();
        drone3.start();
        lfo.start();

        // Store references for cleanup
        this.oscillators.drone = [drone1, drone2, drone3, lfo];
    }

    playCrystallineChime() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Create a metallic crystalline sound
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();

        osc1.frequency.value = 800 + Math.random() * 400; // 800-1200 Hz
        osc2.frequency.value = osc1.frequency.value * 1.5; // Harmonic

        osc1.type = 'sine';
        osc2.type = 'triangle';

        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(0.05, now + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc1.connect(envelope);
        osc2.connect(envelope);
        envelope.connect(this.convolver);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
    }

    playOrganicBreath() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Use noise for breath-like sound
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;

        // Breath envelope
        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(0.03, now + 0.2);
        envelope.gain.linearRampToValueAtTime(0.01, now + 0.4);
        envelope.gain.linearRampToValueAtTime(0, now + 0.6);

        // Filter for breath characteristics
        const breathFilter = this.audioContext.createBiquadFilter();
        breathFilter.type = 'bandpass';
        breathFilter.frequency.value = 400;
        breathFilter.Q.value = 1;

        noise.connect(breathFilter);
        breathFilter.connect(envelope);
        envelope.connect(this.highPassFilter);

        noise.start(now);
        noise.stop(now + 0.6);
    }

    playInfectionPulse() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Deep pulse with harmonics
        const fundamental = 60 + Math.random() * 20;

        for (let i = 1; i <= 3; i++) {
            const osc = this.audioContext.createOscillator();
            osc.frequency.value = fundamental * i;
            osc.type = i === 1 ? 'sine' : 'triangle';

            const gain = this.audioContext.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08 / i, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(this.lowPassFilter);

            osc.start(now);
            osc.stop(now + 0.3);
        }
    }

    playContaminationSpread() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Swept noise for spreading effect
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.2);

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1000, now + 0.2);
        filter.Q.value = 5;

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.convolver);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playMutationWhisper() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Multiple detuned oscillators for whisper effect
        for (let i = 0; i < 3; i++) {
            const osc = this.audioContext.createOscillator();
            osc.frequency.value = 200 + Math.random() * 100 + i * 50;
            osc.type = 'sine';

            const gain = this.audioContext.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.02, now + 0.1);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);

            // Add tremolo
            const tremolo = this.audioContext.createOscillator();
            tremolo.frequency.value = 6;
            const tremoloGain = this.audioContext.createGain();
            tremoloGain.gain.value = 5;

            tremolo.connect(tremoloGain);
            tremoloGain.connect(osc.frequency);

            osc.connect(gain);
            gain.connect(this.convolver);

            osc.start(now + i * 0.05);
            osc.stop(now + 0.5);
            tremolo.start(now);
            tremolo.stop(now + 0.5);
        }
    }

    playCorruptionClick() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Sharp transient with decay
        const osc = this.audioContext.createOscillator();
        osc.frequency.value = 1000;
        osc.type = 'square';

        const clickEnv = this.audioContext.createGain();
        clickEnv.gain.setValueAtTime(0.1, now);
        clickEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        // Add some body to the click
        const body = this.audioContext.createOscillator();
        body.frequency.value = 150;
        body.type = 'sine';

        const bodyEnv = this.audioContext.createGain();
        bodyEnv.gain.setValueAtTime(0.08, now);
        bodyEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(clickEnv);
        body.connect(bodyEnv);
        clickEnv.connect(this.highPassFilter);
        bodyEnv.connect(this.lowPassFilter);

        osc.start(now);
        osc.stop(now + 0.02);
        body.start(now);
        body.stop(now + 0.1);
    }

    playMembraneRustle() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Filtered noise for rustling
        const bufferSize = this.audioContext.sampleRate * 0.2;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.05;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;

        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(0.02, now + 0.05);
        envelope.gain.linearRampToValueAtTime(0, now + 0.2);

        noise.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.convolver);

        noise.start(now);
        noise.stop(now + 0.2);
    }

    playDistantCorruption() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Low rumble with random modulation
        const osc = this.audioContext.createOscillator();
        osc.frequency.value = 30 + Math.random() * 20;
        osc.type = 'sine';

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.3);
        gain.gain.linearRampToValueAtTime(0, now + 1);

        osc.connect(gain);
        gain.connect(this.lowPassFilter);

        osc.start(now);
        osc.stop(now + 1);
    }

    scheduleWhispers() {
        if (!this.isEnabled || !this.ambientPlaying) return;

        // Random whispers every 10-30 seconds
        const interval = 10000 + Math.random() * 20000;

        setTimeout(() => {
            this.playMutationWhisper();
            this.scheduleWhispers();
        }, interval);
    }

    scheduleCrystalSounds() {
        if (!this.isEnabled || !this.ambientPlaying) return;

        // Random crystal sounds every 15-45 seconds
        const interval = 15000 + Math.random() * 30000;

        setTimeout(() => {
            this.playCrystallineChime();
            this.scheduleCrystalSounds();
        }, interval);
    }

    fadeOut() {
        if (this.masterGain) {
            this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        }
    }

    fadeIn() {
        if (this.masterGain) {
            this.masterGain.gain.exponentialRampToValueAtTime(this.volume, this.audioContext.currentTime + 1);
        }
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.exponentialRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.1);
        }
    }

    destroy() {
        // Clean up oscillators
        Object.values(this.oscillators).flat().forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });

        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }

        this.isEnabled = false;
        this.ambientPlaying = false;
    }
}

// Initialize the audio atmosphere when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.drakkenheimAudio = new DrakkenheimAudioAtmosphere();
    });
} else {
    window.drakkenheimAudio = new DrakkenheimAudioAtmosphere();
}

// Add volume control UI
document.addEventListener('DOMContentLoaded', () => {
    const volumeControl = document.createElement('div');
    volumeControl.className = 'audio-controls';
    volumeControl.innerHTML = `
        <button class="audio-toggle" title="Toggle ambient sound">
            <span class="audio-icon">🔊</span>
        </button>
        <input type="range" class="audio-volume" min="0" max="100" value="15" title="Adjust volume">
    `;
    document.body.appendChild(volumeControl);

    // Handle volume changes
    const volumeSlider = volumeControl.querySelector('.audio-volume');
    volumeSlider.addEventListener('input', (e) => {
        if (window.drakkenheimAudio) {
            window.drakkenheimAudio.setVolume(e.target.value / 100);
        }
    });

    // Handle toggle
    const toggleBtn = volumeControl.querySelector('.audio-toggle');
    let audioEnabled = true;
    toggleBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        if (window.drakkenheimAudio) {
            if (audioEnabled) {
                window.drakkenheimAudio.setVolume(volumeSlider.value / 100);
                toggleBtn.querySelector('.audio-icon').textContent = '🔊';
            } else {
                window.drakkenheimAudio.setVolume(0);
                toggleBtn.querySelector('.audio-icon').textContent = '🔇';
            }
        }
    });
});