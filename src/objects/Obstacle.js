// src/objects/Obstacle.js
//
// ─── HOW TO ADD A NEW OBSTACLE ───────────────────────────────────────────────
// 1. Drop PNG into assets/obstacles/obs_myname.png (square transparent canvas)
// 2. Load in BootScene.preload():  this.load.image('obs_myname','assets/obstacles/obs_myname.png')
// 3. Measure pixelsBelow: open PNG, find lowest visible row → pixelsBelow = canvas - 1 - that_row
// 4. Add entry to VARIANTS:
//      { key:'obs_myname', canvas:220, pixelsBelow:60, hitW:150, hitH:70 }
//    hitW/hitH = collision box covering only solid parts (not flames/sparks)
// ─────────────────────────────────────────────────────────────────────────────

import { GAME_WIDTH, GROUND_Y } from '../config/gameConfig.js';

const GAME_SCALE = 0.53;

// Where the cat's feet land (must match Player.js calculation):
// GROUND_Y - CAT_LIFT + CAT_PIXELS_BELOW * CAT_SCALE  ... simplified:
// cat_feet = GROUND_Y - 20 + 20*0.45 = GROUND_Y - 11
const CAT_FEET_Y = GROUND_Y - 20 + 20 * 0.45;   // = 263 when GROUND_Y=274

// Obstacle visual base must land at exactly CAT_FEET_Y.
// With origin(0.5,1): sprite.y = canvas bottom position
// visual_base = sprite.y - pixelsBelow * GAME_SCALE
// → sprite.y  = CAT_FEET_Y + pixelsBelow * GAME_SCALE

const VARIANTS = [
  // ── Lava pools ─────────────────────────────────────────────────
  { key:'obs_lava_1',  canvas:194, pixelsBelow:5, hitW:170, hitH:150 },
  { key:'obs_lava_2',  canvas:196, pixelsBelow:5, hitW:172, hitH:150 },

  // ── Fire pits ──────────────────────────────────────────────────
  { key:'obs_fire_1',  canvas:195, pixelsBelow:5, hitW:156, hitH:150 },
  { key:'obs_fire_2',  canvas:199, pixelsBelow:5, hitW:159, hitH:150 },

  // ── Rocks ──────────────────────────────────────────────────────
  { key:'obs_rock_1',  canvas:166, pixelsBelow:5,  hitW:139, hitH:100 },
  { key:'obs_rock_2',  canvas:196, pixelsBelow:0,  hitW:164, hitH:130 },
  { key:'obs_rock_3',  canvas:194, pixelsBelow:10,  hitW:162, hitH:127 },
  { key:'obs_rock_4',  canvas:195, pixelsBelow:10,  hitW:163, hitH:117 },

  // ── Spikes ─────────────────────────────────────────────────────
  { key:'obs_spike_1', canvas:181, pixelsBelow:5,  hitW:137, hitH:90 },
  { key:'obs_spike_2', canvas:192, pixelsBelow:5,  hitW:145, hitH:84 },
  { key:'obs_spike_3', canvas:191, pixelsBelow:5,  hitW:145, hitH:100 },
  { key:'obs_spike_4', canvas:195, pixelsBelow:5,  hitW:148, hitH:73 },

  // ── Skulls ─────────────────────────────────────────────────────
  { key:'obs_skull_1', canvas:196, pixelsBelow:5,  hitW:164, hitH:102 },
  { key:'obs_skull_2', canvas:194, pixelsBelow:5,  hitW:162, hitH:95  },
  { key:'obs_skull_3', canvas:195, pixelsBelow:5,  hitW:163, hitH:95  },
];

export class Obstacle {
  constructor(scene, speed) {
    this.scene = scene;
    const def  = Phaser.Utils.Array.GetRandom(VARIANTS);

    // Spawn X: off-screen right, accounting for scaled canvas width
    const spawnX = GAME_WIDTH + (def.canvas * GAME_SCALE) / 2 + 10;

    // Spawn Y: canvas bottom placed so visual base = CAT_FEET_Y
    const spawnY = CAT_FEET_Y + def.pixelsBelow * GAME_SCALE;

    this.sprite = scene.physics.add.image(spawnX, spawnY, def.key);
    this.sprite.setScale(GAME_SCALE);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(9);
    this.sprite.setImmovable(true);
    this.sprite.body.allowGravity = false;
    this.sprite.body.moves = false;

    // Initial velocity — set once, never update mid-frame to avoid wobble
    // this.sprite.setVelocityX(-speed);
    this.sprite.body.moves = false;
    this._speed = speed;
    this._x = GAME_WIDTH + (def.canvas * GAME_SCALE) / 2 + 10;

    // ── Hitbox ───────────────────────────────────────────────────────
    // Centre horizontally; place vertically at the solid base of the sprite.
    // offsetY in pre-scale pixels from body top-left (which is canvas top for origin(0.5,1))
    const offsetX = (def.canvas - def.hitW) / 2;
    const offsetY = def.canvas - def.pixelsBelow - def.hitH;
    this.sprite.setSize(def.hitW, def.hitH);
    this.sprite.setOffset(offsetX, Math.max(0, offsetY));
  }

  // Only update velocity when speed milestone changes — avoids per-frame wobble
  setSpeed(s)   { this._speed = s; }
  update(delta) { this._x -= this._speed * (delta / 1000); this.sprite.x = this._x; }
  isOffScreen() { return this._x < -300; }

  isOffScreen() { return this.sprite.x < -300; }
  destroy()     { this.sprite.destroy(); }
  getSprite()   { return this.sprite; }
}
