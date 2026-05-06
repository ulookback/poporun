// src/objects/AudioManager.js
// Single source of truth for all audio.
// Stored on the Phaser registry so every scene can reach it.

export class AudioManager {
  constructor(scene) {
    this.scene  = scene;
    this._vol   = 1.0;   // master volume 0–1
    this._muted = false;

    // Music
    this._music = scene.sound.add('music', { loop: true, volume: 0.7 });
    this._music.play();

    // SFX
    this._sfx = {
      start: scene.sound.add('sound_start', { volume: 1.0 }),
      jump:  scene.sound.add('sound_jump',  { volume: 1.0 }),
      fail:  scene.sound.add('sound_fail',  { volume: 1.0 }),
    };

    // Persist across scenes via registry
    scene.registry.set('audio', this);
  }

  // ── Playback ─────────────────────────────────────────────────────────────

  playStart() { this._play('start'); }
  playJump()  { this._play('jump');  }
  playFail()  { this._play('fail');  }

  _play(key) {
    if (this._muted) return;
    const sfx = this._sfx[key];
    if (sfx.isPlaying) sfx.stop();
    sfx.play();
  }

  // ── Volume / mute ─────────────────────────────────────────────────────────

  getVolume()  { return this._muted ? 0 : this._vol; }
  isMuted()    { return this._muted; }

  setVolume(v) {
    this._vol   = Phaser.Math.Clamp(v, 0, 1);
    this._muted = this._vol === 0;
    this._applyVolume();
  }

  toggleMute() {
    this._muted = !this._muted;
    this._applyVolume();
    return this._muted;
  }

  cycleVolume() {
    // Three-step cycle: 100% → 50% → muted → 100%
    if      (this._muted)    { this._muted = false; this._vol = 1.0; }
    else if (this._vol > 0.6){ this._vol = 0.5; }
    else                     { this._muted = true; }
    this._applyVolume();
  }

  _applyVolume() {
    const v = this._muted ? 0 : this._vol;
    this._music.setVolume(v * 0.7);
    Object.values(this._sfx).forEach(s => s.setVolume(v * 1.0));
  }

  // Label for the volume button
  volumeLabel() {
    if (this._muted)       return '🔇';
    if (this._vol  > 0.6)  return '🔊';
    return '🔉';
  }
}

// Helper — get AudioManager from any scene (returns null if not yet created)
export function getAudio(scene) {
  return scene.registry.get('audio') || null;
}
