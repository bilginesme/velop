import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'; // <--- Import it
import { TranslateService } from '@ngx-translate/core';
import { MilestoneService } from 'src/app/services/milestone.service';
import { ObjectiveLog } from 'src/app/models/objective-log';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss'],
  standalone: false,
})

export class Dashboard implements OnInit {
  pendingLogs: ObjectiveLog[] = [];
  recentSuccessLogs: ObjectiveLog[] = [];
  readonly historyDays = 30; // Will move to settings later

  constructor(private milestoneService: MilestoneService, private navCtrl: NavController) {}
  
  async ngOnInit() {
    console.log('Seeding tables ...');
    await this.milestoneService.seedCategories();
    await this.milestoneService.seedSubCategories();
    await this.milestoneService.seedObjectives();
  }
 
  async ionViewWillEnter() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    const childId = 1; // Temporary hardcode
    const allLogs = await this.milestoneService.getObjectiveLogs();
    
    // Filter Pending
    this.pendingLogs = allLogs.filter(log => log.is_succeeded === 0);

    // Filter Accomplished (last 30 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.historyDays);

    this.recentSuccessLogs = allLogs.filter(log => {
      return log.is_succeeded === 1 && 
             log.date_achieved && 
             new Date(log.date_achieved) >= cutoffDate;
    });
  }

  goToMilestones() {
    this.navCtrl.navigateRoot('/tabs/milestones');
  }
 
}
