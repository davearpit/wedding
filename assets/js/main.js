/* Senjuti & Arpit — invitation behaviour */
(() => {
  'use strict';

  // 5:15 PM IST, 18 January 2027 (IST = UTC+5:30)
  const WEDDING = Date.UTC(2027, 0, 18, 11, 45, 0);
  const MUSIC_VOLUME = 0.5;

  // Preview helper: add ?now=2027-01-20T10:00:00+05:30 to the URL to see a future/past state
  const nowParam = new URLSearchParams(location.search).get('now');
  const clockOffset = nowParam && !isNaN(Date.parse(nowParam)) ? Date.parse(nowParam) - Date.now() : 0;
  const now = () => Date.now() + clockOffset;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const frame = $('#frame');
  const scroller = $('#scroller');
  const sections = [...document.querySelectorAll('.section')];

  // Always open on the first section, even after a reload
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scroller.scrollTop = 0;

  /* ------------------------------------------------------------------
     Section dots + active-section tracking
     ------------------------------------------------------------------ */
  const dotsNav = $('#dots');
  const dots = sections.map((sec, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', sec.getAttribute('aria-label') || `Section ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsNav.appendChild(b);
    return b;
  });

  function goTo(i) {
    const target = sections[Math.max(0, Math.min(sections.length - 1, i))];
    scroller.scrollTo({ top: target.offsetTop, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('[data-goto]').forEach(el =>
    el.addEventListener('click', () => goTo(Number(el.dataset.goto))));

  let activeIndex = 0;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const i = sections.indexOf(e.target);
        activeIndex = i;
        e.target.classList.add('is-active');
        dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
        frame.classList.toggle('on-hero', i === 0);
        updatePager();
        onSectionChange(e.target);
      }
    });
  }, { root: scroller, threshold: 0.55 });
  sections.forEach(s => io.observe(s));

  // Keyboard: one section per key press
  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('button, a')) return;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goTo(activeIndex + 1); }
    if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); goTo(activeIndex - 1); }
  });

  // Desktop wheel / trackpad: one gesture = one section (stops half-way stops on some browsers)
  // A gesture ends once the wheel has been quiet for a moment (trackpads keep firing during inertia)
  let lastJump = 0, lastWheel = 0;
  scroller.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;       // horizontal gestures — leave them
    e.preventDefault();
    const t = performance.now();
    const gestureOver = t - lastWheel > 200 && t - lastJump > 700;
    lastWheel = t;
    if (!gestureOver || Math.abs(e.deltaY) < 4) return;
    lastJump = t;
    goTo(activeIndex + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  /* ------------------------------------------------------------------
     Previous / next section
     ------------------------------------------------------------------ */
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn.addEventListener('click', () => goTo(activeIndex + 1));
  function updatePager() {
    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === sections.length - 1;
  }
  updatePager();

  /* ------------------------------------------------------------------
     Music
     Browsers only allow sound after the guest interacts with the page,
     so we try straight away and otherwise start on the first tap / click / key.
     ------------------------------------------------------------------ */
  const video = $('#heroVideo');
  const song = $('#song');
  const soundBtn = $('#soundBtn');
  let wantMusic = true;          // false once the guest mutes
  let audioCtx;

  song.volume = MUSIC_VOLUME;
  // iOS ignores audio.volume — there we route through a gain node instead.
  // (Web Audio can't read local files, so this is only used when served over http/https.)
  const needsGainNode = song.volume !== MUSIC_VOLUME && location.protocol.startsWith('http');

  // Show the button once the song file is available (it may have loaded before this script ran)
  const showSoundBtn = () => { soundBtn.hidden = false; };
  if (song.readyState >= 1) showSoundBtn();
  ['loadedmetadata', 'canplay', 'play'].forEach(ev => song.addEventListener(ev, showSoundBtn));
  song.addEventListener('error', () => { soundBtn.hidden = true; });

  function reflectSound() {
    const on = !song.paused;
    soundBtn.setAttribute('aria-pressed', String(!on));
    soundBtn.setAttribute('aria-label', on ? 'Mute music' : 'Play music');
  }
  song.addEventListener('play', reflectSound);
  song.addEventListener('pause', reflectSound);

  function startMusic() {
    if (needsGainNode && !audioCtx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtx = new Ctx();
        const gain = audioCtx.createGain();
        gain.gain.value = MUSIC_VOLUME;
        audioCtx.createMediaElementSource(song).connect(gain).connect(audioCtx.destination);
      } catch (_) { audioCtx = null; }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return song.play();
  }

  // First interaction anywhere starts the music (unless it was on the sound button itself)
  const gestureEvents = ['pointerdown', 'touchend', 'click', 'keydown'];
  function onFirstGesture(e) {
    if (soundBtn.contains(e.target)) return;
    if (!wantMusic) return stopListening();
    if (song.paused) startMusic().then(stopListening, () => {});
    else stopListening();
  }
  function stopListening() { gestureEvents.forEach(ev => document.removeEventListener(ev, onFirstGesture, true)); }
  gestureEvents.forEach(ev => document.addEventListener(ev, onFirstGesture, true));

  // Try right away — works when the browser already trusts the site
  if (!needsGainNode) startMusic().then(stopListening, () => {});

  soundBtn.addEventListener('click', () => {
    if (song.paused) { wantMusic = true; startMusic().catch(() => {}); }
    else { wantMusic = false; song.pause(); }
  });

  // Be polite: pause when the tab is hidden, resume when back
  let pausedByHide = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pausedByHide = !song.paused;
      song.pause();
    } else {
      if (pausedByHide && wantMusic) startMusic().catch(() => {});
      video.play().catch(() => {});
    }
  });

  // Keep the hero video going (some browsers pause muted autoplay when off-screen)
  video.addEventListener('pause', () => { if (!document.hidden) video.play().catch(() => {}); });
  sections[0].classList.add('is-active');

  /* ------------------------------------------------------------------
     Countdown → "We're married!"
     ------------------------------------------------------------------ */
  const cd = $('#countdown');
  const married = $('#married');
  const nums = {
    d: $('[data-unit="d"]', cd), h: $('[data-unit="h"]', cd),
    m: $('[data-unit="m"]', cd), s: $('[data-unit="s"]', cd),
  };
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  let cdTimer, lastDays = -1;
  cd.querySelectorAll('.countdown__unit').forEach(u => u.setAttribute('aria-hidden', 'true'));

  function tick() {
    const diff = WEDDING - now();
    if (diff <= 0) { showMarried(); return; }
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    if (days !== lastDays) {
      lastDays = days;
      cd.setAttribute('aria-label', `${days} days to go until the wedding`);
    }
    nums.d.textContent = pad(Math.floor(s / 86400), Math.floor(s / 86400) > 99 ? 3 : 2);
    nums.h.textContent = pad(Math.floor(s / 3600) % 24);
    nums.m.textContent = pad(Math.floor(s / 60) % 60);
    nums.s.textContent = pad(s % 60);
  }

  function showMarried() {
    clearInterval(cdTimer);
    cd.hidden = true;
    married.hidden = false;
    married.classList.add('reveal');
    // Day 1 is the wedding day itself
    $('#marriedDays').textContent = Math.floor((now() - WEDDING) / 86400000) + 1;
    const hearts = $('.married__hearts', married);
    if (!reducedMotion && !hearts.childElementCount) {
      for (let i = 0; i < 9; i++) {
        const h = document.createElement('i');
        h.style.left = `${8 + Math.random() * 84}%`;
        h.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
        h.style.scale = (0.5 + Math.random() * 0.6).toFixed(2);
        hearts.appendChild(h);
      }
    }
  }

  tick();
  cdTimer = setInterval(tick, 1000);

  /* ------------------------------------------------------------------
     Story slideshow: one photo at a time, loaded only when needed
     ------------------------------------------------------------------ */
  const show = $('#slideshow');
  const slides = [...show.querySelectorAll('.slideshow__slide')];
  const dotsWrap = $('#slideDots');
  const SLIDE_MS = 4000;
  let cur = 0, slideTimer = 0;

  const load = i => { const img = slides[i % slides.length]; if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; } };
  const slideDots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Photo ${i + 1} of ${slides.length}`);
    b.addEventListener('click', e => { e.stopPropagation(); goSlide(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });
  function goSlide(i) {
    cur = (i + slides.length) % slides.length;
    load(cur); load(cur + 1);                    // fetch the next one in the background
    slides.forEach((s, k) => s.classList.toggle('is-current', k === cur));
    slideDots.forEach((d, k) => d.setAttribute('aria-current', String(k === cur)));
  }
  function restart() {
    clearInterval(slideTimer);
    if (!reducedMotion && activeIndex === sections.indexOf($('#story'))) slideTimer = setInterval(() => goSlide(cur + 1), SLIDE_MS);
  }
  goSlide(0);

  // Tap right half = next, left half = previous; horizontal swipe also works
  let sx = null;
  show.addEventListener('pointerdown', e => { sx = e.target.closest('.slideshow__dots') ? null : e.clientX; });
  show.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 30) goSlide(cur + (dx < 0 ? 1 : -1));
    else { const r = show.getBoundingClientRect(); goSlide(cur + (e.clientX > r.left + r.width / 2 ? 1 : -1)); }
    restart();
  });
  show.addEventListener('pointercancel', () => { sx = null; });

  /* ------------------------------------------------------------------
     Venue card: Apple Maps on iPhone / iPad, Google Maps everywhere else
     ------------------------------------------------------------------ */
  const isAppleTouch = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);   // iPadOS reports as Mac
  if (isAppleTouch) {
    $('#venueLink').href = 'https://maps.apple.com/?q=Banabithi%20Resort&ll=22.4891164,88.6096105';
  }

  /* ------------------------------------------------------------------
     Petals for the closing page
     ------------------------------------------------------------------ */
  const petals = $('.petals');
  if (!reducedMotion) {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('i');
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${9 + Math.random() * 8}s`;
      p.style.animationDelay = `${-Math.random() * 14}s`;
      p.style.setProperty('--drift', `${(Math.random() * 80 - 40).toFixed(0)}px`);
      p.style.scale = (0.7 + Math.random() * 0.7).toFixed(2);
      p.style.opacity = (0.45 + Math.random() * 0.4).toFixed(2);
      petals.appendChild(p);
    }
  }

  function onSectionChange(sec) {
    if (sec.id === 'story') { load(1); restart(); } else clearInterval(slideTimer);
  }
})();
