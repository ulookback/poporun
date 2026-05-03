// src/scenes/GameScene.js
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
  GRAVITY, OBSTACLE_SPEED_INITIAL, OBSTACLE_SPEED_INCREMENT, OBSTACLE_SPEED_MILESTONE,
  SPAWN_DELAY_MIN, SPAWN_DELAY_MAX, COLORS,
} from '../config/gameConfig.js';
import { Player }   from '../objects/Player.js';
import { Obstacle } from '../objects/Obstacle.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.isGameOver = false;
    this.score      = 0;
    this.speed      = OBSTACLE_SPEED_INITIAL;
    this.obstacles  = [];
    this.spawnTimer = null;

    this._drawBackground();
    this._drawGround();
    this._createPlayer();
    this._setupColliders();
    this._setupScore();
    this._setupInput();
    this._scheduleNextSpawn();
  }

  // ─── Background ──────────────────────────────────────────────────────────

  _drawBackground() {
    // Sky
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky).setDepth(0);

    // Moon
    this.add.circle(680, 40, 22, COLORS.moon).setDepth(1);
    this.add.circle(672, 36, 18, COLORS.sky).setDepth(2);

    // Stars
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GROUND_Y - 80);
      const r = Math.random() < 0.2 ? 1.5 : 1;
      this.add.circle(x, y, r, 0xffffff, 0.6 + Math.random() * 0.4).setDepth(1);
    }

    // Building layers — use pre-baked textures from BootScene (no pop-in)
    // Each layer is two tiles wide (2×GAME_WIDTH) positioned side by side for seamless loop
    this._buildingLayers = [
      this._makeBuildingLayer('buildings_far',  0.12),
      this._makeBuildingLayer('buildings_near', 0.25),
    ];
  }

  _makeBuildingLayer(textureKey, scrollDepth) {
    // Two tiled images side-by-side covering 2× the screen width
    const texW = GAME_WIDTH * 2;
    const img0 = this.add.image(0,       GROUND_Y, textureKey).setOrigin(0, 1).setDepth(2);
    const img1 = this.add.image(texW,    GROUND_Y, textureKey).setOrigin(0, 1).setDepth(2);
    return { img0, img1, texW, scrollDepth };
  }

  _scrollBuildings() {
    this._buildingLayers.forEach(({ img0, img1, texW, scrollDepth }) => {
      const dx = this.speed * scrollDepth * (1/60);
      img0.x -= dx;
      img1.x -= dx;
      // When the first tile scrolls fully off-screen, leap-frog it behind the second
      if (img0.x + texW <= 0) img0.x = img1.x + texW;
      if (img1.x + texW <= 0) img1.x = img0.x + texW;
    });
  }

  // ─── Ground ──────────────────────────────────────────────────────────────

  _drawGround() {
    this.add.rectangle(
      GAME_WIDTH/2, GROUND_Y + (GAME_HEIGHT - GROUND_Y)/2,
      GAME_WIDTH, GAME_HEIGHT - GROUND_Y, COLORS.ground
    ).setDepth(3);
    this.add.rectangle(GAME_WIDTH/2, GROUND_Y, GAME_WIDTH, 3, COLORS.groundLine).setDepth(4);

    this.roadMarkings = [];
    for (let i = 0; i < 6; i++) {
      this.roadMarkings.push(
        this.add.rectangle(80 + i*140, GROUND_Y+12, 60, 3, 0x1a3a5c, 0.5).setDepth(4)
      );
    }
  }

  _scrollRoad() {
    this.roadMarkings.forEach(m => {
      m.x -= this.speed * (1/60);
      if (m.x < -60) m.x += 840;
    });
  }

  // ─── Player ──────────────────────────────────────────────────────────────

  _createPlayer() {
    this.physics.world.gravity.y = GRAVITY;
    this.player = new Player(this);
  }

  // ─── Colliders ───────────────────────────────────────────────────────────

  _setupColliders() {
    this.groundBody = this.physics.add
      .staticImage(GAME_WIDTH/2, GROUND_Y+10, '__DEFAULT')
      .setSize(GAME_WIDTH, 20).setVisible(false);
    this.physics.add.collider(this.player.getSprite(), this.groundBody);
  }

  // ─── Score ───────────────────────────────────────────────────────────────

  _setupScore() {
    this.scoreText = this.add.text(GAME_WIDTH - 16, 14, 'SCORE  0', {
      fontFamily: 'Courier New', fontSize: '15px', color: '#00ff88',
      stroke: '#001a0d', strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(20);

    this.speedText = this.add.text(16, 14, '', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#336655',
    }).setOrigin(0, 0).setDepth(20);
  }

  _updateScore(delta) {
    this.score += delta / 1000;
    const rounded = Math.floor(this.score);
    this.scoreText.setText(`SCORE  ${rounded}`);

    const milestone     = Math.floor(rounded / OBSTACLE_SPEED_MILESTONE);
    const expectedSpeed = OBSTACLE_SPEED_INITIAL + milestone * OBSTACLE_SPEED_INCREMENT;
    if (expectedSpeed > this.speed) {
      this.speed = expectedSpeed;
      this.speedText.setText(`SPEED ×${(this.speed / OBSTACLE_SPEED_INITIAL).toFixed(1)}`);
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
      if (!this.isGameOver) {
        this._spawnObstacle();
        this._scheduleNextSpawn();
      }
    });
  }

  _spawnObstacle() {
    const obs = new Obstacle(this, this.speed);
    this.obstacles.push(obs);
    this.physics.add.overlap(
      this.player.getSprite(), obs.getSprite(),
      () => this._triggerGameOver(), null, this
    );
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
    this.cameras.main.flash(300, 255, 60, 60);
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
    this._scrollRoad();
    this._scrollBuildings();
  }
}
