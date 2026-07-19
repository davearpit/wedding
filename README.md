# Arpit & Senjuti — Wedding Invitation

Single-screen cinematic hero invitation.

## Run

```bash
python3 -m http.server 8890
```

Open [http://127.0.0.1:8890](http://127.0.0.1:8890)  
On phone (same Wi‑Fi): `http://<your-mac-ip>:8890`

## Assets

| File | Used for |
|------|----------|
| `assets/hero.jpg` | Desktop & tablet |
| `assets/hero-mobile.jpg` | Phones (≤900px) — prefer a compressed landscape photo |

After replacing images, bump `assetsVersion` in `js/config.js`.

## Customize

Edit `js/config.js` — couple names, tagline, image paths, framing, motion.
