import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MilestonesRoutingModule } from './milestones-routing.module';
import { Milestones } from './milestones';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MilestonesRoutingModule
  ],
  declarations: [Milestones]
})
export class MilestonesModule {}
