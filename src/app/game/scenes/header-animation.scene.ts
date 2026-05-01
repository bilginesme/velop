import * as Phaser from 'phaser';

export class HeaderAnimationScene extends Phaser.Scene {
  constructor() {
    // The key is vital for referencing the scene later
    super({ key: 'HeaderAnimationScene' });
  }

  preload() {
    this.load.spritesheet('child_sprite', 'assets/animations/child_wave_sheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    const { width, height } = this.cameras.main;
    const sprite = this.add.sprite(width / 2, height / 2, 'child_sprite').setOrigin(0.5);

    // Check if animation exists to avoid console warnings on hot-reload
    if (!this.anims.exists('wave_anim')) {
      this.anims.create({
        key: 'wave_anim',
        frames: this.anims.generateFrameNumbers('child_sprite', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }

    sprite.play('wave_anim');
  }
}