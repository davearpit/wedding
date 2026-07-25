/**
 * Full-screen navigation between hero and section 2 sub-views.
 */

import { CONFIG } from "./config.js";
import { prefersReducedMotion, qs } from "./utils.js";

const SCREENS = {
  HERO: 0,
  DETAILS: 1,
  INVITE: 2,
};

let currentScreen = SCREENS.HERO;
let isAnimating = false;
let wheelLocked = false;

let screensEl = null;
let wallpaperMediaEl = null;
let infoView = null;
let inviteView = null;
let scrollDownBtn = null;
let scrollUpBtn = null;
let onNavigate = null;

function updateNavButtons() {
  const showDown = currentScreen < SCREENS.INVITE;
  const showUp = currentScreen > SCREENS.HERO;

  if (scrollDownBtn) {
    scrollDownBtn.hidden = false;
    scrollDownBtn.classList.toggle("is-hidden", !showDown);
  }

  if (scrollUpBtn) {
    scrollUpBtn.hidden = false;
    scrollUpBtn.classList.toggle("is-hidden", !showUp);
  }
}

function setDetailsView(view) {
  const showInfo = view === "info";
  infoView?.classList.toggle("is-active", showInfo);
  inviteView?.classList.toggle("is-active", !showInfo);
}

function animateSectionTransition(targetScreen) {
  const reduced = prefersReducedMotion();
  const duration = reduced ? 0.01 : CONFIG.motion.screenTransition;
  const yPercent = targetScreen === SCREENS.HERO ? 0 : -100;
  const wallpaperY = targetScreen === SCREENS.HERO ? 0 : "-100svh";

  return new Promise((resolve) => {
    if (!screensEl) {
      resolve();
      return;
    }

    if (reduced) {
      gsap.set(screensEl, { yPercent });
      if (wallpaperMediaEl) gsap.set(wallpaperMediaEl, { y: wallpaperY });
      resolve();
      return;
    }

    if (wallpaperMediaEl) {
      gsap.to(wallpaperMediaEl, {
        y: wallpaperY,
        duration,
        ease: "power3.inOut",
      });
    }

    gsap.to(screensEl, {
      yPercent,
      duration,
      ease: "power3.inOut",
      onComplete: resolve,
    });
  });
}

async function goToScreen(targetScreen) {
  if (isAnimating || targetScreen === currentScreen) return;
  if (targetScreen < SCREENS.HERO || targetScreen > SCREENS.INVITE) return;

  isAnimating = true;

  const leavingHero = currentScreen === SCREENS.HERO && targetScreen >= SCREENS.DETAILS;
  const enteringHero = targetScreen === SCREENS.HERO && currentScreen >= SCREENS.DETAILS;
  const sectionChanged = leavingHero || enteringHero;

  if (sectionChanged) {
    if (targetScreen >= SCREENS.DETAILS) {
      setDetailsView(targetScreen === SCREENS.DETAILS ? "info" : "invite");
    }
    await animateSectionTransition(targetScreen);
  } else {
    setDetailsView(targetScreen === SCREENS.DETAILS ? "info" : "invite");
    await new Promise((resolve) => {
      window.setTimeout(resolve, prefersReducedMotion() ? 0 : CONFIG.motion.detailsCrossfade * 1000);
    });
  }

  currentScreen = targetScreen;
  updateNavButtons();
  onNavigate?.(currentScreen);
  isAnimating = false;
}

function nextScreen() {
  goToScreen(Math.min(currentScreen + 1, SCREENS.INVITE));
}

function prevScreen() {
  goToScreen(Math.max(currentScreen - 1, SCREENS.HERO));
}

function isInteractiveTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest("button, a, input, textarea, select, iframe, [data-no-nav], .audio-toggle, .nav-scroll"),
  );
}

function onWheel(event) {
  if (wheelLocked || isAnimating) return;
  event.preventDefault();

  wheelLocked = true;
  window.setTimeout(() => {
    wheelLocked = false;
  }, prefersReducedMotion() ? 50 : 900);

  if (event.deltaY > 0) nextScreen();
  else if (event.deltaY < 0) prevScreen();
}

function onKeyDown(event) {
  if (isAnimating || event.metaKey || event.ctrlKey || event.altKey) return;

  const key = event.key;
  if (["ArrowDown", "ArrowRight", "Enter", " "].includes(key)) {
    event.preventDefault();
    nextScreen();
  } else if (["ArrowUp", "ArrowLeft"].includes(key)) {
    event.preventDefault();
    prevScreen();
  }
}

function onDocumentClick(event) {
  if (isAnimating || isInteractiveTarget(event.target)) return;
  nextScreen();
}

export function initNavigation({ navigateCallback } = {}) {
  screensEl = qs("[data-screens]");
  wallpaperMediaEl = qs("[data-hero-kenburns]");
  infoView = qs('[data-details-view="info"]');
  inviteView = qs('[data-details-view="invite"]');
  scrollDownBtn = qs("[data-scroll-down]");
  scrollUpBtn = qs("[data-scroll-up]");
  onNavigate = navigateCallback;

  setDetailsView("info");
  updateNavButtons();

  scrollDownBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    nextScreen();
  });

  scrollUpBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    prevScreen();
  });

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  document.addEventListener("click", onDocumentClick);

  return {
    getCurrentScreen: () => currentScreen,
    goToScreen,
    nextScreen,
    prevScreen,
  };
}

export { SCREENS };
