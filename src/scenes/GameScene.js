// src/scenes/GameScene.js
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y, CEILING_Y,
  GRAVITY, OBSTACLE_SPEED_INITIAL, OBSTACLE_SPEED_INCREMENT, OBSTACLE_SPEED_MILESTONE,
  SPAWN_DELAY_MIN, SPAWN_DELAY_MAX, COLORS,
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
    this._drawGround();
    this._drawCeiling();
    this._createPlayer();
    this._setupColliders();
    this._setupScore();
    this._setupInput();
    this._scheduleNextSpawn();
  }

  // ─── Background ──────────────────────────────────────────────────────────

  _drawBackground() {
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky).setDepth(0);
    this._bgLayers = [
      this._makeBgLayer('cave_far',  0.08),
      this._makeBgLayer('cave_near', 0.20),
    ];
    this._lavaGlows = [];
    for (let i=0; i<5; i++) {
      const glow = this.add.circle(
        100+i*160+Phaser.Math.Between(-30,30), GROUND_Y+8,
        Phaser.Math.Between(12,22), COLORS.lavaDark, 0.5
      ).setDepth(3);
      this._lavaGlows.push({ obj:glow, baseX:glow.x, phase:i*1.2 });
    }
  }

  _makeBgLayer(key, depth) {
    const texW = GAME_WIDTH*2;
    const img0 = this.add.image(0,    0, key).setOrigin(0,0).setDepth(1);
    const img1 = this.add.image(texW, 0, key).setOrigin(0,0).setDepth(1);
    return { img0, img1, texW, depth };
  }

  _scrollBackground(delta) {
    this._bgLayers.forEach(({ img0, img1, texW, depth }) => {
      const dx = this.speed * depth * (delta/1000) * 18;
      img0.x -= dx; img1.x -= dx;
      if (img0.x + texW <= 0) img0.x = img1.x + texW;
      if (img1.x + texW <= 0) img1.x = img0.x + texW;
    });
  }

  _drawGround() {
    this.add.rectangle(GAME_WIDTH/2, GROUND_Y+(GAME_HEIGHT-GROUND_Y)/2,
      GAME_WIDTH, GAME_HEIGHT-GROUND_Y, COLORS.ground).setDepth(3);
    this.add.rectangle(GAME_WIDTH/2, GROUND_Y, GAME_WIDTH, 3, COLORS.groundLine).setDepth(4);
    this.add.rectangle(GAME_WIDTH/2, GROUND_Y+1, GAME_WIDTH, 1, COLORS.fireHi, 0.4).setDepth(4);
    this._lavaCracks = [];
    for (let i=0; i<5; i++)
      this._lavaCracks.push(
        this.add.rectangle(80+i*160, GROUND_Y+10, Phaser.Math.Between(20,50), 2, COLORS.lavaMid, 0.6).setDepth(4)
      );
  }

  _scrollGround() {
    this._lavaCracks.forEach(c => {
      c.x -= this.speed*(1/60);
      if (c.x < -60) c.x += GAME_WIDTH+100;
    });
  }

  _drawCeiling() {
    this.add.rectangle(GAME_WIDTH/2, CEILING_Y/2, GAME_WIDTH, CEILING_Y, COLORS.caveCeiling).setDepth(4);
    this.add.rectangle(GAME_WIDTH/2, CEILING_Y,   GAME_WIDTH, 2, COLORS.lavaDark, 0.7).setDepth(4);
  }

  _updateLavaGlow(time) {
    this._lavaGlows.forEach(g => {
      g.obj.setAlpha(Math.sin(time/600+g.phase)*0.2+0.4);
      g.obj.x = g.baseX-((time*this.speed*0.0001)%GAME_WIDTH);
      if (g.obj.x < -40) g.obj.x += GAME_WIDTH+80;
    });
  }

  // ─── Player ──────────────────────────────────────────────────────────────

  _createPlayer() {
    this.physics.world.gravity.y = GRAVITY;
    this.player = new Player(this);
  }

  _setupColliders() {
    this.groundBody = this.physics.add
      .staticImage(GAME_WIDTH/2, GROUND_Y+10, '__DEFAULT')
      .setSize(GAME_WIDTH, 20).setVisible(false);
    this.physics.add.collider(this.player.getSprite(), this.groundBody);
  }

  // ─── Score — right-aligned ────────────────────────────────────────────────

  _setupScore() {
    this.scoreText = this.add.text(GAME_WIDTH - 14, 14, 'TIME  0s', {
      fontFamily: 'Courier New', fontSize: '17px', color: '#ff8844',
      stroke: '#1a0000', strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(20);   // origin (1,0) = right-aligned

    this.speedText = this.add.text(16, 14, '', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#ff5533',
      stroke: '#1a0000', strokeThickness: 2,
    }).setOrigin(0, 0).setDepth(20);
  }

  _updateScore(delta) {
    this.score += delta/1000;
    const s = Math.floor(this.score);
    this.scoreText.setText(`TIME  ${s}s`);
    const milestone     = Math.floor(s/OBSTACLE_SPEED_MILESTONE);
    const expectedSpeed = OBSTACLE_SPEED_INITIAL + milestone*OBSTACLE_SPEED_INCREMENT;
    if (expectedSpeed > this.speed) {
      this.speed = expectedSpeed;
      this.speedText.setText(`SPEED ×${(this.speed/OBSTACLE_SPEED_INITIAL).toFixed(1)}`);
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
    this.physics.add.overlap(this.player.getSprite(), obs.getSprite(),
      () => this._triggerGameOver(), null, this);
  }

  _cleanupObstacles() {
    this.obstacles = this.obstacles.filter(obs => {
      if (obs.isOffScreen()) { obs.destroy(); return false; }
      obs.setSpeed(this.speed);
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
    this._updateScore(delta);
    this._cleanupObstacles();
    this._scrollGround();
    this._scrollBackground(delta);
    this._updateLavaGlow(time);
  }
}
