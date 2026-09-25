// Web Audio API Ding-Dong Chime & Web Speech Voice Synthesizer

class NotificationSoundService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled = true;

  constructor() {
    // Lazily init AudioContext on first user interaction
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Play a smooth two-tone chime (Ding-Dong like McDonald's / KFC counter)
  public playChime() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Tone 1 (High bell - 587.33 Hz / D5)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Tone 2 (Lower bell - 440 Hz / A4)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.25);
      gain2.gain.setValueAtTime(0.35, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.9);
    } catch (e) {
      console.warn('Audio chime could not play:', e);
    }
  }

  // Speak announcement in Spanish: "Orden [num] lista para entrega"
  public announceOrderReady(orderNumber: number) {
    if (!this.soundEnabled) return;

    // First play bell chime
    this.playChime();

    if ('speechSynthesis' in window) {
      setTimeout(() => {
        try {
          window.speechSynthesis.cancel(); // Stop any pending utterance
          const text = `Orden número ${orderNumber}, lista para entrega en mostrador.`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'es-BO'; // or es-ES / es-MX
          utterance.rate = 0.95;
          utterance.pitch = 1.05;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('Speech synthesis error:', e);
        }
      }, 700);
    }
  }
}

export const soundService = new NotificationSoundService();
