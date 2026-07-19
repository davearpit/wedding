/**
 * Hero — Arpit & Senjuti
 */

import { CONFIG } from "./config.js";

function qs(sel) {
  return document.querySelector(sel);
}

function prefersReducedMotion() {
  return (
    CONFIG.motion.respectReducedMotion &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function assetUrl(path) {
  const v = CONFIG.assetsVersion;
  return v ? `${path}?v=${encodeURIComponent(v)}` : path;
}

let heroTextZoomTween = null;

function startHeroTextZoom(heroTitle) {
  heroTextZoomTween?.kill();
  if (!heroTitle || prefersReducedMotion()) return;

  gsap.set(heroTitle, { scale: 1 });
  heroTextZoomTween = gsap.to(heroTitle, {
    scale: CONFIG.motion.heroTextZoomMaxScale,
    duration: CONFIG.motion.heroTextZoomDuration,
    ease: "power3.out",
  });
}

function initHero() {
  const heroTitle = qs("[data-hero-title]");
  const namesText = qs("[data-hero-names-text]");
  const tagline = qs("[data-hero-tagline]");
  const ken = qs("[data-hero-kenburns]");
  const img = qs("[data-hero-image]");
  const mobileSource = qs("[data-hero-source-mobile]");

  img.src = assetUrl(CONFIG.hero.imageSrc);
  img.alt = CONFIG.hero.imageAlt;
  img.style.objectPosition = CONFIG.hero.objectPosition;

  mobileSource.srcset = assetUrl(CONFIG.hero.imageSrcMobile);
  document.documentElement.style.setProperty(
    "--hero-object-position-mobile",
    CONFIG.hero.objectPositionMobile,
  );

  namesText.textContent = CONFIG.couple.display;
  tagline.textContent = CONFIG.couple.tagline;

  if (prefersReducedMotion()) {
    gsap.set(heroTitle, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  gsap.fromTo(
    heroTitle,
    { opacity: 0, y: 22, scale: 0.93 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: CONFIG.motion.heroNameFade,
      ease: "power2.out",
      delay: 0.3,
      onComplete: () => startHeroTextZoom(heroTitle),
    },
  );

  gsap.to(ken, {
    scale: CONFIG.motion.kenBurnsScale,
    duration: 22,
    ease: "none",
    repeat: -1,
    yoyo: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHero);
} else {
  initHero();
}
