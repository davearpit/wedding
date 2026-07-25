/**
 * Shared helpers.
 */

import { CONFIG } from "./config.js";

export function qs(sel) {
  return document.querySelector(sel);
}

export function prefersReducedMotion() {
  return (
    CONFIG.motion.respectReducedMotion &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function assetUrl(path) {
  const v = CONFIG.assetsVersion;
  return v ? `${path}?v=${encodeURIComponent(v)}` : path;
}
