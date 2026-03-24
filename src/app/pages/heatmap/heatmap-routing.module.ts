import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Heatmap } from './heatmap';

const routes: Routes = [
  {
    path: '',
    component: Heatmap,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeatmapRoutingModule {}
