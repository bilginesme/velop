import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { MilestoneObjective } from '../models/milestone-objective.model';
import { MilestoneSubcategory } from '../models/milestone-subcategory.model';
import { MilestoneCategory } from '../models/milestone-category.model';

const DB_NAME = 'velop_db';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
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
      const categoriesSchema = `CREATE TABLE IF NOT EXISTS milestone_categories (
          id INTEGER PRIMARY KEY, 
          milestone_category_key TEXT NOT NULL UNIQUE, 
          milestone_category_order INTEGER NOT NULL, 
          count INTEGER DEFAULT 0);`;
          
      await this.db.execute(categoriesSchema);
      console.log('✅ Velop milestone_categories Initialized!');

      const subcategoriesSchema = `CREATE TABLE IF NOT EXISTS milestone_subcategories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER NOT NULL, -- The numeric link to the parent
          subcategory_key TEXT NOT NULL UNIQUE, -- For the JSON translator
          subcategory_order INTEGER NOT NULL,
          FOREIGN KEY(category_id) REFERENCES milestone_categories(id) ON DELETE CASCADE);`;
      await this.db.execute(subcategoriesSchema);
      console.log('✅ Velop milestone_subcategories Initialized!');

      const objectivesSchema = `
        CREATE TABLE IF NOT EXISTS milestone_objectives (
          id INTEGER PRIMARY KEY, -- Manual ID for seed data
          category_id INTEGER NOT NULL,
          subcategory_id INTEGER, -- Leave off 'NOT NULL' so it accepts NULL
          objective_key TEXT NOT NULL UNIQUE,
          objective_order INTEGER NOT NULL,
          FOREIGN KEY(category_id) REFERENCES milestone_categories(id) ON DELETE CASCADE,
          FOREIGN KEY(subcategory_id) REFERENCES milestone_subcategories(id) ON DELETE CASCADE
        );
      `;
      await this.db.execute(objectivesSchema);
      console.log('✅ Velop objectives Initialized!');
    } catch (e) {
      console.error('❌ Error initializing DB:', e);
    }
  }

  // Add this helper function to your database.service.ts
  public async seedCategories() {
    // Check if categories already exist so we don't insert them twice
    const checkSql = 'SELECT COUNT(*) as count FROM milestone_categories';
    const result = await this.db.query(checkSql);
    
    if (result?.values && result.values[0].count === 0) {
      console.log('🌱 Seeding initial categories...');
      
      const insertSql = `
        INSERT INTO milestone_categories (id, milestone_category_key, milestone_category_order) VALUES
        (1, 'CAT_SOCIAL_SKILLS', 10),
        (2, 'CAT_COMMUNICATION_SKILLS', 20),
        (3, 'CAT_COGNITIVE_SKILLS', 30),
        (4, 'CAT_MOTOR_SKILLS', 40),
        (5, 'CAT_SELF_CARE_SKILLS', 40);
      `;
      
      await this.db.execute(insertSql);
      await this.saveToWeb();
    }
  }
  
   public async seedSubCategories() {
    // Check if categories already exist so we don't insert them twice
    const checkSql = 'SELECT COUNT(*) as count FROM milestone_subcategories';
    const result = await this.db.query(checkSql);
    
    if (result?.values && result.values[0].count === 0) {
      console.log('🌱 Seeding initial categories...');
      
      const insertSql = `INSERT INTO milestone_subcategories (id, category_id, subcategory_key, subcategory_order) VALUES
        (21, 2, 'SUB_CAT_RECEPTIVE_LANGUAGE_SKILLS', 1),
        (22, 2, 'SUB_CAT_EXPRESSIVE_LANGUAGE_SKILLS', 2),
        (41, 4, 'SUB_CAT_GROSS_MOTOR_SKILLS', 1),
        (42, 4, 'SUB_CAT_FINE_MOTOR_SKILLS', 2);`;
      await this.db.execute(insertSql);
      await this.saveToWeb();
    }
  }

  public async seedObjectives() {
    const checkSql = 'SELECT COUNT(*) as count FROM milestone_objectives';
    const result = await this.db.query(checkSql);
    
    if (result?.values && result.values[0].count === 0) {
      console.log('🌱 Seeding initial objectives...');
      
      const insertSql = `
        INSERT INTO milestone_objectives 
        (id, category_id, subcategory_id, objective_key, objective_order) VALUES

        (101, 1, NULL, 'OBJ_WHEN_NIPPLE_TOUCHES_MOUTH_ABLE_TO_OPEN_MOUTH',  10),
        (102, 1, NULL, 'OBJ_DURING_PLAY_WITH_CHILDREN_ABLE_TO_INTERACTION_AT_TIMES',  10),
        (103, 1, NULL, 'OBJ_WHEN_EXPERIENCING_PROBLEM_ABLE_TO_ASK_HELP',  10),
        (201, 2, 21,   'OBJ_ABLE_TO_TURN_GAZE_TOWARD_SOUND',  10),
        (202, 2, 21,   'OBJ_WHEN_PROMPTED_ABLE_TO_INDICATE_SELF',  10),
        (203, 2, 21,   'OBJ_ABLE_TO_FOLLOW_THREE_CONSECUTIVE_INSTRUCTIONS',  10),
        (210, 2, 22,   'OBJ_ABLE_TO_VOCALIZE_TO_GAIN_ATTENTION',  10),
        (211, 2, 22,   'OBJ_ABLE_TOCOUNT_FROM_ONE_TO_THREE',  10),
        (212, 2, 22,   'OBJ_ABLE_TO_ASK_MEANING_OF_WORDS',  10),
        (301, 3, NULL, 'OBJ_ABLE_TO_TRANSFER_TOY_FROM_ONE_HAND_TO_OTHER',  10),
        (302, 3, NULL, 'OBJ_ABLE_TO_NAME_FAMILIAR_ADULTS_SHOWN_IN_PHOTOS',  10),
        (303, 3, NULL, 'OBJ_ABLE_TO_PICK_UP_SPECIFIED_NUMBER_OF_OBJECTS',  10),
        (401, 4, 41,   'OBJ_WHEN_LYING_IN_PRONE_POSITION_ABLE_TO_TURN_HEAD_RIGHT_AND_LEFT',  10),
        (402, 4, 41,   'OBJ_ABLE_TO_HOLD_FILLED_GLASS_WITH_ONE_HAND',  10),
        (403, 4, 41,   'OBJ_ABLE_TO_STAND_ON_ONE_FOOT_FOR_X_SECONDS',  10),
        (411, 4, 42,   'OBJ_ABLE_TO_BRING_BOTH_HANDS_TOGETHER',  10),
        (412, 4, 42,   'OBJ_ABLE_TO_THREAD_LARGE_BEADS_ONTO_STRING',  10),
        (413, 4, 42,   'OBJ_ABLE_TO_CREATE_TWO_THREE_PART_SHAPES_USING_PLAYDOUGH',  10),
        (501, 5, NULL, 'OBJ_ABLE_TO_CONSUME_PUREED_OR_MASHED_FOODS', 10),
        (502, 5, NULL, 'OBJ_ABLE_TO_POUR_WATER_FROM_A_BOTTLE_INTO_A_GLASS', 11),
        (503, 5, NULL, 'OBJ_ABLE_TO_WIPE_UP_SPILLED_LIQUIDS_USING_A_CLOTH', 12)
        ;
      `;
      
      await this.db.execute(insertSql);
      await this.saveToWeb();
    }
  }

  async getCategories(): Promise<MilestoneCategory[]> {
    await this.dbReady;
    const sql = `SELECT * FROM milestone_categories ORDER BY milestone_category_order ASC`;
    const result = await this.db.query(sql);

    return (result?.values as MilestoneCategory[]) || [];
  }

  async getSubCategories(): Promise<MilestoneSubcategory[]> {
    await this.dbReady;
    const sql = `SELECT * FROM milestone_subcategories ORDER BY category_id, subcategory_order ASC`;
    const result = await this.db.query(sql);

    return (result?.values as MilestoneSubcategory[]) || [];
  }

  async getObjectivesAll(): Promise<MilestoneObjective[]> {
    await this.dbReady;
    const sql = `SELECT * FROM milestone_objectives ORDER BY category_id, subcategory_id, objective_order ASC`;
    const result = await this.db.query(sql);

    return (result?.values as MilestoneObjective[]) || [];
  }

  async deleteObjectivesAll() {
    await this.dbReady;
    const sql = `DELETE FROM milestone_objectives`;
    const result = await this.db.run(sql);
    await this.saveToWeb(); 
    
    return result;
  }

  async getObjectives(categoryId: number, subcategoryId?: number): Promise<MilestoneObjective[]> {
    await this.dbReady;
    
    let sql = `SELECT * FROM milestone_objectives WHERE category_id = ?`;
    let params: any[] = [categoryId];

    if (subcategoryId) {
      sql += ` AND subcategory_id = ?`;
      params.push(subcategoryId);
    } else {
      sql += ` AND subcategory_id IS NULL`;
    }

    sql += ` ORDER BY objective_order ASC`;

    const result = await this.db.query(sql, params);
    
    // The Magic Cast: Tell TypeScript what this data is
    return (result?.values as MilestoneObjective[]) || [];
  }

  // Helper to save database to disk (only needed for Web)
  private async saveToWeb() {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(DB_NAME);
    }
  }
}