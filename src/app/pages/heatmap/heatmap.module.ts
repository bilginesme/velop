import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HeatmapRoutingModule } from './heatmap-routing.module';
import { Heatmap } from './heatmap';
import { TranslateModule } from '@ngx-translate/core';
import { PhaserHeaderComponent } from 'src/app/game/containers/phaser-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatmapRoutingModule,
    TranslateModule,
    PhaserHeaderComponent
  ],
  declarations: [Heatmap]
})
export class HeatmapModule {}
