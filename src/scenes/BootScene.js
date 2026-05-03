// src/scenes/BootScene.js
// Handles any initial setup before the menu loads.
// Since we use procedural graphics, no asset loading needed here.

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.scene.start('MenuScene');
  }
}
