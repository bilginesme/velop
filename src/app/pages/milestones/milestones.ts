import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'; // <--- Import it
import { TranslateService } from '@ngx-translate/core';
import { MilestoneCategory } from 'src/app/models/milestone-category.model';
import { MilestoneSubcategory } from 'src/app/models/milestone-subcategory.model';
import { MilestoneObjective } from 'src/app/models/milestone-objective.model';
import { CategoryTreeItem } from 'src/app/models/category-tree-item-model';
import { MilestoneService } from 'src/app/services/milestone.service';

@Component({
  selector: 'milestones',
  templateUrl: 'milestones.html',
  styleUrls: ['milestones.scss'],
  standalone: false,
})

export class Milestones implements OnInit {
  categories: MilestoneCategory[] = []; 
  subCategories: MilestoneSubcategory[] = []; 
  objectives: MilestoneObjective[] = []; 
  treeData: CategoryTreeItem[] = [];

  constructor(
    private milestoneService:MilestoneService,
    private translate: TranslateService) {}

  async ngOnInit() {
    console.log('Starting...');
    await this.milestoneService.dbReady;
    
    await this.loadCategories();
    await this.loadSubCategories();
    await this.loadObjectives();

    this.buildTree();
    console.log(this.treeData);
  }

  async loadCategories() {
    this.categories = await this.milestoneService.getCategories();
  }

  async loadSubCategories() {
    this.subCategories = await this.milestoneService.getSubCategories();
  }

  async loadObjectives() {
    this.objectives = await this.milestoneService.getObjectivesAll();
  }
 
  buildTree() {
    console.log('Building tree structure...');

    this.treeData = this.categories.map(category => {
      
      // 1. Find subcategories that belong to this category
      const relatedSubCategories = this.subCategories.filter(
        sub => sub.category_id === category.id
      );

      // 2. Map those subcategories to include their specific objectives
      const subcategoriesWithObjectives = relatedSubCategories.map(subcat => {
        return {
          subcategory: subcat,
          // Find objectives linked to this subcategory
          objectives: this.objectives.filter(obj => obj.subcategory_id === subcat.id)
        };
      });

      // 3. Find objectives linked directly to the category (NO subcategory)
      const orphanObjectives = this.objectives.filter(
        obj => obj.category_id === category.id && obj.subcategory_id === null
      );

      // 4. Assemble and return the complete CategoryTreeItem node
      return {
        category: category,
        subcategories: subcategoriesWithObjectives,
        orphanObjectives: orphanObjectives
      };
    });

    console.log('Tree successfully built:', this.treeData);
  }

  public toggleObjective(obj:any): void {
    
  }
}
