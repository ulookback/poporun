// src/scenes/BootScene.js
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const { width, height } = this.scale;

    // Loading bar
    const barW = 300, barH = 10;
    const bx = (width - barW) / 2;
    const by = height / 2 - barH / 2;
    this.add.rectangle(width/2, height/2 - 30, 220, 28, 0x001a0d).setStrokeStyle(1, 0x00ff88);
    this.add.text(width/2, height/2 - 30, 'LOADING…', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#00ff88',
    }).setOrigin(0.5);
    this.add.rectangle(width/2, height/2 + 10, barW+4, barH+4, 0x003322);
    const bar = this.add.rectangle(bx, by+10, 0, barH, 0x00ff88).setOrigin(0,0);
    this.load.on('progress', v => { bar.width = barW * v; });

    // Popo sprites
    this.load.image('popo_idle',  'assets/sprites/popo_idle.png');
    this.load.image('popo_run1',  'assets/sprites/popo_run1.png');
    this.load.image('popo_run2',  'assets/sprites/popo_run2.png');
    this.load.image('popo_run3',  'assets/sprites/popo_run3.png');
    this.load.image('popo_jump',  'assets/sprites/popo_jump.png');
    this.load.image('popo_dead',  'assets/sprites/popo_dead.png');
  }

  create() {
    // Pre-bake both building layer textures here, once, before any scene runs.
    // This prevents the visible "pop-in" during gameplay.
    this._bakeBuildingTexture('buildings_far',  0x0d1117, [70,50,90,60,80,55,100,65,75,50,90]);
    this._bakeBuildingTexture('buildings_near', 0x0d1b2a, [55,80,40,70,60,85,50,75,65,80,45]);
    this.scene.start('MenuScene');
  }

  _bakeBuildingTexture(key, color, heights) {
    // Draw onto a RenderTexture that is 2× the game width so scrolling never shows a seam
    const GW = 800;
    const GROUND_Y = 260;
    const texW = GW * 2;
    const texH = GROUND_Y;

    const rt = this.add.renderTexture(0, 0, texW, texH).setVisible(false);
    const g  = this.make.graphics({ x: 0, y: 0, add: false });

    let x = 0;
    heights.forEach(h => {
      const w = Phaser.Math.Between(40, 90);
      g.fillStyle(color, 1);
      g.fillRect(x, texH - h, w, h);

      // Windows
      g.fillStyle(0x1a3a5c, 1);
      for (let wy = texH-h+6; wy < texH-10; wy += 14) {
        for (let wx = x+5; wx < x+w-5; wx += 12) {
          if (Math.random() > 0.45) g.fillRect(wx, wy, 7, 8);
        }
      }
      x += w + Phaser.Math.Between(5, 25);
    });

    rt.draw(g, 0, 0);
    rt.saveTexture(key);
    g.destroy();
    rt.destroy();
  }
}
