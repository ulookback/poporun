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
    this.isGameOver  = false;
    this.score       = 0;
    this.speed       = OBSTACLE_SPEED_INITIAL;
    this.obstacles   = [];
    this.spawnTimer  = null;
    this.bgElements  = [];

    this._drawBackground();
    this._drawGround();
    this._createPlayer();
    this._setupScore();
    this._setupInput();
    this._scheduleNextSpawn();
    this._setupColliders();
  }

  // ─── Background ────────────────────────────────────────────────────────────

  _drawBackground() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky).setDepth(0);

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

    // Scrolling building layers (parallax)
    this._buildingConfigs = [
      { depth: 0.12, color: 0x0d1117, heights: [70, 50, 90, 60, 80, 55, 100, 65] },
      { depth: 0.25, color: 0x0d1b2a, heights: [55, 80, 40, 70, 60, 85, 50, 75] },
    ];

    this._buildingLayers = this._buildingConfigs.map(cfg => {
      return this._createBuildingLayer(cfg);
    });
  }

  _createBuildingLayer({ depth, color, heights }) {
    const layer = this.add.graphics().setDepth(2);
    const widths = heights.map(() => Phaser.Math.Between(40, 90));
    let x = 0;
    const positions = [];

    heights.forEach((h, i) => {
      const w = widths[i];
      layer.fillStyle(color, 1);
      layer.fillRect(x, GROUND_Y - h, w, h);
      positions.push({ x, w, h });
      x += w + Phaser.Math.Between(5, 20);
    });

    return { layer, positions, totalWidth: x, depth, color };
  }

  _scrollBuildings() {
    // Parallax: buildings scroll slower than obstacles
    this._buildingLayers.forEach(bl => {
      bl.layer.x -= this.speed * bl.depth * (1 / 60);
      if (bl.layer.x <= -bl.totalWidth) {
        bl.layer.x = 0;
      }
    });
  }

  _drawGround() {
    // Ground panel
    this.add.rectangle(
      GAME_WIDTH / 2, GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
      GAME_WIDTH, GAME_HEIGHT - GROUND_Y, COLORS.ground
    ).setDepth(3);

    // Ground line
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y, GAME_WIDTH, 3, COLORS.groundLine).setDepth(4);

    // Scrolling road markings
    this.roadMarkings = [];
    for (let i = 0; i < 6; i++) {
      const mark = this.add.rectangle(
        80 + i * 140, GROUND_Y + 12, 60, 3, 0x1a3a5c, 0.5
      ).setDepth(4);
      this.roadMarkings.push(mark);
    }
  }

  _scrollRoad() {
    this.roadMarkings.forEach(m => {
      m.x -= this.speed * (1 / 60);
      if (m.x < -60) m.x += 840;
    });
  }

  // ─── Player ────────────────────────────────────────────────────────────────

  _createPlayer() {
    this.physics.world.gravity.y = GRAVITY;
    this.player = new Player(this);
  }

  // ─── Score ─────────────────────────────────────────────────────────────────

  _setupScore() {
    this.scoreText = this.add.text(GAME_WIDTH - 16, 14, 'SCORE  0', {
      fontFamily: 'Courier New',
      fontSize: '15px',
      color: '#00ff88',
      stroke: '#001a0d',
      strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(20);

    // Speed indicator
    this.speedText = this.add.text(16, 14, '', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#336655',
    }).setOrigin(0, 0).setDepth(20);
  }

  _updateScore(delta) {
    this.score += delta / 1000 * 10;
    const rounded = Math.floor(this.score);
    this.scoreText.setText(`SCORE  ${rounded}`);

    // Speed up at milestones
    const milestone = Math.floor(rounded / OBSTACLE_SPEED_MILESTONE);
    const expectedSpeed = OBSTACLE_SPEED_INITIAL + milestone * OBSTACLE_SPEED_INCREMENT;
    if (expectedSpeed > this.speed) {
      this.speed = expectedSpeed;
      this.speedText.setText(`SPEED ×${(this.speed / OBSTACLE_SPEED_INITIAL).toFixed(1)}`);
    }
  }

  // ─── Input ─────────────────────────────────────────────────────────────────

  _setupInput() {
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.jumpKey.on('down', () => this.player.jump());

    this.input.on('pointerdown', () => this.player.jump());
  }

  // ─── Obstacles ─────────────────────────────────────────────────────────────

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
    // Register collider for this new obstacle
    this.physics.add.overlap(
      this.player.getSprite(),
      obs.getSprite(),
      () => this._triggerGameOver(),
      null,
      this
    );
  }

  _setupColliders() {
    // Ground platform (static)
    this.groundBody = this.physics.add.staticImage(GAME_WIDTH / 2, GROUND_Y + 10, '__DEFAULT')
      .setSize(GAME_WIDTH, 20).setVisible(false);
    this.physics.add.collider(this.player.getSprite(), this.groundBody);
  }

  _cleanupObstacles() {
    this.obstacles = this.obstacles.filter(obs => {
      if (obs.isOffScreen()) {
        obs.destroy();
        return false;
      }
      // Keep speed in sync
      obs.setSpeed(this.speed);
      return true;
    });
  }

  // ─── Game Over ─────────────────────────────────────────────────────────────

  _triggerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.player.die();

    // Screen flash
    this.cameras.main.flash(300, 255, 60, 60);

    // Stop spawning
    if (this.spawnTimer) this.spawnTimer.remove();

    // Freeze obstacles
    this.obstacles.forEach(o => o.sprite.setVelocityX(0));

    // Transition after brief pause
    this.time.delayedCall(800, () => {
      this.scene.start('GameOverScene', { score: Math.floor(this.score) });
    });
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  update(time, delta) {
    if (this.isGameOver) return;

    this.player.update();
    this._updateScore(delta);
    this._cleanupObstacles();
    this._scrollRoad();
    this._scrollBuildings();
  }
}
