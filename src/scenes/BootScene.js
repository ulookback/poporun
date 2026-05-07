// src/scenes/BootScene.js
import { AudioManager } from '../objects/AudioManager.js';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    const { width, height } = this.scale;
    const barW=300, barH=10, bx=(width-barW)/2, by=height/2-barH/2;
    this.add.rectangle(width/2,height/2-30,220,28,0x1a0005).setStrokeStyle(1,0xff4400);
    this.add.text(width/2,height/2-30,'LOADING…',{fontFamily:'Courier New',fontSize:'13px',color:'#ff4400'}).setOrigin(0.5);
    this.add.rectangle(width/2,height/2+10,barW+4,barH+4,0x330000);
    const bar=this.add.rectangle(bx,by+10,0,barH,0xff4400).setOrigin(0,0);
    this.load.on('progress',v=>{ bar.width=barW*v; });

    // Sprites
    ['popo_idle','popo_run1','popo_run2','popo_run3','popo_jump','popo_dead']
      .forEach(k=>this.load.image(k,`assets/sprites/${k}.png`));

    // Obstacle PNGs
    ['obs_lava_1','obs_lava_2','obs_fire_1','obs_fire_2',
     'obs_rock_1','obs_rock_2','obs_rock_3','obs_rock_4',
     'obs_spike_1','obs_spike_2','obs_spike_3','obs_spike_4',
     'obs_skull_1','obs_skull_2','obs_skull_3']
      .forEach(k=>this.load.image(k,`assets/obstacles/${k}.png`));

    // Backgrounds
    this.load.image('bg_game', 'assets/backgrounds/background1.png');
    this.load.image('bg_menu', 'assets/backgrounds/background2.png');

    // Audio
    this.load.audio('music',       'assets/sounds/music.mp3');
    this.load.audio('sound_start', 'assets/sounds/sound_start.mp3');
    this.load.audio('sound_jump',  'assets/sounds/sound_jump.mp3');
    this.load.audio('sound_fail',  'assets/sounds/sound_fail.mp3');
  }

  create() {
    new AudioManager(this);
    this.scene.start('MenuScene');
  }
}
