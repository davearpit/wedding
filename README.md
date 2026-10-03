# Senjuti & Arpit — Wedding Invitation

A single-page, mobile-first invitation. Plain HTML/CSS/JS — no build step.

```
index.html            all text lives here
assets/css/style.css  styles (colours are CSS variables at the top)
assets/js/main.js     countdown, music, section snapping, timeline drift
assets/img/           optimised artwork (WebP)
assets/video/         intro video (re-encoded, silent)
assets/audio/         song.m4a (the background music)
Section 1–6/          original source artwork (kept locally, not committed)
```

## Add the song
Save it as `assets/audio/song.m4a` (AAC plays on every browser, including older iPhones). The speaker / mute button appears automatically once the file exists.
It loops at 50% volume. Browsers don't allow sound before a guest interacts with the page, so the music
starts on their first tap, click or key press (or right away, if the browser allows it).
Use the local server below to test it, because the 50% volume handling on iPhones needs the page to be served over http.

## Preview locally
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080.

To preview the after-the-wedding state, add `?now=` with any date:
`http://localhost:8080/?now=2027-01-25T10:00:00+05:30`

## Publish on GitHub Pages
1. Push this folder to a GitHub repository.
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. The site goes live at https://davearpit.github.io/wedding/ (link previews already point there).

The `Section 1–6` folders (about 14 MB of originals) and the original `music.webm` are listed in `.gitignore`, so they stay on your computer.
