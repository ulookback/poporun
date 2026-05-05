// src/scenes/MenuScene.js
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, CEILING_Y, COLORS } from '../config/gameConfig.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this._drawBackground();
    this._drawUI();
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
  }

  _drawBackground() {
    // Sky void
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky).setDepth(0);

    // Pre-baked cave layers
    const texW = GAME_WIDTH * 2;
    this.add.image(0, 0, 'cave_far').setOrigin(0, 0).setDepth(1);
    this.add.image(0, 0, 'cave_near').setOrigin(0, 0).setDepth(1);

    // Ground
    this.add.rectangle(GAME_WIDTH/2, GROUND_Y + (GAME_HEIGHT - GROUND_Y)/2,
      GAME_WIDTH, GAME_HEIGHT - GROUND_Y, COLORS.ground).setDepth(3);
    this.add.rectangle(GAME_WIDTH/2, GROUND_Y, GAME_WIDTH, 3, COLORS.groundLine).setDepth(4);

    // Ceiling
    this.add.rectangle(GAME_WIDTH/2, CEILING_Y/2, GAME_WIDTH, CEILING_Y, COLORS.caveCeiling).setDepth(4);
    this.add.rectangle(GAME_WIDTH/2, CEILING_Y, GAME_WIDTH, 2, COLORS.lavaDark, 0.8).setDepth(4);

    // Lava glow pools along ground
    for (let i = 0; i < 6; i++) {
      this.add.circle(80 + i * 140, GROUND_Y + 6, Phaser.Math.Between(10, 20),
        COLORS.lavaDark, 0.45).setDepth(3);
    }
  }

  _drawUI() {
    // Title — fiery style
    const title = this.add.text(GAME_WIDTH/2, 80, 'POPO RUN', {
      fontFamily: 'Courier New', fontSize: '52px', color: '#ff6600',
      stroke: '#440000', strokeThickness: 7,
      shadow: { offsetX: 3, offsetY: 3, color: '#cc0000', blur: 4, fill: true },
    }).setOrigin(0.5).setDepth(10);

    this.add.text(GAME_WIDTH/2, 138, '— a demon cat escapes from hell —', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#882200',
    }).setOrigin(0.5).setDepth(10);

    // Popo idle — bobbing on the ground
    const popoX = GAME_WIDTH/2 - 155;
    const popo  = this.add.image(popoX, GROUND_Y, 'popo_idle')
      .setOrigin(0.5, 1).setScale(0.88).setDepth(8);
    this.tweens.add({
      targets: popo, y: GROUND_Y - 6,
      yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut',
    });

    // Start button — fiery colours
    const btnBg = this.add.rectangle(GAME_WIDTH/2 + 50, 192, 210, 48, 0x330000)
      .setStrokeStyle(2, 0xff4400).setDepth(10).setInteractive({ useHandCursor: true });
    const btnText = this.add.text(GAME_WIDTH/2 + 50, 192, '▶  START', {
      fontFamily: 'Courier New', fontSize: '20px', color: '#ff6600',
    }).setOrigin(0.5).setDepth(11);

    this.add.text(GAME_WIDTH/2, 248, 'SPACE  →  Start  |  SPACE / TAP  →  Jump', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#551100',
    }).setOrigin(0.5).setDepth(10);

    btnBg.on('pointerover', () => { btnBg.setFillStyle(0xff4400); btnText.setColor('#ffcc00'); });
    btnBg.on('pointerout',  () => { btnBg.setFillStyle(0x330000); btnText.setColor('#ff6600'); });
    btnBg.on('pointerdown', () => this._startGame());

    // Pulse title
    this.tweens.add({
      targets: title, scaleX: 1.03, scaleY: 1.03,
      yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut',
    });
  }

  _startGame() { this.scene.start('GameScene'); }
}
