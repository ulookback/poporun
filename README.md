# 🐱 Popo Run

A minimal endless runner browser game featuring **Popo**, a black demon cat with glowing green eyes, dashing through the streets of an eternal night.

---

## 🎮 How to Play

| Control | Action |
|---|---|
| `Spacebar` | Jump |
| Mouse click | Jump |
| Touch tap | Jump |

- Avoid the fences
- Survive as long as possible
- Score increases automatically over time
- Speed increases every 5 points

---

## 📁 Project Structure

```
popo-run/
├── index.html               # Entry point
├── style.css                # Global styles
├── src/
│   ├── main.js              # Game bootstrap & Phaser config
│   ├── config/
│   │   └── gameConfig.js    # All tunable constants (speed, gravity, colors…)
│   ├── scenes/
│   │   ├── BootScene.js     # Initial boot (no-op, ready for preloading)
│   │   ├── MenuScene.js     # Title screen
│   │   ├── GameScene.js     # Core gameplay loop
│   │   └── GameOverScene.js # End screen with score
│   └── objects/
│       ├── Player.js        # Popo — physics body + procedural graphics
│       └── Obstacle.js      # Fence obstacles with variants
└── assets/                  # Reserved for future real sprites/audio
```

---

## 🚀 Running Locally

### Option 1 — VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code
2. Open the `popo-run/` folder
3. Right-click `index.html` → **Open with Live Server**
4. Game opens at `http://127.0.0.1:5500`

### Option 2 — Python HTTP Server
```bash
cd popo-run
python3 -m http.server 8080
# open http://localhost:8080
```

### Option 3 — Node.js (npx serve)
```bash
cd popo-run
npx serve .
# follow the URL shown in terminal
```

### Option 4 — Node.js (http-server)
```bash
npm install -g http-server
cd popo-run
http-server -p 8080
# open http://localhost:8080
```

> ⚠️ **Do not open `index.html` directly** via `file://` — ES modules require an HTTP server.

---

## ⚙️ Configuration

All gameplay constants live in `src/config/gameConfig.js`:

| Constant | Default | Description |
|---|---|---|
| `PLAYER_JUMP_VELOCITY` | `-520` | Jump strength (more negative = higher) |
| `GRAVITY` | `1400` | Downward pull |
| `OBSTACLE_SPEED_INITIAL` | `300` | Starting obstacle speed (px/s) |
| `OBSTACLE_SPEED_INCREMENT` | `15` | Speed added per milestone |
| `OBSTACLE_SPEED_MILESTONE` | `5` | Score interval for speed increase |
| `SPAWN_DELAY_MIN` | `1100` | Min ms between obstacle spawns |
| `SPAWN_DELAY_MAX` | `2400` | Max ms between obstacle spawns |

---

## 🌐 Deployment

### Netlify (easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `popo-run/` folder onto the Netlify dashboard
3. Done — instant public URL

### GitHub Pages
```bash
# Push to GitHub, then in repo Settings → Pages:
# Source: Deploy from branch → main → / (root)
```

### Vercel
```bash
npm install -g vercel
cd popo-run
vercel
```

### Any Static Host
The entire project is static HTML/CSS/JS — upload the folder to any static host:
- Cloudflare Pages
- Firebase Hosting
- AWS S3 + CloudFront
- Surge.sh (`npx surge ./popo-run`)

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Game engine | [Phaser 3.60](https://phaser.io) (loaded from CDN) |
| Language | JavaScript ES6 modules |
| Graphics | Procedural (Phaser Graphics API) |
| Physics | Phaser Arcade Physics |
| Audio | None (MVP) |
| Build tool | None required |

---

## 🗺️ Extending the Game

The codebase is designed to be easily extensible:

| Feature | Where to add |
|---|---|
| New obstacle type | `src/objects/Obstacle.js` — add variant to `OBSTACLE_VARIANTS` |
| Sound effects | `src/scenes/BootScene.js` (preload) + call in events |
| Sprite sheets | Replace Graphics draws in `Player.js` / `Obstacle.js` |
| High score persist | `GameOverScene.js` → `localStorage` |
| New level/theme | Duplicate `GameScene.js`, swap colors in `gameConfig.js` |
| Double jump | `Player.js` → set `this.maxJumps = 2` |

---

## 🐱 About Popo

Popo is a black demon cat who runs upright through endless city streets at night. The green-eyed feline never stops — only you can save them from the fences.

*Good luck. They believe in you.*
