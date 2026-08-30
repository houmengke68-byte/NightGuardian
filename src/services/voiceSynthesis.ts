import { VoiceType } from '../types';

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, voiceType: VoiceType = '温柔女性声', onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';

      // Pick tone/pitch/rate based on voice type
      if (voiceType === '温柔女性声') {
        utterance.pitch = 1.15;
        utterance.rate = 0.95;
      } else if (voiceType === '活泼朋友声') {
        utterance.pitch = 1.25;
        utterance.rate = 1.08;
      } else if (voiceType === '沉稳陪伴声') {
        utterance.pitch = 0.9;
        utterance.rate = 0.9;
      }

      // Try selecting a Chinese voice if available
      const voices = this.synth.getVoices();
      const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      this.isSpeaking = true;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState() {
    return this.isSpeaking;
  }
}

export const voiceEngine = new VoiceEngine();
