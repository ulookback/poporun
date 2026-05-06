// src/objects/Player.js
import { PLAYER_X, GROUND_Y, PLAYER_JUMP_VELOCITY } from '../config/gameConfig.js';
import { getAudio } from './AudioManager.js';

const RUN_FRAMES = ['popo_run1', 'popo_run2', 'popo_run3'];
const RUN_FPS    = 140;

export class Player {
  constructor(scene) {
    this.scene     = scene;
    this.isAlive   = true;
    this.jumpCount = 0;
    this.maxJumps  = 2;    // double jump enabled

    this._runFrameIdx   = 0;
    this._runFrameTimer = 0;
    this._state         = 'idle';
    this._scale         = 0.45;

    this.sprite = scene.physics.add.image(PLAYER_X, GROUND_Y, 'popo_idle');
    this.sprite.setScale(this._scale);
    this.sprite.setDepth(10);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setSize(100, 130);
    this.sprite.setOffset(50, 55);
  }

  jump() {
    if (!this.isAlive) return;
    const onGround = this.sprite.body.blocked.down;
    if (onGround) this.jumpCount = 0;
    if (this.jumpCount < this.maxJumps) {
      this.sprite.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.jumpCount++;
      this._setState('jump');
      const audio = getAudio(this.scene);
      if (audio) audio.playJump();
    }
  }

  die() {
    if (!this.isAlive) return;
    this.isAlive = false;
    this._setState('dead');
    const audio = getAudio(this.scene);
    if (audio) audio.playFail();
    this.scene.tweens.add({ targets: this.sprite, alpha: 0.55, duration: 350, ease: 'Power2' });
  }

  update(delta) {
    if (!this.isAlive) return;
    const onGround = this.sprite.body.blocked.down;
    if (onGround) {
      this.jumpCount = 0;
      if (this._state === 'jump' || this._state === 'idle') this._setState('run');
    } else {
      if (this._state !== 'jump') this._setState('jump');
    }
    if (this._state === 'run' && onGround) {
      this._runFrameTimer += delta;
      if (this._runFrameTimer >= RUN_FPS) {
        this._runFrameTimer = 0;
        this._runFrameIdx = (this._runFrameIdx + 1) % RUN_FRAMES.length;
        this.sprite.setTexture(RUN_FRAMES[this._runFrameIdx]);
      }
    }
  }

  getSprite() { return this.sprite; }

  _setState(state) {
    if (this._state === state) return;
    this._state = state;
    switch (state) {
      case 'run':  this._runFrameIdx=0; this._runFrameTimer=0; this.sprite.setTexture(RUN_FRAMES[0]); break;
      case 'jump': this.sprite.setTexture('popo_jump'); break;
      case 'dead': this.sprite.setTexture('popo_dead'); break;
      case 'idle': this.sprite.setTexture('popo_idle'); break;
    }
  }
}
