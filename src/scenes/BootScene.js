// src/scenes/BootScene.js
import { AudioManager } from '../objects/AudioManager.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const { width, height } = this.scale;
    const barW = 300, barH = 10;
    const bx   = (width - barW) / 2, by = height / 2 - barH / 2;

    this.add.rectangle(width/2, height/2 - 30, 220, 28, 0x1a0005).setStrokeStyle(1, 0xff4400);
    this.add.text(width/2, height/2 - 30, 'LOADING…', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#ff4400',
    }).setOrigin(0.5);
    this.add.rectangle(width/2, height/2 + 10, barW+4, barH+4, 0x330000);
    const bar = this.add.rectangle(bx, by+10, 0, barH, 0xff4400).setOrigin(0,0);
    this.load.on('progress', v => { bar.width = barW * v; });

    // Sprites
    this.load.image('popo_idle',  'assets/sprites/popo_idle.png');
    this.load.image('popo_run1',  'assets/sprites/popo_run1.png');
    this.load.image('popo_run2',  'assets/sprites/popo_run2.png');
    this.load.image('popo_run3',  'assets/sprites/popo_run3.png');
    this.load.image('popo_jump',  'assets/sprites/popo_jump.png');
    this.load.image('popo_dead',  'assets/sprites/popo_dead.png');

    // Audio
    this.load.audio('music',       'assets/sounds/music.mp3');
    this.load.audio('sound_start', 'assets/sounds/sound_start.mp3');
    this.load.audio('sound_jump',  'assets/sounds/sound_jump.mp3');
    this.load.audio('sound_fail',  'assets/sounds/sound_fail.mp3');
  }

  create() {
    // Start ambient music immediately via AudioManager (persists across all scenes)
    new AudioManager(this);
    this._bakeLayers();
    this.scene.start('MenuScene');
  }

  _bakeLayers() {
    const GW = 800, GH = 300, GROUND_Y = 255, CEIL = 30;
    const W  = GW * 2;

    // ── FAR layer ────────────────────────────────────────────────────
    {
      const rt = this.add.renderTexture(0, 0, W, GH).setVisible(false);
      const g  = this.make.graphics({ add: false });

      g.fillStyle(0x0d0005, 1);
      g.fillRect(0, 0, W, GH);

      const colH = [80,55,105,65,90,50,75,95,60,85,110,70,55,100,80,65,90,50];
      let cx = 20;
      colH.forEach((h, i) => {
        const cw = 28 + (i % 4) * 10;
        g.fillStyle(0x180406, 1); g.fillRect(cx+3, GROUND_Y-h+3, cw, h);
        g.fillStyle(0x200608, 1); g.fillRect(cx,   GROUND_Y-h,   cw, h);
        g.fillStyle(0x2a080c, 1); g.fillRect(cx,   GROUND_Y-h,   cw, 4);
        if (i%3===0) { g.fillStyle(0x881100, 0.5); g.fillRect(cx+cw*0.4, GROUND_Y-h*0.7, 2, h*0.4); }
        cx += cw + 18 + (i%3)*12;
      });

      let sx = 40;
      while (sx < W) {
        const sh=20+Math.random()*40, sw=10+Math.random()*18;
        g.fillStyle(0x1c0508,1); g.fillTriangle(sx,CEIL,sx+sw/2,CEIL+sh,sx+sw,CEIL);
        sx += sw+15+Math.random()*35;
      }
      for (let x=60; x<W; x+=120+Math.random()*80) { g.fillStyle(0x550010,0.45); g.fillEllipse(x,CEIL+6,40+Math.random()*40,14); }
      for (let x=80; x<W; x+=110+Math.random()*90) { g.fillStyle(0x661100,0.3);  g.fillEllipse(x,GROUND_Y-4,30+Math.random()*40,10); }

      rt.draw(g,0,0); rt.saveTexture('cave_far'); g.destroy(); rt.destroy();
    }

    // ── NEAR layer ───────────────────────────────────────────────────
    {
      const rt = this.add.renderTexture(0, 0, W, GH).setVisible(false);
      const g  = this.make.graphics({ add: false });

      const upper = [{x:60,w:55,h:45},{x:180,w:35,h:60},{x:290,w:70,h:38},{x:420,w:45,h:52},{x:530,w:60,h:42},{x:660,w:38,h:65},{x:780,w:65,h:48},{x:900,w:40,h:55},{x:1020,w:58,h:40},{x:1140,w:45,h:62},{x:1260,w:62,h:44},{x:1380,w:42,h:50},{x:1480,w:55,h:46}];
      upper.forEach(r => {
        g.fillStyle(0x240708,1); g.fillEllipse(r.x+r.w/2+2,CEIL+r.h/2+2,r.w,r.h);
        g.fillStyle(0x300a0c,1); g.fillEllipse(r.x+r.w/2,  CEIL+r.h/2,  r.w,r.h);
        g.fillStyle(0x3a0e10,1); g.fillEllipse(r.x+r.w/2-4,CEIL+r.h/2-5,r.w*0.5,r.h*0.4);
      });
      const lower = [{x:30,w:50,h:40},{x:150,w:70,h:55},{x:270,w:45,h:35},{x:380,w:65,h:48},{x:510,w:55,h:42},{x:630,w:72,h:50},{x:750,w:48,h:38},{x:860,w:66,h:52},{x:990,w:50,h:44},{x:1100,w:68,h:56},{x:1230,w:52,h:40},{x:1350,w:60,h:48},{x:1460,w:55,h:45}];
      lower.forEach(r => {
        g.fillStyle(0x240708,1); g.fillEllipse(r.x+r.w/2+2,GROUND_Y-r.h/2+2,r.w,r.h);
        g.fillStyle(0x300a0c,1); g.fillEllipse(r.x+r.w/2,  GROUND_Y-r.h/2,  r.w,r.h);
        g.fillStyle(0x3c0e10,1); g.fillEllipse(r.x+r.w/2-5,GROUND_Y-r.h/2-6,r.w*0.45,r.h*0.4);
      });

      for (let x=45; x<W; x+=80+Math.random()*100) {
        const vlen=18+Math.random()*50;
        g.fillStyle(0xaa2200,0.7); g.fillRect(x,CEIL,2,vlen);
        g.fillStyle(0xff5500,0.5); g.fillRect(x,CEIL,1,vlen*0.6);
        g.fillStyle(0xff4400,0.8); g.fillCircle(x+1,CEIL+vlen,3);
      }
      for (let x=60; x<W; x+=90+Math.random()*110) {
        const clen=20+Math.random()*40;
        g.fillStyle(0xdd3300,0.6); g.fillRect(x,GROUND_Y-2,clen,2);
        if (Math.random()>0.4) g.fillRect(x+clen*0.5,GROUND_Y-5,clen*0.4,2);
        g.fillStyle(0xff6600,0.5); g.fillCircle(x+clen,GROUND_Y-1,3);
      }

      let sx=70;
      while (sx < W) {
        const sh=25+Math.random()*50, sw=12+Math.random()*22;
        g.fillStyle(0x280608,1); g.fillTriangle(sx,CEIL,sx+sw/2,CEIL+sh,sx+sw,CEIL);
        g.fillStyle(0x340a0e,1); g.fillTriangle(sx+2,CEIL,sx+sw/2,CEIL+sh-5,sx+sw-2,CEIL);
        g.fillStyle(0xff4400,0.7); g.fillCircle(sx+sw/2,CEIL+sh,2.5);
        sx += sw+25+Math.random()*50;
      }

      rt.draw(g,0,0); rt.saveTexture('cave_near'); g.destroy(); rt.destroy();
    }
  }
}
