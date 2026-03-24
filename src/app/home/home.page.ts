import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service'; // <--- Import it

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements OnInit {
  logs: any[] = []; // Variable to store our database data
  newCount: number = 0; // Variable for the input field

  constructor(private db: DatabaseService) {} // <--- Inject it

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
