import Phaser from 'phaser';
import { TranslateService } from '@ngx-translate/core';
import { DTC } from '../../DTC';

export class GameScene extends Phaser.Scene {
    private translate!: TranslateService;
    private dtc:DTC = new DTC();

    constructor() { super('GameScene'); }

    preload() {}

    create() {
        this.translate = this.registry.get('translateService'); 
        this.cameras.main.setBackgroundColor('#FFFFFF'); // for visibility
        this.input.addPointer(3);
        
        const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setDepth(-20);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setDisplayOrigin(0, 0);

        this.createAnims();
        this.createUI();
        this.developmentTools();
    }

    private developmentTools(): void {
        
        // Setup Keyboard Input (Development Helper)
        // The event is 'keydown-SPACE'. It fires once per press (no rapid-fire machine gun if held down).
        /*
        this.input.keyboard?.on('keydown-SPACE', () => { this.shootWeapon();  });
        
        let code:any = Phaser.Input.Keyboard.KeyCodes.ONE;
        this.input.keyboard?.on('keydown-ONE', () => { this.switchWeapon();  });
        this.input.keyboard?.on('keydown-TWO', () => { this.switchWeapon();  });
        this.input.keyboard?.on('keydown-THREE', () => { this.switchWeapon();  });
        */

        // DEVELOPMENT
        // Needed for mouse locations for creating another board
        
        /*
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            let x:number =parseInt(pointer.x.toString());
            let y:number =parseInt(pointer.y.toString());
            console.log(`Screen X: ${x}, Screen Y: ${y}`);
        });
        */

      
    }

    override update(time: number, delta: number) {
        
    }

    private createUI(): void {
    }

    private createAnims() {

    }
 
    private callBack() {}

   
 
}
