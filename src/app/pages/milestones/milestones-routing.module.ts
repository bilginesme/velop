import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Milestones } from './milestones';

const routes: Routes = [
  {
    path: '',
    component: Milestones,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilestonesRoutingModule {}
