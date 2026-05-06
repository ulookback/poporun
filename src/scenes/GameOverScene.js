// src/scenes/GameOverScene.js
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { makeButton } from '../objects/UI.js';
import { getAudio } from '../objects/AudioManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) { this.finalScore = data.score || 0; }

  create() {
    // Dim overlay
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setDepth(0);

    // Grid
    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1, 0x330000, 0.18);
    for (let x=0; x<GAME_WIDTH; x+=40) g.lineBetween(x,0,x,GAME_HEIGHT);
    for (let y=0; y<GAME_HEIGHT; y+=30) g.lineBetween(0,y,GAME_WIDTH,y);

    // Panel
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, 400, 200, 0x1a0003, 0.97)
      .setStrokeStyle(2, 0xff4400).setDepth(5);

    // WASTED title
    const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 76, 'WASTED', {
      fontFamily: 'Courier New', fontSize: '40px', color: '#ff4400',
      stroke: '#330000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets:title, alpha:0.45, yoyo:true, repeat:-1, duration:500 });

    // Score label + value
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 24, 'TIME SURVIVED', {
      fontFamily: 'Courier New', fontSize: '14px', color: '#ff5533',
      stroke: '#220000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 14, `${this.finalScore}s`, {
      fontFamily: 'Courier New', fontSize: '44px', color: '#ff8844',
      stroke: '#330000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(10);

    // Buttons — no hint text
    makeButton(this, GAME_WIDTH/2 - 95, GAME_HEIGHT/2 + 72, 162, 44, '↺  RETRY',
      () => { const a=getAudio(this); if(a) a.playStart(); this.scene.start('GameScene'); });
    makeButton(this, GAME_WIDTH/2 + 95, GAME_HEIGHT/2 + 72, 162, 44, '⌂  MENU',
      () => this.scene.start('MenuScene'));

    // Space still works silently — no hint shown
    this.input.keyboard.once('keydown-SPACE', () => {
      const a=getAudio(this); if(a) a.playStart();
      this.scene.start('GameScene');
    });
  }
}
