/**
 * Edit values here only.
 */
export const CONFIG = {
  assetsVersion: "20260719c",

  couple: {
    display: "Arpit & Senjuti",
    tagline: "are getting married",
  },

  hero: {
    imageSrc: "assets/hero.jpg",
    imageSrcMobile: "assets/hero-mobile.jpg",
    imageAlt: "Arpit and Senjuti",
    objectPosition: "top center",
    objectPositionMobile: "top center",
  },

  wallpaper: {
    desktopFit: "contain",
    mobileFit: "cover",
    kenBurnsDesktop: false,
    kenBurnsMobile: true,
    mobileBreakpoint: 900,
  },

  event: {
    dateLabel: "18th January 2027",
    placeLabel: "The City of Joy – Kolkata",
    // 7:00 PM IST on 18 January 2027
    countdownTarget: "2027-01-18T19:00:00+05:30",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230926.27414000238!2d88.2636414!3d22.5743545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027713d9e71863%3A0xc939971e723e057b!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },

  collage: {
    images: [
      { src: "assets/collage-images/01-landscape.svg", alt: "Memory 1", aspect: "landscape" },
      { src: "assets/collage-images/02-portrait.svg", alt: "Memory 2", aspect: "portrait" },
      { src: "assets/collage-images/03-landscape.svg", alt: "Memory 3", aspect: "landscape" },
      { src: "assets/collage-images/04-portrait.svg", alt: "Memory 4", aspect: "portrait" },
      { src: "assets/collage-images/05-landscape.svg", alt: "Memory 5", aspect: "landscape" },
      { src: "assets/collage-images/06-portrait.svg", alt: "Memory 6", aspect: "portrait" },
    ],
  },

  audio: {
    src: "assets/music.mp3",
    volume: 0.22,
  },

  motion: {
    heroNameFade: 2,
    heroTextZoomMaxScale: 1.09,
    heroTextZoomDuration: 55,
    kenBurnsScale: 1.03,
    screenTransition: 1.1,
    detailsCrossfade: 0.85,
    respectReducedMotion: true,
  },
};
