import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'; // <--- Import it
import { TranslateService } from '@ngx-translate/core';
import { MilestoneCategory } from 'src/app/models/milestone-category.model';
import { MilestoneSubcategory } from 'src/app/models/milestone-subcategory.model';
import { MilestoneObjective } from 'src/app/models/milestone-objective.model';
import { CategoryTreeItem } from 'src/app/models/category-tree-item-model';
import { MilestoneService } from 'src/app/services/milestone.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ObjectiveCatalogComponent } from '../../modals/objective-catalog/objective-catalog.component';
import { ObjectiveLog } from 'src/app/models/objective-log';
import { ObjectiveLogDetailComponent } from 'src/app/modals/objective-log-detail/objective-log-detail.component';

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
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.milestoneService.dbReady;
    
    //this.milestoneService.deleteObjectiveLogsAll();

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
      // TODO: Call your database service here to save 'data' into the child_progress table

      // Save them to the SQLite database
      await this.milestoneService.saveObjectiveLog(this.childID, data);
      
      // After saving, you will eventually want to call a method here 
      this.loadObjectiveLogs();
    } else {
      console.log('The user canceled or closed the modal without saving.');
    }
  }

  public async openLogModalObjectiveLog(objectiveLog: ObjectiveLog) {
    const modal = await this.modalCtrl.create({
      component: ObjectiveLogDetailComponent,
      componentProps: {
      // Key name must match the @Input() name in the destination component
      // We use the spread operator {...log} to pass a copy, 
      // preventing the background list from updating before the user hits 'Save'
      objectiveLog: { ...objectiveLog } 
    }
    });

    // 2. Show the modal on screen
    await modal.present();

    // 3. Wait for the user to click "Add" or "Cancel"
    const { data, role } = await modal.onDidDismiss();

    // 4. Handle the returned data
    if (role === 'save' && data) {
      // TODO: Call your database service here to save 'data' into the child_progress table
      // Save them to the SQLite database
      // await this.milestoneService.saveObjectiveLog(this.childID, data);
      await this.milestoneService.updateObjectiveLog(data);
      

      // After saving, you will eventually want to call a method here 
      this.loadObjectiveLogs();
    } 
    else if (role === 'delete' && data) {
      
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('OBJECTIVE_DETAIL.DELETE_HEADER'), 
        message: this.translate.instant('OBJECTIVE_DETAIL.DELETE_MESSAGE'), 
        buttons: [
          {
            text: this.translate.instant('BUTTONS.CANCEL'),
            role: 'cancel'
          },
          {
            text: this.translate.instant('BUTTONS.DELETE'),
            role: 'destructive',
            handler: async () => {
              await this.milestoneService.deleteObjectiveLog(data.id);
              this.loadObjectiveLogs();
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.log(role);
      console.log('The user canceled or closed the modal without saving.');
    }
  }
}
