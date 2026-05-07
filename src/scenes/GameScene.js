// src/scenes/GameScene.js
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
  GRAVITY, OBSTACLE_SPEED_INITIAL, OBSTACLE_SPEED_INCREMENT, OBSTACLE_SPEED_MILESTONE,
  SPAWN_DELAY_MIN, SPAWN_DELAY_MAX,
} from '../config/gameConfig.js';
import { Player }   from '../objects/Player.js';
import { Obstacle } from '../objects/Obstacle.js';
import { getAudio } from '../objects/AudioManager.js';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    this.isGameOver = false;
    this.score      = 0;
    this.speed      = OBSTACLE_SPEED_INITIAL;
    this.obstacles  = [];
    this.spawnTimer = null;

    this._drawBackground();
    this._createPlayer();
    this._setupColliders();
    this._setupScore();
    this._setupInput();
    this._scheduleNextSpawn();
  }

  // ─── Background ──────────────────────────────────────────────────────────

  _drawBackground() {
    this._bg0 = this.add.image(0,           0, 'bg_game').setOrigin(0, 0).setDepth(0);
    this._bg1 = this.add.image(GAME_WIDTH*2, 0, 'bg_game').setOrigin(0, 0).setDepth(0);
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.15).setDepth(1);
  }

  // Background scrolls at exactly the same px/s as obstacles so everything
  // feels grounded — the floor tiles move with the hazards.
  _scrollBackground(delta) {
    const dx = this.speed * (delta / 1000);
    this._bg0.x -= dx;
    this._bg1.x -= dx;
    const tileW = GAME_WIDTH * 2;
    if (this._bg0.x + tileW <= 0) this._bg0.x = this._bg1.x + tileW;
    if (this._bg1.x + tileW <= 0) this._bg1.x = this._bg0.x + tileW;
  }

  // ─── Player ──────────────────────────────────────────────────────────────

  _createPlayer() {
    this.physics.world.gravity.y = GRAVITY;
    this.player = new Player(this);
  }

  _setupColliders() {
    // groundY for collider = CAT_FEET_Y = GROUND_Y-20+20*0.45
    this.groundBody = this.physics.add
      .staticImage(GAME_WIDTH/2, 269, '__DEFAULT')
      .setSize(GAME_WIDTH, 20)
      .setVisible(false);
    this.physics.add.collider(this.player.getSprite(), this.groundBody);
  }

  // ─── Score ───────────────────────────────────────────────────────────────

  _setupScore() {
    this.scoreText = this.add.text(GAME_WIDTH - 14, 14, 'TIME  0s', {
      fontFamily: 'Courier New', fontSize: '17px', color: '#ff8844',
      stroke: '#1a0000', strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(20);

    this.speedText = this.add.text(16, 14, '', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#ff5533',
      stroke: '#1a0000', strokeThickness: 2,
    }).setOrigin(0, 0).setDepth(20);
  }

  _updateScore(delta) {
    this.score += delta / 1000;
    const s = Math.floor(this.score);
    this.scoreText.setText(`TIME  ${s}s`);
    const milestone     = Math.floor(s / OBSTACLE_SPEED_MILESTONE);
    const expectedSpeed = OBSTACLE_SPEED_INITIAL + milestone * OBSTACLE_SPEED_INCREMENT;
    if (expectedSpeed > this.speed) {
      this.speed = expectedSpeed;
      this.speedText.setText(`SPEED ×${(this.speed / OBSTACLE_SPEED_INITIAL).toFixed(1)}`);
      // Update all existing obstacles to new speed at once
      this.obstacles.forEach(obs => obs.setSpeed(this.speed));
    }
  }

  

  // ─── Input ───────────────────────────────────────────────────────────────

  _setupInput() {
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.jumpKey.on('down', () => this.player.jump());
    this.input.on('pointerdown', () => this.player.jump());
  }

  // ─── Obstacles ───────────────────────────────────────────────────────────

  _scheduleNextSpawn() {
    const delay = Phaser.Math.Between(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX);
    this.spawnTimer = this.time.delayedCall(delay, () => {
      if (!this.isGameOver) { this._spawnObstacle(); this._scheduleNextSpawn(); }
    });
  }

  _spawnObstacle() {
    const obs = new Obstacle(this, this.speed);
    this.obstacles.push(obs);
    this.physics.add.collider(
      this.player.getSprite(), obs.getSprite(),
      () => this._triggerGameOver(), null, this
    );
  }

  _cleanupObstacles() {
    this.obstacles = this.obstacles.filter(obs => {
      if (obs.isOffScreen()) { obs.destroy(); return false; }
      return true;
    });
  }

  // ─── Game Over ───────────────────────────────────────────────────────────

  _triggerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.player.die();
    this.cameras.main.flash(400, 255, 40, 0);
    if (this.spawnTimer) this.spawnTimer.remove();
    this.obstacles.forEach(o => o.sprite.setVelocityX(0));
    this.time.delayedCall(900, () => {
      this.scene.start('GameOverScene', { score: Math.floor(this.score) });
    });
  }

  // ─── Update ──────────────────────────────────────────────────────────────

  update(time, delta) {
    if (this.isGameOver) return;
    this.player.update(delta);
    this.obstacles.forEach(obs => obs.update(delta));
    this._updateScore(delta);
    this._cleanupObstacles();
    this._scrollBackground(delta);
  }
}
