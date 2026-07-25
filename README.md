# Arpit & Senjuti — Wedding Invitation

Single-page cinematic wedding invitation with hero, event details, and photo collage.

## Run

```bash
python3 -m http.server 8890
```

Open [http://127.0.0.1:8890](http://127.0.0.1:8890)  
On phone (same Wi‑Fi): `http://<your-mac-ip>:8890`

## Navigation

- Mouse wheel, click anywhere, Enter, Space, arrow keys
- Circular scroll buttons at bottom (down) and top (up)

## Assets

| File | Used for |
|------|----------|
| `assets/hero.jpg` | Desktop & tablet hero |
| `assets/hero-mobile.jpg` | Phones (≤900px) |
| `assets/music.mp3` | Background music |
| `assets/collage-images/*` | Section 2 collage (replace with your photos) |

After replacing assets, bump `assetsVersion` in `js/config.js`.

## Customize

Edit `js/config.js` — couple names, event date, map URL, collage images, audio, and motion.
