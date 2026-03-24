import * as Phaser from 'phaser';
import { DTC } from 'src/app/DTC';

export default class PreloaderScene extends Phaser.Scene {
    private dtc:DTC = new DTC();

    constructor() {
        super('PreloaderScene');
    }

    preload() {
        // 1. Setup the Visual Loading Bar
        // (Optional: Create a simple rectangle graphic)
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 2. Listen for Loader Events
        this.load.on('progress', (value: number) => {
            // value is 0.0 to 1.0
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            
            //this.scene.start('SettingsScene');  // Start the Menu
            this.scene.start('GameScene', { levelId: 1 });
            //this.scene.start('MenuScene');  // Start the Menu
            //this.scene.start('GameOverScene', { score: 13400, result: false });
        });

        const font = new FontFace(this.dtc.strFontFamily, 'url(assets/fonts/PlaypenSans.ttf)');
        font.load().then(() => {
            (document.fonts as any).add(font);
        }).catch(err => {
            console.error('Font failed to load:', err);
        });
    
        this.load.image('bg', 'assets/images/bg.png');
    }
}