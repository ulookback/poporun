// src/scenes/MenuScene.js
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, COLORS } from '../config/gameConfig.js';
import { makeButton, makeIconButton } from '../objects/UI.js';
import { getAudio } from '../objects/AudioManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); this._helpOpen = false; }

  create() {
    this._drawBackground();
    this._drawUI();
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
  }

  _drawBackground() {
    // Static bg_menu — no decorative lines at all
    this._bg0 = this.add.image(0,           0, 'bg_menu').setOrigin(0, 0).setDepth(0);
    this._bg1 = this.add.image(GAME_WIDTH*2, 0, 'bg_menu').setOrigin(0, 0).setDepth(0);
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.22).setDepth(1);
    // No ground line, no ceiling line
  }

  _drawUI() {
    const title = this.add.text(GAME_WIDTH/2, 76, 'POPO RUN', {
      fontFamily: 'Courier New', fontSize: '52px', color: '#ff7722',
      stroke: '#550000', strokeThickness: 7,
      shadow: { offsetX: 3, offsetY: 3, color: '#cc0000', blur: 6, fill: true },
    }).setOrigin(0.5).setDepth(10);

    this.add.text(GAME_WIDTH/2, 132, '— a demon cat escapes from hell —', {
      fontFamily: 'Courier New', fontSize: '14px', color: '#ff5533',
      stroke: '#220000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    const popo = this.add.image(GAME_WIDTH/2 - 155, GROUND_Y, 'popo_idle')
      .setOrigin(0.5, 1).setScale(0.88).setDepth(8);
    this.tweens.add({ targets: popo, y: GROUND_Y - 6, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    makeButton(this, GAME_WIDTH/2 + 50, 186, 220, 50, '▶  START', () => this._startGame());

    makeIconButton(this, GAME_WIDTH - 30, 52, 38, '?', () => this._toggleHelp());

    const audio = getAudio(this);
    const volBtn = makeIconButton(this, GAME_WIDTH - 30, 96, 38,
      audio ? audio.volumeLabel() : '🔊',
      () => { if (!audio) return; audio.cycleVolume(); volBtn.txt.setText(audio.volumeLabel()); });
    volBtn.txt.setFontSize('18px');

    this.tweens.add({ targets: title, scaleX: 1.03, scaleY: 1.03, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });

    this._helpOverlay = this._buildHelpOverlay();
    this._helpOverlay.forEach(o => o.setVisible(false));
  }

  _buildHelpOverlay() {
    const cx = GAME_WIDTH/2, cy = GAME_HEIGHT/2, pw = 480, ph = 186;
    const dim   = this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.72).setDepth(30);
    const panel = this.add.rectangle(cx, cy, pw, ph, 0x1a0003, 0.97).setStrokeStyle(2, 0xff4400).setDepth(31);
    const t = (txt, x, y, size, col = '#ff8844') =>
      this.add.text(x, y, txt, {
        fontFamily: 'Courier New', fontSize: size, color: col,
        stroke: '#1a0000', strokeThickness: 2, wordWrap: { width: pw - 40 },
      }).setOrigin(0.5).setDepth(32);
    const elems = [
      dim, panel,
      t('HOW TO NOT DIE',                          cx, cy - 74, '20px', '#ff5522'),
      t('Your goal: escape hell. Simple, right?',  cx, cy - 46, '13px', '#ffaa77'),
      t("Spoiler: you won't. But try anyway.",     cx, cy - 28, '13px', '#cc6644'),
      t('─────────────────────────────────────',   cx, cy - 10, '11px', '#441100'),
      t('SPACE  /  TAP           →  jump',         cx, cy +  6, '14px', '#ff8844'),
      t('SPACE SPACE  /  TAP TAP  →  double jump', cx, cy + 26, '14px', '#ff8844'),
    ];
    const { bg: cbg, txt: ctxt } = makeButton(this, cx, cy + 62, 150, 38, '✕  CLOSE', () => this._toggleHelp());
    cbg.setDepth(32); ctxt.setDepth(33);
    elems.push(cbg, ctxt);
    return elems;
  }

  _toggleHelp() {
    this._helpOpen = !this._helpOpen;
    this._helpOverlay.forEach(o => o.setVisible(this._helpOpen));
  }

  update(time, delta) {
    const dx = 40 * (delta / 1000);
    this._bg0.x -= dx; this._bg1.x -= dx;
    const tileW = GAME_WIDTH * 2;
    if (this._bg0.x + tileW <= 0) this._bg0.x = this._bg1.x + tileW;
    if (this._bg1.x + tileW <= 0) this._bg1.x = this._bg0.x + tileW;
  }

  _startGame() {
    const audio = getAudio(this);
    if (audio) audio.playStart();
    this.scene.start('GameScene');
  }
}
