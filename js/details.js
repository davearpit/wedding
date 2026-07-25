/**
 * Section 2 — event details & live countdown.
 */

import { CONFIG } from "./config.js";
import { qs } from "./utils.js";

let countdownTimer = null;

function pad(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function updateCountdown(targetMs, els) {
  const remaining = targetMs - Date.now();

  if (remaining <= 0) {
    els.days.textContent = "00";
    els.hours.textContent = "00";
    els.minutes.textContent = "00";
    els.seconds.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  els.days.textContent = pad(days);
  els.hours.textContent = pad(hours);
  els.minutes.textContent = pad(minutes);
  els.seconds.textContent = pad(seconds);
}

export function initDetails() {
  const dateEl = qs("[data-details-date]");
  const placeEl = qs("[data-details-place]");
  const mapEl = qs("[data-details-map]");

  if (dateEl) dateEl.textContent = CONFIG.event.dateLabel;
  if (placeEl) placeEl.textContent = CONFIG.event.placeLabel;
  if (mapEl) mapEl.src = CONFIG.event.mapEmbedUrl;

  const els = {
    days: qs("[data-countdown-days]"),
    hours: qs("[data-countdown-hours]"),
    minutes: qs("[data-countdown-minutes]"),
    seconds: qs("[data-countdown-seconds]"),
  };

  if (!els.days || !els.hours || !els.minutes || !els.seconds) return;

  const targetMs = new Date(CONFIG.event.countdownTarget).getTime();
  updateCountdown(targetMs, els);
  countdownTimer = window.setInterval(() => updateCountdown(targetMs, els), 1000);
}

export function destroyDetails() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}
