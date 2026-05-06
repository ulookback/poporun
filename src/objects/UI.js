// src/objects/UI.js
// Shared UI helpers — consistent button style across all scenes.

const BTN = {
  fillNormal:  0x2a0005,
  fillHover:   0xff4400,
  stroke:      0xff4400,
  strokeW:     2,
  textNormal:  '#ff8844',
  textHover:   '#ffeecc',
  font:        'Courier New',
};

/**
 * makeButton — creates a styled rectangle button + label.
 * Returns { bg, txt } so callers can reuse/update them.
 */
export function makeButton(scene, x, y, w, h, label, onClick) {
  const bg = scene.add.rectangle(x, y, w, h, BTN.fillNormal)
    .setStrokeStyle(BTN.strokeW, BTN.stroke)
    .setDepth(20)
    .setInteractive({ useHandCursor: true });

  const txt = scene.add.text(x, y, label, {
    fontFamily: BTN.font,
    fontSize:   Math.floor(h * 0.42) + 'px',
    color:      BTN.textNormal,
    stroke:     '#220000',
    strokeThickness: 2,
  }).setOrigin(0.5).setDepth(21);

  bg.on('pointerover',  () => { bg.setFillStyle(BTN.fillHover); txt.setColor(BTN.textHover); });
  bg.on('pointerout',   () => { bg.setFillStyle(BTN.fillNormal); txt.setColor(BTN.textNormal); });
  bg.on('pointerdown',  onClick);

  return { bg, txt };
}

/** Small square icon button (volume, help, etc.) */
export function makeIconButton(scene, x, y, size, label, onClick) {
  return makeButton(scene, x, y, size, size, label, onClick);
}
