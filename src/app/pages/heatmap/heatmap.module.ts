import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HeatmapRoutingModule } from './heatmap-routing.module';
import { Heatmap } from './heatmap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatmapRoutingModule
  ],
  declarations: [Heatmap]
})
export class HeatmapModule {}
