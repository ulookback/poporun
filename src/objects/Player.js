// src/objects/Player.js
import { PLAYER_X, GROUND_Y, PLAYER_JUMP_VELOCITY } from '../config/gameConfig.js';

const RUN_FRAMES = ['popo_run1', 'popo_run2', 'popo_run3'];
const RUN_FPS    = 140; // ms per frame

export class Player {
  constructor(scene) {
    this.scene     = scene;
    this.isAlive   = true;
    this.jumpCount = 0;
    this.maxJumps  = 1;

    this._runFrameIdx   = 0;
    this._runFrameTimer = 0;
    this._state         = 'idle';

    // All sprites are 200×200px, centred canvases
    // Scale so the cat body is ~80px tall in-game
    this._scale = 0.45;

    this.sprite = scene.physics.add.image(PLAYER_X, GROUND_Y, 'popo_idle');
    this.sprite.setScale(this._scale);
    this.sprite.setDepth(10);
    // Origin at bottom-centre so the cat stands on the ground line
    this.sprite.setOrigin(0.5, 1);

    // Hitbox: tighter than the full canvas — just the cat body
    // 200 * 0.45 = 90px canvas in-game; cat body is roughly 55% of canvas width, 60% of height
    this.sprite.setSize(100, 130);   // hitbox in sprite-local pixels (pre-scale)
    this.sprite.setOffset(50, 55);   // nudge to centre over the body
  }

  jump() {
    if (!this.isAlive) return;
    const onGround = this.sprite.body.blocked.down;
    if (onGround || this.jumpCount < this.maxJumps) {
      this.sprite.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.jumpCount = onGround ? 1 : this.jumpCount + 1;
      this._setState('jump');
    }
  }

  die() {
    if (!this.isAlive) return;
    this.isAlive = false;
    this._setState('dead');
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.55,
      duration: 350,
      ease: 'Power2',
    });
  }

  update(delta) {
    if (!this.isAlive) return;
    const onGround = this.sprite.body.blocked.down;

    if (!onGround) {
      if (this._state !== 'jump') this._setState('jump');
    } else {
      if (this._state === 'jump' || this._state === 'idle') {
        this.jumpCount = 0;
        this._setState('run');
      }
    }

    if (this._state === 'run' && onGround) {
      this._runFrameTimer += delta;
      if (this._runFrameTimer >= RUN_FPS) {
        this._runFrameTimer = 0;
        this._runFrameIdx   = (this._runFrameIdx + 1) % RUN_FRAMES.length;
        this.sprite.setTexture(RUN_FRAMES[this._runFrameIdx]);
      }
    }
  }

  getSprite() { return this.sprite; }

  _setState(state) {
    if (this._state === state) return;
    this._state = state;
    switch (state) {
      case 'run':
        this._runFrameIdx   = 0;
        this._runFrameTimer = 0;
        this.sprite.setTexture(RUN_FRAMES[0]);
        break;
      case 'jump': this.sprite.setTexture('popo_jump'); break;
      case 'dead': this.sprite.setTexture('popo_dead'); break;
      case 'idle': this.sprite.setTexture('popo_idle'); break;
    }
  }
}
