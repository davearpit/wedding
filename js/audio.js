/**
 * Background music — autoplay with interaction fallback.
 */

import { CONFIG } from "./config.js";
import { assetUrl, qs } from "./utils.js";

let audioEl = null;
let toggleBtn = null;
let started = false;

function setPlayingState(isPlaying) {
  if (!toggleBtn) return;
  toggleBtn.classList.toggle("is-playing", isPlaying);
  toggleBtn.setAttribute("aria-pressed", String(isPlaying));
  toggleBtn.setAttribute("aria-label", isPlaying ? "Mute background music" : "Unmute background music");
}

async function tryPlay() {
  if (!audioEl || started) return;

  try {
    await audioEl.play();
    started = true;
    setPlayingState(true);
  } catch {
    setPlayingState(false);
  }
}

function togglePlayback() {
  if (!audioEl) return;

  if (audioEl.paused) {
    audioEl
      .play()
      .then(() => {
        started = true;
        setPlayingState(true);
      })
      .catch(() => setPlayingState(false));
  } else {
    audioEl.pause();
    setPlayingState(false);
  }
}

export function initAudio() {
  audioEl = qs("[data-audio]");
  toggleBtn = qs("[data-audio-toggle]");

  if (!audioEl || !toggleBtn) return;

  audioEl.src = assetUrl(CONFIG.audio.src);
  audioEl.volume = CONFIG.audio.volume;
  toggleBtn.hidden = false;

  toggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePlayback();
  });

  tryPlay();

  const unlock = () => {
    if (!started) tryPlay();
  };

  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });
}

export function resumeOnNavigate() {
  if (!audioEl || started) return;
  tryPlay();
}
