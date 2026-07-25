/**
 * Hero screen — preserve existing behavior.
 */

import { CONFIG } from "./config.js";
import { assetUrl, prefersReducedMotion, qs } from "./utils.js";

let heroTextZoomTween = null;
let kenBurnsTween = null;

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${CONFIG.wallpaper.mobileBreakpoint}px)`).matches;
}

function shouldKenBurns() {
  if (prefersReducedMotion()) return false;
  return isMobileViewport()
    ? CONFIG.wallpaper.kenBurnsMobile
    : CONFIG.wallpaper.kenBurnsDesktop;
}

function startKenBurns(ken) {
  kenBurnsTween?.kill();
  if (!ken || !shouldKenBurns()) {
    gsap.set(ken, { scale: 1 });
    return;
  }

  gsap.set(ken, { scale: 1 });
  kenBurnsTween = gsap.to(ken, {
    scale: CONFIG.motion.kenBurnsScale,
    duration: 22,
    ease: "none",
    repeat: -1,
    yoyo: true,
  });
}

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

export function initHero() {
  const heroTitle = qs("[data-hero-title]");
  const namesText = qs("[data-hero-names-text]");
  const tagline = qs("[data-hero-tagline]");
  const ken = qs("[data-hero-kenburns]");
  const img = qs("[data-hero-image]");
  const mobileSource = qs("[data-hero-source-mobile]");

  if (!heroTitle || !img) return;

  img.src = assetUrl(CONFIG.hero.imageSrc);
  img.alt = CONFIG.hero.imageAlt;

  if (mobileSource) {
    mobileSource.srcset = assetUrl(CONFIG.hero.imageSrcMobile);
  }

  document.documentElement.style.setProperty(
    "--hero-object-position",
    CONFIG.hero.objectPosition,
  );
  document.documentElement.style.setProperty(
    "--hero-object-position-mobile",
    CONFIG.hero.objectPositionMobile,
  );
  document.documentElement.style.setProperty(
    "--wallpaper-fit-desktop",
    CONFIG.wallpaper.desktopFit,
  );
  document.documentElement.style.setProperty(
    "--wallpaper-fit-mobile",
    CONFIG.wallpaper.mobileFit,
  );

  if (namesText) namesText.textContent = CONFIG.couple.display;
  if (tagline) tagline.textContent = CONFIG.couple.tagline;

  if (prefersReducedMotion()) {
    gsap.set(heroTitle, { opacity: 1, y: 0, scale: 1, visibility: "visible" });
    return;
  }

  gsap.fromTo(
    heroTitle,
    { opacity: 0, y: 22, scale: 0.93, visibility: "hidden" },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: "visible",
      duration: CONFIG.motion.heroNameFade,
      ease: "power2.out",
      delay: 0.3,
      onComplete: () => startHeroTextZoom(heroTitle),
    },
  );

  if (ken) {
    startKenBurns(ken);
    window
      .matchMedia(`(max-width: ${CONFIG.wallpaper.mobileBreakpoint}px)`)
      .addEventListener("change", () => startKenBurns(ken));
  }
}
