import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'; // <--- Import it
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'milestones',
  templateUrl: 'milestones.html',
  styleUrls: ['milestones.scss'],
  standalone: false,
})

export class Milestones implements OnInit {
  logs: any[] = []; // Variable to store our database data
  newCount: number = 0; // Variable for the input field

  constructor(
    private db: DatabaseService,
    private translate: TranslateService) {}

  async ngOnInit() {
    console.log('Starting...');
    // Load data when the app starts
    await this.db.dbReady;
    this.loadLogs();
  }

  async loadLogs() {
    console.log('Loading logs...');
    this.logs = await this.db.getLogs();
    console.log('Loaded logs:');
    console.log(this.logs);
  }

  async addEntry() {
    // 1. Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // 2. Save to DB
    await this.db.addLog(today, 'daily_count', this.newCount);
    
    // 3. Clear input and reload list
    this.newCount = 0;
    this.loadLogs();
  }

  async deleteEntry(id: number) {
    await this.db.deleteLog(id);
    this.loadLogs(); // Reload the list to update the UI
  }
}
