import { ref } from 'vue';

// Shared singleton AudioContext voor alle timer sounds
// Dit voorkomt iOS Safari problemen met audio autoplay policies
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Publieke functie om audio context te initialiseren/unlocken
// Moet aangeroepen worden vanuit een user gesture (click/touch) voor iOS Safari
export function initAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    return ctx.resume();
  }
  return Promise.resolve();
}

async function playBeep() {
  const audioContext = getAudioContext();

  // Defensive: zorg dat context running is (iOS kan deze suspenden)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  gainNode.gain.value = 0.15; // 15% volume - vriendelijk voor kinderen

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1); // 100ms
}

export function useTimerSounds() {
  const hasPlayed = ref(false);

  const checkWarnings = (remainingSeconds) => {
    // Speel geluid bij 1 seconde, maar alleen 1x
    if (remainingSeconds <= 1 && remainingSeconds > 0 && !hasPlayed.value) {
      playBeep();
      hasPlayed.value = true;
    }
  };

  const reset = () => {
    hasPlayed.value = false;
  };

  return { checkWarnings, reset };
}
