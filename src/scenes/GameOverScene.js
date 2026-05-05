// src/scenes/GameOverScene.js
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/gameConfig.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    // Dark hell overlay
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setDepth(0);

    // Subtle grid
    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1, 0x330000, 0.2);
    for (let x = 0; x < GAME_WIDTH; x += 40) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 30) g.lineBetween(0, y, GAME_WIDTH, y);

    // Panel
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, 380, 210, 0x1a0003, 0.96)
      .setStrokeStyle(2, 0xff4400).setDepth(5);

    // Title
    const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 76, 'WASTED', {
      fontFamily: 'Courier New', fontSize: '36px', color: '#ff4400',
      stroke: '#330000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: title, alpha: 0.5, yoyo: true, repeat: -1, duration: 500 });

    // Score label
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 26, 'TIME SURVIVED', {
      fontFamily: 'Courier New', fontSize: '12px', color: '#661100',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 8, `${this.finalScore}s`, {
      fontFamily: 'Courier New', fontSize: '40px', color: '#ff6600',
      stroke: '#330000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(10);

    // Buttons
    this._makeButton(GAME_WIDTH/2 - 88, GAME_HEIGHT/2 + 70, '↺  RETRY',  () => this.scene.start('GameScene'));
    this._makeButton(GAME_WIDTH/2 + 88, GAME_HEIGHT/2 + 70, '⌂  MENU',   () => this.scene.start('MenuScene'));

    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 100, 'SPACE to retry', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#441100',
    }).setOrigin(0.5).setDepth(10);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }

  _makeButton(x, y, label, cb) {
    const bg = this.add.rectangle(x, y, 155, 40, 0x1a0000)
      .setStrokeStyle(2, 0xff4400).setDepth(10).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: 'Courier New', fontSize: '15px', color: '#ff6600',
    }).setOrigin(0.5).setDepth(11);
    bg.on('pointerover', () => { bg.setFillStyle(0xff4400); txt.setColor('#ffcc00'); });
    bg.on('pointerout',  () => { bg.setFillStyle(0x1a0000); txt.setColor('#ff6600'); });
    bg.on('pointerdown', cb);
  }
}
