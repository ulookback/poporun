// src/objects/Obstacle.js
import { GAME_WIDTH, GROUND_Y, COLORS } from '../config/gameConfig.js';

// Max safe spike height = ~72px (leaves ~24px reaction margin below jump peak of 96px)
const VARIANTS = [
  // ── Lava pools — wide, flat, low ─────────────────────────────────
  { key: 'lava_s',  w: 58,  h: 20, hitW: 54,  hitH: 13 },
  { key: 'lava_m',  w: 84,  h: 22, hitW: 80,  hitH: 13 },
  { key: 'lava_l',  w: 112, h: 24, hitW: 108, hitH: 13 },

  // ── Rocks — 3 distinct shapes, clearly visible ────────────────────
  { key: 'rock_a',  w: 46,  h: 40, hitW: 40, hitH: 34 },
  { key: 'rock_b',  w: 62,  h: 50, hitW: 56, hitH: 44 },
  { key: 'rock_c',  w: 54,  h: 58, hitW: 48, hitH: 52 },

  // ── Spikes — all safely under jump height ─────────────────────────
  { key: 'spike_s', w: 28,  h: 52, hitW: 22, hitH: 46 },
  { key: 'spike_m', w: 36,  h: 64, hitW: 30, hitH: 58 },
  { key: 'spike_l', w: 50,  h: 72, hitW: 42, hitH: 66 },  // max safe height

  // ── Fire pits ─────────────────────────────────────────────────────
  { key: 'fire_s',  w: 38,  h: 56, hitW: 30, hitH: 50 },
  { key: 'fire_l',  w: 56,  h: 72, hitW: 46, hitH: 66 },
];

export class Obstacle {
  constructor(scene, speed) {
    this.scene = scene;
    const def = Phaser.Utils.Array.GetRandom(VARIANTS);
    this._ensureTexture(def);

    // All obstacles sit flush on the ground line — bottom of sprite = GROUND_Y
    this.sprite = scene.physics.add.image(GAME_WIDTH + def.w, GROUND_Y - def.h / 2, def.key);
    this.sprite.setVelocityX(-speed);
    this.sprite.setImmovable(true);
    this.sprite.body.allowGravity = false;
    this.sprite.setDepth(9);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setSize(def.hitW, def.hitH);
  }

  _ensureTexture(def) {
    if (this.scene.textures.exists(def.key)) return;
    const g = this.scene.make.graphics({ add: false });
    const { key, w, h } = def;
    if      (key.startsWith('lava'))  this._lava(g, w, h);
    else if (key === 'rock_a')        this._rockA(g, w, h);
    else if (key === 'rock_b')        this._rockB(g, w, h);
    else if (key === 'rock_c')        this._rockC(g, w, h);
    else if (key.startsWith('spike')) this._spike(g, w, h);
    else if (key.startsWith('fire'))  this._fire(g, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  // ── Lava pool ─────────────────────────────────────────────────────────────
  // Flat glowing ellipse — deepest colour at outer ring, brightest at centre
  _lava(g, w, h) {
    g.fillStyle(0x330000, 1);
    g.fillEllipse(w/2, h - 3, w,      h - 2);
    g.fillStyle(0x991100, 1);
    g.fillEllipse(w/2, h - 4, w - 8,  h - 6);
    g.fillStyle(0xdd3300, 1);
    g.fillEllipse(w/2, h - 5, w - 18, h - 10);
    g.fillStyle(0xff6600, 1);
    g.fillEllipse(w/2, h - 6, w - 30, h - 14);
    g.fillStyle(0xff9900, 0.85);
    g.fillEllipse(w/2, h - 7, w - 42, h - 17);
    // Bright highlight streak offset left
    g.fillStyle(0xffdd00, 0.7);
    g.fillEllipse(w/2 - w*0.15, h - 8, w * 0.22, 5);
  }

  // ── Rock A — squat round boulder, HIGH CONTRAST vs background ────────────
  // Uses warm orange-tinted rock tones so it reads clearly against dark cave
  _rockA(g, w, h) {
    // Ground shadow
    g.fillStyle(0x000000, 0.5);
    g.fillEllipse(w/2 + 3, h - 2, w - 4, 9);
    // Dark base body
    g.fillStyle(0x3d1208, 1);
    g.fillEllipse(w/2 + 1, h * 0.48 + 1, w - 2, h * 0.9);
    // Main body — warm reddish-brown, clearly distinct from black cave bg
    g.fillStyle(0x6b2010, 1);
    g.fillEllipse(w/2, h * 0.46, w - 4, h * 0.86);
    // Mid highlight
    g.fillStyle(0x8c3018, 1);
    g.fillEllipse(w/2 - 2, h * 0.38, w * 0.72, h * 0.62);
    // Bright top facet
    g.fillStyle(0xb04824, 1);
    g.fillEllipse(w * 0.36, h * 0.26, w * 0.36, h * 0.28);
    // Glint
    g.fillStyle(0xd0622e, 0.8);
    g.fillEllipse(w * 0.3, h * 0.2, w * 0.16, h * 0.12);
    // Dark surface crack
    g.fillStyle(0x200608, 0.8);
    g.fillRect(w * 0.52, h * 0.34, 2, h * 0.3);
    g.fillRect(w * 0.38, h * 0.56, h * 0.18, 1);
  }

  // ── Rock B — tall irregular boulder, asymmetric ───────────────────────────
  _rockB(g, w, h) {
    g.fillStyle(0x000000, 0.5);
    g.fillEllipse(w/2 + 3, h - 2, w - 4, 9);
    // Base outline
    g.fillStyle(0x3a1008, 1);
    g.fillEllipse(w * 0.5, h * 0.52, w * 0.9, h * 0.92);
    // Main mass — two overlapping blobs for irregular shape
    g.fillStyle(0x642010, 1);
    g.fillEllipse(w * 0.46, h * 0.5,  w * 0.86, h * 0.88);
    g.fillStyle(0x5a1c0e, 1);
    g.fillEllipse(w * 0.6,  h * 0.38, w * 0.62, h * 0.60);
    // Top lit surface
    g.fillStyle(0x8a3018, 1);
    g.fillEllipse(w * 0.44, h * 0.26, w * 0.48, h * 0.28);
    g.fillStyle(0xaa4020, 0.8);
    g.fillEllipse(w * 0.38, h * 0.19, w * 0.26, h * 0.16);
    // Cracks
    g.fillStyle(0x1e0606, 0.75);
    g.fillRect(w * 0.56, h * 0.3, 2, h * 0.38);
    g.fillRect(w * 0.38, h * 0.54, w * 0.22, 1);
    // Lava crack accent at base — makes it feel hot and grounded
    g.fillStyle(0xdd3300, 0.5);
    g.fillRect(w * 0.22, h * 0.88, w * 0.55, 2);
    g.fillStyle(0xff6600, 0.3);
    g.fillRect(w * 0.3, h * 0.88, w * 0.35, 1);
  }

  // ── Rock C — tall craggy spire with sharp angles ──────────────────────────
  _rockC(g, w, h) {
    g.fillStyle(0x000000, 0.5);
    g.fillEllipse(w/2 + 2, h - 2, w - 4, 9);
    // Dark silhouette base
    g.fillStyle(0x320e08, 1);
    g.fillTriangle(w*0.08, h, w*0.46, h*0.06, w*0.92, h);
    // Secondary left peak
    g.fillStyle(0x3a1008, 1);
    g.fillTriangle(0, h, w*0.3, h*0.30, w*0.56, h);
    // Solid base fill
    g.fillStyle(0x3a1008, 1);
    g.fillRect(0, h * 0.72, w, h * 0.28);
    // Warm lit left face of main spike
    g.fillStyle(0x7a2c14, 1);
    g.fillTriangle(w*0.1, h*0.88, w*0.46, h*0.06, w*0.52, h*0.88);
    // Bright edge highlight
    g.fillStyle(0xa03c1c, 0.7);
    g.fillTriangle(w*0.14, h*0.78, w*0.44, h*0.12, w*0.48, h*0.78);
    // Dark right face
    g.fillStyle(0x220808, 1);
    g.fillTriangle(w*0.46, h*0.06, w*0.9, h*0.88, w*0.52, h*0.88);
    // Lava crack at base
    g.fillStyle(0xdd3300, 0.6);
    g.fillRect(w*0.15, h*0.9, w*0.65, 2);
    g.fillStyle(0xff5500, 0.35);
    g.fillRect(w*0.25, h*0.9, w*0.4, 1);
  }

  // ── Spike — clean stalagmite with glowing lava base ──────────────────────
  _spike(g, w, h) {
    const cx = w / 2;
    // Wide lava base glow — blends into floor naturally
    g.fillStyle(0x880000, 0.6);
    g.fillEllipse(cx, h,     w + 8, 14);
    g.fillStyle(0xcc2200, 0.5);
    g.fillEllipse(cx, h - 1, w,     10);
    g.fillStyle(0xff4400, 0.3);
    g.fillEllipse(cx, h - 2, w - 6, 6);

    // Dark silhouette body
    g.fillStyle(0x280808, 1);
    g.fillTriangle(1, h, cx, 1, w - 1, h);
    // Warm left face — makes it readable against dark bg
    g.fillStyle(0x6a2414, 1);
    g.fillTriangle(3, h, cx - 1, 5, cx + 8, h * 0.65);
    // Brighter left highlight strip
    g.fillStyle(0x8c3018, 0.8);
    g.fillTriangle(4, h * 0.9, cx - 1, 8, cx + 4, h * 0.65);
    // Dark right face
    g.fillStyle(0x160404, 1);
    g.fillTriangle(cx + 1, 5, w - 2, h, cx + 8, h * 0.55);
    // Lava vein running up the face
    g.fillStyle(0xcc2200, 0.5);
    g.fillRect(cx - 1, h * 0.28, 2, h * 0.58);
    g.fillStyle(0xff5500, 0.3);
    g.fillRect(cx - 1, h * 0.42, 1, h * 0.38);
    // Glowing tip
    g.fillStyle(0xff6600, 0.6);
    g.fillCircle(cx, 4, 3);
    g.fillStyle(0xffaa00, 0.4);
    g.fillCircle(cx, 4, 1.5);
  }

  // ── Fire pit — cauldron-style with realistic flames ───────────────────────
  // Redesigned: wide bowl/cauldron sunk into the ground, flames billow upward
  _fire(g, w, h) {
    const bh  = Math.floor(h * 0.38);  // bowl height
    const by  = h - bh;                // bowl top Y
    const cx  = w / 2;

    // ── Bowl / cauldron ────────────────────────────────────────────
    // Outer dark rim — slightly wider, creates lip effect
    g.fillStyle(0x1a0506, 1);
    g.fillEllipse(cx, by + 2, w, 14);
    // Bowl body (trapezoid — wide at top, narrower at bottom)
    g.fillStyle(0x200608, 1);
    g.fillRect(4, by + 6, w - 8, bh - 6);
    // Taper the bottom
    g.fillStyle(0x200608, 1);
    g.fillTriangle(4, h, cx, h + 2, w - 4, h);
    // Bowl inner dark recess
    g.fillStyle(0x0d0203, 1);
    g.fillEllipse(cx, by + 6, w - 10, 10);
    // Lava pool inside bowl — glowing
    g.fillStyle(0x991100, 1);
    g.fillEllipse(cx, by + 8, w - 14, 9);
    g.fillStyle(0xdd3300, 1);
    g.fillEllipse(cx, by + 8, w - 22, 6);
    g.fillStyle(0xff6600, 0.9);
    g.fillEllipse(cx, by + 8, w - 32, 4);
    // Bowl rim highlight (top edge)
    g.fillStyle(0x4a1810, 1);
    g.fillEllipse(cx, by + 2, w - 2, 8);
    g.fillStyle(0x6a2418, 0.7);
    g.fillEllipse(cx, by + 1, w - 8, 5);
    // Bowl legs / base stubs
    g.fillStyle(0x180504, 1);
    g.fillRect(cx - w*0.3 - 3, h - 8, 7, 10);
    g.fillRect(cx + w*0.3 - 4, h - 8, 7, 10);

    // ── Flames billow up from lava inside bowl ─────────────────────
    const root = by + 6;  // flames emerge from lava surface inside bowl
    // Clamp flame drawing to bowl width
    const fw = w * 0.44;

    // Outer red/dark flame wisps
    g.fillStyle(0xaa1100, 0.85);
    g.fillTriangle(cx - fw*0.9, root, cx - fw*0.1, h*0.12, cx + fw*0.3, root);
    g.fillTriangle(cx - fw*0.2, root, cx + fw*0.2, h*0.14, cx + fw*0.95, root);

    // Main orange flames
    g.fillStyle(0xff3300, 0.9);
    g.fillTriangle(cx - fw*0.7, root, cx - fw*0.05, h*0.06, cx + fw*0.5, root);
    g.fillTriangle(cx - fw*0.4, root, cx + fw*0.1,  h*0.08, cx + fw*0.8, root);

    // Bright inner flame
    g.fillStyle(0xff6600, 0.92);
    g.fillTriangle(cx - fw*0.5, root, cx,           h*0.04, cx + fw*0.5, root);
    g.fillTriangle(cx - fw*0.28,root, cx - fw*0.04, h*0.10, cx + fw*0.32,root);

    // Yellow-orange core
    g.fillStyle(0xff9900, 0.88);
    g.fillTriangle(cx - fw*0.32, root, cx, h*0.07, cx + fw*0.32, root);

    // Bright yellow tip
    g.fillStyle(0xffcc00, 0.82);
    g.fillTriangle(cx - fw*0.16, root, cx, h*0.12, cx + fw*0.16, root);

    // Small spark dots above flame tip
    g.fillStyle(0xffee44, 0.7);
    g.fillCircle(cx - 4, h*0.08, 2);
    g.fillCircle(cx + 6, h*0.05, 1.5);
    g.fillCircle(cx + 1,  h*0.03, 1);
  }

  // ── Public ───────────────────────────────────────────────────────────────
  setSpeed(s) { this.sprite.setVelocityX(-s); }
  isOffScreen() { return this.sprite.x < -150; }
  destroy() { this.sprite.destroy(); }
  getSprite() { return this.sprite; }
}
