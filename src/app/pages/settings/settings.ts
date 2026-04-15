import { Component, OnInit } from '@angular/core';
import { MilestoneService } from '../../services/milestone.service'; // <--- Import it
import { TranslateService } from '@ngx-translate/core';
import { MilestoneObjective } from 'src/app/models/milestone-objective.model';
import { MilestoneSubcategory } from 'src/app/models/milestone-subcategory.model';
import { MilestoneCategory } from 'src/app/models/milestone-category.model';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.scss'],
  standalone: false,
})

export class Settings implements OnInit {
  categories: MilestoneCategory[] = []; 
  subCategories: MilestoneSubcategory[] = []; 
  objectives: MilestoneObjective[] = []; 

  constructor(
    private milestoneService:MilestoneService,
    private translate: TranslateService) {}

  async ngOnInit() {
    console.log('Starting...');
    // Load data when the app starts
    //await this.db.dbReady;
    //this.loadLogs();

    await this.milestoneService.dbReady;
    //await this.milestoneService.seedCategories();
    //await this.milestoneService.seedSubCategories();
    //await this.milestoneService.seedObjectives();
    await this.milestoneService.deleteObjectivesAll();
    await this.milestoneService.seedObjectives();
    
    await this.loadCategories();
    await this.loadSubCategories();
    await this.loadObjectives();
  }

  async loadCategories() {
    console.log('Loading categories...');
    this.categories = await this.milestoneService.getCategories();
    console.log('Loaded categories:');
    console.log(this.categories);
  }

  async loadSubCategories() {
    console.log('Loading sub-categories...');
    this.subCategories = await this.milestoneService.getSubCategories();
    console.log('Loaded sub-categories:');
    console.log(this.subCategories);
  }

  async loadObjectives() {
    console.log('Loading objectives...');
    this.objectives = await this.milestoneService.getObjectivesAll();
    console.log('Loaded objectives:');
    console.log(this.objectives);
  }
}
