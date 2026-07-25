/**
 * Asset preloader & loading screen.
 */

import { CONFIG } from "./config.js";

function assetUrl(path) {
  const v = CONFIG.assetsVersion;
  return v ? `${path}?v=${encodeURIComponent(v)}` : path;
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ src, ok: true });
    img.onerror = () => resolve({ src, ok: false });
    img.src = assetUrl(src);
  });
}

function preloadAudio(src) {
  return new Promise((resolve) => {
    const audio = new Audio();
    const done = (ok) => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
      resolve({ src, ok });
    };
    const onReady = () => done(true);
    const onError = () => done(false);
    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.src = assetUrl(src);
    audio.load();
  });
}

export function collectAssets() {
  const images = [
    CONFIG.hero.imageSrc,
    CONFIG.hero.imageSrcMobile,
    ...CONFIG.collage.images.map((item) => item.src),
  ];

  return {
    images: [...new Set(images)],
    audio: CONFIG.audio.src,
  };
}

export async function preloadAssets(onProgress) {
  const { images, audio } = collectAssets();
  const tasks = [
    ...images.map((src) => preloadImage(src)),
    preloadAudio(audio),
  ];
  const total = tasks.length;
  let completed = 0;

  const results = await Promise.all(
    tasks.map((task) =>
      task.then((result) => {
        completed += 1;
        onProgress?.(completed / total);
        return result;
      }),
    ),
  );

  return results;
}

export function initLoader({ fillEl, rootEl }) {
  return {
    setProgress(ratio) {
      const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (rootEl?.querySelector("[role='progressbar']")) {
        rootEl.querySelector("[role='progressbar']").setAttribute("aria-valuenow", String(pct));
      }
    },
    hide() {
      rootEl?.classList.add("is-hidden");
      rootEl?.setAttribute("aria-hidden", "true");
    },
  };
}
