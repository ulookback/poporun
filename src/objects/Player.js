// src/objects/Player.js
import { PLAYER_X, GROUND_Y, PLAYER_JUMP_VELOCITY, COLORS } from '../config/gameConfig.js';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.isAlive = true;
    this.jumpCount = 0;
    this.maxJumps = 1;

    this.sprite = scene.physics.add.image(PLAYER_X, GROUND_Y - 28, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(0);
    this.sprite.setDepth(10);
    this.sprite.setOrigin(0.5, 1);

    this._buildTexture();
  }

  _buildTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const w = 32, h = 56;

    // Body
    g.fillStyle(COLORS.playerBody, 1);
    g.fillRoundedRect(6, 16, 20, 28, 6);

    // Head
    g.fillStyle(COLORS.playerBody, 1);
    g.fillCircle(16, 12, 13);

    // Ears (pointed demon ears)
    g.fillTriangle(6, 4, 2, -6, 12, 2);
    g.fillTriangle(26, 4, 30, -6, 20, 2);

    // Eyes - green
    g.fillStyle(COLORS.playerEye, 1);
    g.fillEllipse(11, 11, 6, 7);
    g.fillEllipse(21, 11, 6, 7);

    // Pupils
    g.fillStyle(COLORS.playerPupil, 1);
    g.fillEllipse(11, 12, 3, 4);
    g.fillEllipse(21, 12, 3, 4);

    // Tail - series of filled triangles (avoids bezierCurveTo which is unsupported here)
    g.fillStyle(COLORS.playerBody, 1);
    g.fillTriangle(2, 34, -4, 30, -2, 38);
    g.fillTriangle(-4, 30, -10, 38, -2, 38);
    g.fillTriangle(-10, 38, -8, 46, -2, 42);
    g.fillTriangle(-8, 46, 0, 50, 2, 44);

    // Legs
    g.fillStyle(COLORS.playerBody, 1);
    g.fillRoundedRect(8, 42, 7, 14, 3);
    g.fillRoundedRect(17, 42, 7, 14, 3);

    // Feet
    g.fillRoundedRect(6, 52, 10, 5, 2);
    g.fillRoundedRect(16, 52, 10, 5, 2);

    // Arms
    g.fillRoundedRect(2, 20, 6, 16, 3);
    g.fillRoundedRect(24, 20, 6, 16, 3);

    g.generateTexture('player', w, h);
    g.destroy();

    this.sprite.setTexture('player');
    this.sprite.setSize(22, 52);
    this.sprite.setOffset(5, 4);
  }

  jump() {
    if (!this.isAlive) return;
    const onGround = this.sprite.body.blocked.down;
    if (onGround || this.jumpCount < this.maxJumps) {
      this.sprite.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.jumpCount = onGround ? 1 : this.jumpCount + 1;
    }
  }

  resetJumpCount() {
    if (this.sprite.body.blocked.down) {
      this.jumpCount = 0;
    }
  }

  die() {
    this.isAlive = false;
    this.scene.tweens.add({
      targets: this.sprite,
      angle: 90,
      alpha: 0.4,
      duration: 400,
      ease: 'Power2',
    });
  }

  update() {
    this.resetJumpCount();
    if (this.sprite.body.blocked.down) {
      const t = this.scene.time.now / 80;
      this.sprite.y = (GROUND_Y - 28) + Math.sin(t) * 1.5;
    }
  }

  getSprite() {
    return this.sprite;
  }
}
