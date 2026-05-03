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
    // ── Input: ONLY the start button and spacebar trigger game start ──
    // NO global pointerdown listener — that caused any click to start
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
  }

  _drawBackground() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky).setDepth(0);
    this.add.circle(680, 40, 22, COLORS.moon).setDepth(1);
    this.add.circle(672, 36, 18, COLORS.sky).setDepth(2);
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GROUND_Y - 80);
      const r = Math.random() < 0.2 ? 1.5 : 1;
      this.add.circle(x, y, r, 0xffffff, 0.7 + Math.random() * 0.3).setDepth(1);
    }
  }

  _drawGround() {
    this.add.rectangle(
      GAME_WIDTH / 2, GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
      GAME_WIDTH, GAME_HEIGHT - GROUND_Y, COLORS.ground
    ).setDepth(3);
    this.add.rectangle(GAME_WIDTH / 2, GROUND_Y, GAME_WIDTH, 3, COLORS.groundLine).setDepth(4);
  }

  _drawDecorations() {
    const buildingData = [
      { x: 50,  w: 60, h: 80  }, { x: 130, w: 45, h: 55  },
      { x: 200, w: 70, h: 100 }, { x: 290, w: 50, h: 70  },
      { x: 450, w: 65, h: 85  }, { x: 540, w: 50, h: 60  },
      { x: 620, w: 80, h: 95  }, { x: 720, w: 55, h: 65  },
      { x: 790, w: 60, h: 110 },
    ];
    buildingData.forEach(b => {
      const by = GROUND_Y - b.h;
      this.add.rectangle(b.x, by + b.h / 2, b.w, b.h, COLORS.building).setDepth(2);
      for (let wy = by + 8; wy < GROUND_Y - 12; wy += 14)
        for (let wx = b.x - b.w / 2 + 6; wx < b.x + b.w / 2 - 4; wx += 12)
          if (Math.random() > 0.4)
            this.add.rectangle(wx, wy, 7, 8, COLORS.buildingWin).setDepth(2);
    });
  }

  _drawUI() {
    const title = this.add.text(GAME_WIDTH / 2, 72, 'POPO RUN', {
      fontFamily: 'Courier New', fontSize: '48px', color: '#00ff88',
      stroke: '#003322', strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#001a0d', blur: 0, fill: true },
    }).setOrigin(0.5).setDepth(10);

    this.add.text(GAME_WIDTH / 2, 128, '— the demon cat runs tonight —', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#44aa77',
    }).setOrigin(0.5).setDepth(10);

    const popoX = GAME_WIDTH / 2 - 150;
    const popo  = this.add.image(popoX, GROUND_Y, 'popo_idle')
      .setOrigin(0.5, 1).setScale(0.88).setDepth(8);
    this.tweens.add({
      targets: popo, y: GROUND_Y - 5,
      yoyo: true, repeat: -1, duration: 680, ease: 'Sine.easeInOut',
    });

    // Start button — only this triggers game start on click/tap
    const btnBg = this.add.rectangle(GAME_WIDTH / 2 + 50, 185, 200, 46, 0x003322)
      .setStrokeStyle(2, 0x00ff88).setDepth(10).setInteractive({ useHandCursor: true });
    const btnText = this.add.text(GAME_WIDTH / 2 + 50, 185, '▶  START', {
      fontFamily: 'Courier New', fontSize: '20px', color: '#00ff88',
    }).setOrigin(0.5).setDepth(11);

    this.add.text(GAME_WIDTH / 2, 244, 'SPACE  →  jump', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#336655',
    }).setOrigin(0.5).setDepth(10);

    btnBg.on('pointerover', () => { btnBg.setFillStyle(0x00ff88); btnText.setColor('#001a0d'); });
    btnBg.on('pointerout',  () => { btnBg.setFillStyle(0x003322); btnText.setColor('#00ff88'); });
    btnBg.on('pointerdown', () => this._startGame());

    this.tweens.add({
      targets: title, scaleX: 1.03, scaleY: 1.03,
      yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut',
    });
  }

  _startGame() { this.scene.start('GameScene'); }
}
