import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        // Make sure this path points to where your generated page actually is
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'heatmap',
        loadChildren: () => import('../pages/heatmap/heatmap.module').then(m => m.HeatmapModule)
      },
      {
        path: 'milestones',
        loadChildren: () => import('../pages/milestones/milestones.module').then(m => m.MilestonesModule)
      },
      {
        path: 'word-count',
        loadChildren: () => import('../pages/word-count/word-count.module').then(m => m.WordCountModule)
      },
      {
        // If they just go to /tabs, redirect them to the dashboard
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
