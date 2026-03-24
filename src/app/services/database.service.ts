import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'velop_db';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  
  // This Promise allows other pages to wait until DB is ready before querying
  public dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.init();
  }

  private async init(): Promise<void> {
    try {
      // 1. Web Support: If running in browser, initialize the web store
      const platform = Capacitor.getPlatform();
      if (platform === 'web') {
        const jeepEl = document.querySelector('jeep-sqlite');
        if (jeepEl) {
            await customElements.whenDefined('jeep-sqlite');
        }
        await this.sqlite.initWebStore();
      }

      // 2. Create the connection
      this.db = await this.sqlite.createConnection(
        DB_NAME,
        false, // encrypted
        'no-encryption',
        1, // version
        false // readonly
      );

      // 3. Open the connection
      await this.db.open();

      // 4. Create Tables (Schema)
      // We start with a simple table to track daily counts (e.g., words spoken)
      const schema = `
        CREATE TABLE IF NOT EXISTS daily_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date_str TEXT NOT NULL,
          activity_type TEXT NOT NULL, 
          count INTEGER DEFAULT 0
        );
      `;
      
      await this.db.execute(schema);
      console.log('✅ Velop Database Initialized!');

    } catch (e) {
      console.error('❌ Error initializing DB:', e);
    }
  }

  // --- CRUD Methods ---

  // Example: addLog('2026-02-25', 'word_count', 5)
  async addLog(date: string, type: string, count: number) {
    await this.dbReady;
    const sql = `INSERT INTO daily_logs (date_str, activity_type, count) VALUES (?, ?, ?)`;
    const result = await this.db.run(sql, [date, type, count]);
    
    await this.saveToWeb(); // <--- Clean one-liner
    
    return result;
  }

  // Delete a log by its ID
  async deleteLog(id: number) {
    await this.dbReady;
    const sql = 'DELETE FROM daily_logs WHERE id = ?';
    const result = await this.db.run(sql, [id]);
    
    await this.saveToWeb(); // <--- CRITICAL for Web persistence!
    
    return result;
  }
  
  // Get all logs to verify data is saving
  async getLogs() {
    await this.dbReady;
    const sql = `SELECT * FROM daily_logs ORDER BY id DESC`;
    const result = await this.db.query(sql);
    return result?.values || [];
  }

  // Helper to save database to disk (only needed for Web)
  private async saveToWeb() {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(DB_NAME);
    }
  }
}