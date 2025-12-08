import { ref } from 'vue';

const THRESHOLDS = [60, 30, 10, 1];

const SOUND_CONFIG = {
  60: { frequency: 400, duration: 150, count: 1 },   // Lage beep (1x)
  30: { frequency: 600, duration: 150, count: 2 },   // Hogere beep (2x)
  10: { frequency: 800, duration: 150, count: 3 },   // Nog hoger (3x)
  1:  { frequency: 1000, duration: 150, count: 3 },  // Hoogste (3x)
};

function playBeep(frequency, duration, count = 1) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const playOnce = async () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.15; // 15% volume - vriendelijk voor kinderen

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);

    return new Promise(resolve =>
      setTimeout(resolve, duration + 100) // 100ms pauze tussen beeps
    );
  };

  // Speel sequentieel voor multi-beep waarschuwingen
  (async () => {
    for (let i = 0; i < count; i++) {
      await playOnce();
    }
  })();
}

export function useTimerSounds(durationInSeconds) {
  const triggeredWarnings = ref(new Set());

  const checkWarnings = (remainingSeconds) => {
    // Filter alleen drempels die binnen de timer duur vallen
    const applicableThresholds = THRESHOLDS.filter(
      t => t < durationInSeconds
    );

    for (const threshold of applicableThresholds) {
      // Check of we bij de drempel zijn EN deze nog niet is afgespeeld
      if (remainingSeconds <= threshold &&
          remainingSeconds > threshold - 1 &&
          !triggeredWarnings.value.has(threshold)) {

        const config = SOUND_CONFIG[threshold];
        playBeep(config.frequency, config.duration, config.count);
        triggeredWarnings.value.add(threshold);
      }
    }
  };

  const reset = () => {
    triggeredWarnings.value.clear();
  };

  return { checkWarnings, reset };
}
