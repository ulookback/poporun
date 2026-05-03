// src/scenes/MenuScene.js
import { GAME_WIDTH, GAME_HEIGHT, COLORS, GROUND_Y } from '../config/gameConfig.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this._drawBackground();
    this._drawGround();
    this._drawDecorations();
    this._drawUI();
    this._setupInput();
  }

  _drawBackground() {
    // Night sky gradient via rectangles
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky).setDepth(0);

    // Moon
    const moon = this.add.circle(680, 40, 22, COLORS.moon).setDepth(1);
    this.add.circle(672, 36, 18, COLORS.sky).setDepth(2); // crescent cutout

    // Stars
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GROUND_Y - 80);
      const r = Math.random() < 0.2 ? 1.5 : 1;
      this.add.circle(x, y, r, 0xffffff, 0.7 + Math.random() * 0.3).setDepth(1);
    }
  }

  _drawGround() {
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
      GAME_WIDTH, GAME_HEIGHT - GROUND_Y, COLORS.ground).setDepth(3);
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y, GAME_WIDTH, 3, COLORS.groundLine).setDepth(4);
  }

  _drawDecorations() {
    // Buildings silhouette
    const buildingData = [
      { x: 50,  w: 60,  h: 80  },
      { x: 130, w: 45,  h: 55  },
      { x: 200, w: 70,  h: 100 },
      { x: 290, w: 50,  h: 70  },
      { x: 580, w: 80,  h: 90  },
      { x: 680, w: 55,  h: 65  },
      { x: 750, w: 60,  h: 110 },
    ];

    buildingData.forEach(b => {
      const by = GROUND_Y - b.h;
      this.add.rectangle(b.x, by + b.h / 2, b.w, b.h, COLORS.building).setDepth(2);
      // Windows
      for (let wy = by + 8; wy < GROUND_Y - 12; wy += 14) {
        for (let wx = b.x - b.w / 2 + 6; wx < b.x + b.w / 2 - 4; wx += 12) {
          if (Math.random() > 0.4) {
            this.add.rectangle(wx, wy, 7, 8, COLORS.buildingWin).setDepth(2);
          }
        }
      }
    });
  }

  _drawUI() {
    // Title
    const title = this.add.text(GAME_WIDTH / 2, 80, 'POPO RUN', {
      fontFamily: 'Courier New',
      fontSize: '48px',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#001a0d', blur: 0, fill: true },
    }).setOrigin(0.5).setDepth(10);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 135, '— the demon cat runs tonight —', {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: '#44aa77',
    }).setOrigin(0.5).setDepth(10);

    // Start button
    const btnBg = this.add.rectangle(GAME_WIDTH / 2, 195, 200, 46, 0x003322)
      .setStrokeStyle(2, 0x00ff88).setDepth(10).setInteractive({ useHandCursor: true });

    const btnText = this.add.text(GAME_WIDTH / 2, 195, '▶  START', {
      fontFamily: 'Courier New',
      fontSize: '20px',
      color: '#00ff88',
    }).setOrigin(0.5).setDepth(11);

    // Hint
    this.add.text(GAME_WIDTH / 2, 245, 'SPACE / CLICK / TAP  →  Jump', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#336655',
    }).setOrigin(0.5).setDepth(10);

    // Button hover
    btnBg.on('pointerover', () => { btnBg.setFillStyle(0x00ff88); btnText.setColor('#001a0d'); });
    btnBg.on('pointerout',  () => { btnBg.setFillStyle(0x003322); btnText.setColor('#00ff88'); });
    btnBg.on('pointerdown', () => this._startGame());

    // Pulse title
    this.tweens.add({
      targets: title,
      scaleX: 1.03, scaleY: 1.03,
      yoyo: true, repeat: -1,
      duration: 900, ease: 'Sine.easeInOut',
    });

    // Draw mini Popo preview
    this._drawMiniPopo(GAME_WIDTH / 2, 170);
  }

  _drawMiniPopo(x, y) {
    // Small decorative cat silhouette next to title
    const g = this.add.graphics().setDepth(10);
    g.fillStyle(0x111111, 1);
    // body
    g.fillRoundedRect(x - 220, y - 10, 16, 22, 4);
    // head
    g.fillCircle(x - 212, y - 14, 10);
    // ears
    g.fillTriangle(x - 220, y - 19, x - 223, y - 27, x - 215, y - 19);
    g.fillTriangle(x - 205, y - 19, x - 202, y - 27, x - 208, y - 19);
    // eyes
    g.fillStyle(COLORS.playerEye, 1);
    g.fillCircle(x - 215, y - 14, 2.5);
    g.fillCircle(x - 209, y - 14, 2.5);
  }

  _setupInput() {
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
    this.input.once('pointerdown', () => this._startGame());
  }

  _startGame() {
    this.scene.start('GameScene');
  }
}
