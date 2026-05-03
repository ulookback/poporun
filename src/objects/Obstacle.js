// src/objects/Obstacle.js
import { GAME_WIDTH, GROUND_Y, COLORS } from '../config/gameConfig.js';

// Obstacle types with varying heights/widths for visual variety
const OBSTACLE_VARIANTS = [
  { w: 24, h: 48, label: 'tall_fence' },
  { w: 40, h: 32, label: 'wide_fence' },
  { w: 28, h: 56, label: 'spike_fence' },
];

export class Obstacle {
  constructor(scene, speed) {
    this.scene = scene;

    const variant = Phaser.Utils.Array.GetRandom(OBSTACLE_VARIANTS);
    this._buildTexture(variant);

    const spawnX = GAME_WIDTH + variant.w;
    const spawnY = GROUND_Y - variant.h / 2;

    this.sprite = scene.physics.add.image(spawnX, spawnY, `obstacle_${variant.label}`);
    this.sprite.setVelocityX(-speed);
    this.sprite.setImmovable(true);
    this.sprite.body.allowGravity = false;
    this.sprite.setDepth(9);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setSize(variant.w - 4, variant.h);
  }

  _buildTexture(variant) {
    const key = `obstacle_${variant.label}`;
    if (this.scene.textures.exists(key)) return;

    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const { w, h } = variant;

    // Fence post(s)
    g.fillStyle(COLORS.obstaclePlank, 1);

    if (variant.label === 'tall_fence' || variant.label === 'spike_fence') {
      // Two posts
      g.fillRoundedRect(2, 8, 8, h - 8, 2);
      g.fillRoundedRect(w - 10, 8, 8, h - 8, 2);

      // Cross planks
      g.fillStyle(COLORS.obstacle, 1);
      g.fillRect(0, h * 0.25, w, 5);
      g.fillRect(0, h * 0.55, w, 5);

      if (variant.label === 'spike_fence') {
        // Spiky tops
        g.fillStyle(COLORS.obstaclePlank, 1);
        g.fillTriangle(4, 8, 8, 0, 12, 8);
        g.fillTriangle(w - 12, 8, w - 8, 0, w - 4, 8);
      } else {
        // Flat tops with nail dots
        g.fillStyle(COLORS.obstacle, 1);
        g.fillCircle(6, 10, 2);
        g.fillCircle(w - 6, 10, 2);
      }
    } else {
      // Wide fence: three posts
      g.fillRoundedRect(2, 6, 7, h - 6, 2);
      g.fillRoundedRect(w / 2 - 3, 6, 7, h - 6, 2);
      g.fillRoundedRect(w - 9, 6, 7, h - 6, 2);

      g.fillStyle(COLORS.obstacle, 1);
      g.fillRect(0, h * 0.2, w, 5);
      g.fillRect(0, h * 0.55, w, 5);

      // Top crossbar
      g.fillStyle(COLORS.obstaclePlank, 1);
      g.fillRect(0, 0, w, 7);
    }

    g.generateTexture(key, w, h);
    g.destroy();
  }

  setSpeed(speed) {
    this.sprite.setVelocityX(-speed);
  }

  isOffScreen() {
    return this.sprite.x < -100;
  }

  destroy() {
    this.sprite.destroy();
  }

  getSprite() {
    return this.sprite;
  }
}
