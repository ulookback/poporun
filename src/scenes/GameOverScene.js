// src/scenes/GameOverScene.js
import { GAME_WIDTH, GAME_HEIGHT, COLORS, GROUND_Y } from '../config/gameConfig.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    this._drawBackground();
    this._drawUI();
    this._setupInput();
  }

  _drawBackground() {
    // Dark overlay
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.75).setDepth(0);

    // Subtle grid pattern
    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1, COLORS.groundLine, 0.15);
    for (let x = 0; x < GAME_WIDTH; x += 40) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 30) g.lineBetween(0, y, GAME_WIDTH, y);
  }

  _drawUI() {
    // Panel background
    const panelH = 200;
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 360, panelH, 0x0a0f1a, 0.95)
      .setStrokeStyle(2, COLORS.playerEye).setDepth(5);

    // "GAME OVER" title
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 72, 'GAME OVER', {
      fontFamily: 'Courier New',
      fontSize: '34px',
      color: '#ff4444',
      stroke: '#330000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(10);

    // Flash the title
    this.tweens.add({
      targets: title,
      alpha: 0.5,
      yoyo: true, repeat: -1,
      duration: 500,
    });

    // Score
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 28, `SCORE`, {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: '#336655',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 4, `${this.finalScore}`, {
      fontFamily: 'Courier New',
      fontSize: '36px',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(10);

    // Buttons
    this._makeButton(GAME_WIDTH / 2 - 85, GAME_HEIGHT / 2 + 68, '↺  RETRY',   () => this.scene.start('GameScene'));
    this._makeButton(GAME_WIDTH / 2 + 85, GAME_HEIGHT / 2 + 68, '⌂  MENU',    () => this.scene.start('MenuScene'));

    // Hint text
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 105, 'SPACE to retry', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#336655',
    }).setOrigin(0.5).setDepth(10);
  }

  _makeButton(x, y, label, callback) {
    const btnBg = this.add.rectangle(x, y, 150, 40, 0x001a0d)
      .setStrokeStyle(2, COLORS.playerEye).setDepth(10).setInteractive({ useHandCursor: true });

    const btnText = this.add.text(x, y, label, {
      fontFamily: 'Courier New',
      fontSize: '15px',
      color: '#00ff88',
    }).setOrigin(0.5).setDepth(11);

    btnBg.on('pointerover', () => { btnBg.setFillStyle(0x00ff88); btnText.setColor('#001a0d'); });
    btnBg.on('pointerout',  () => { btnBg.setFillStyle(0x001a0d); btnText.setColor('#00ff88'); });
    btnBg.on('pointerdown', callback);
  }

  _setupInput() {
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
