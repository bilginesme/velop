import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'; // <--- Import it
import { TranslateService } from '@ngx-translate/core';
import { MilestoneCategory } from 'src/app/models/milestone-category.model';
import { MilestoneSubcategory } from 'src/app/models/milestone-subcategory.model';
import { MilestoneObjective } from 'src/app/models/milestone-objective.model';
import { CategoryTreeItem } from 'src/app/models/category-tree-item-model';
import { MilestoneService } from 'src/app/services/milestone.service';
import { ModalController } from '@ionic/angular';
import { ObjectiveCatalogComponent } from '../../modals/objective-catalog/objective-catalog.component';
import { ObjectiveLog } from 'src/app/models/objective-log';

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
  objectiveLogs:ObjectiveLog[] = [];
  childID: number = 1;  // TODO: we're doing it for ID = 1, link it to child select procedure

  constructor(
    private milestoneService:MilestoneService,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.milestoneService.dbReady;
    
    await this.loadCategories();
    await this.loadSubCategories();
    await this.loadObjectives();
    await this.loadObjectiveLogs();

    this.buildTree();
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
 
  async loadObjectiveLogs() {
    this.objectiveLogs = await this.milestoneService.getObjectiveLogs();
    console.log(this.objectiveLogs);
  }

  buildTree() {
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
  }

  public toggleObjective(obj:any): void {
    
  }

  public toggleSuccess(log:ObjectiveLog): void {
    console.log('toggle success', log);
  }

  async openCatalog() {
    // 1. Create the modal instance
    const modal = await this.modalCtrl.create({
      component: ObjectiveCatalogComponent,
      // You can add cool options here later, like:
      // presentingElement: await this.modalCtrl.getTop() // For iOS card-style swipe-to-close
    });

    // 2. Show the modal on screen
    await modal.present();

    // 3. Wait for the user to click "Add" or "Cancel"
    const { data, role } = await modal.onDidDismiss();

    // 4. Handle the returned data
    if (role === 'confirm' && data) {
      console.log('The user selected these objectives:', data);
      
      // TODO: Call your database service here to save 'data' into the child_progress table

      // Save them to the SQLite database
      await this.milestoneService.saveObjectiveLog(this.childID, data);
      
      // After saving, you will eventually want to call a method here 
      this.loadObjectiveLogs();
    } else {
      console.log('The user canceled or closed the modal without saving.');
    }
  }
}
