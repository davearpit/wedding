/**
 * Wedding invitation — entry point.
 */

import { initAudio, resumeOnNavigate } from "./audio.js";
import { initCollage } from "./collage.js";
import { initDetails } from "./details.js";
import { initHero } from "./hero.js";
import { initLoader, preloadAssets } from "./loader.js";
import { initNavigation } from "./navigation.js";
import { qs } from "./utils.js";

async function boot() {
  const loaderRoot = qs("[data-loader]");
  const loaderFill = qs("[data-loader-fill]");

  const loader = initLoader({
    rootEl: loaderRoot,
    fillEl: loaderFill,
  });

  loader.setProgress(0);

  await preloadAssets((ratio) => loader.setProgress(ratio));
  loader.setProgress(1);

  initHero();
  initDetails();
  initCollage();
  initAudio();

  initNavigation({
    navigateCallback: () => resumeOnNavigate(),
  });

  window.setTimeout(() => loader.hide(), 350);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
