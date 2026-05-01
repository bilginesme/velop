import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import * as Phaser from 'phaser';
import { HeaderAnimationScene } from '../../game/scenes/header-animation.scene';
 
@Component({
  selector: 'app-phaser-header',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <div #phaserContainer id="header-phaser-container" class="phaser-canvas-host"></div>
  `,
  // Required: Keep the host div size consistent with the expected animation size
  styles: [`
    .phaser-canvas-host {
      width: 100px; /* Small, specific width for the animation space */
      height: 44px;  /* Typical Ionic header height */
      display: inline-block; /* Essential for aligning next to text */
      vertical-align: middle;
      overflow: hidden; /* Prevent canvas overflowing the toolbar */
    }
  `]
})

export class PhaserHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('phaserContainer', { static: true }) phaserContainer!: ElementRef;
  private gameInstance?: Phaser.Game;

  constructor() {}

  ngOnInit() {
    this.initializePhaser();
  }

  ngOnDestroy() {
    // CRITICAL: Prevent memory leaks
    if (this.gameInstance) {
      this.gameInstance.destroy(true);
    }
  }

  private initializePhaser() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 100, // Small width matching style
      height: 44, // Small height matching style
      parent: this.phaserContainer.nativeElement, // Inject into our ViewChild div
      transparent: true, // Crucial for overlaying on the colored header
      scene: [ HeaderAnimationScene ],
      pixelArt: true, // Recommended for clean-looking pixel sprites
      physics: {
        default: 'none' // No physics needed for static animation
      }
    };

    this.gameInstance = new Phaser.Game(config);
  }
}