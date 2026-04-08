import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// 1. Add these three imports at the top
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MilestoneService } from '../../services/milestone.service';
import { MilestoneCategory } from '../../models/milestone-category.model';
import { MilestoneSubcategory } from '../../models/milestone-subcategory.model';
import { MilestoneObjective } from '../../models/milestone-objective.model';
import { IonHeader, IonToolbar, IonContent, IonButton, IonButtons } from "@ionic/angular/standalone";

// If you created a specific interface for the tree, import it here!
// import { CategoryTreeItem } from '../../models/category-tree-item.model';

@Component({
  selector: 'app-objective-catalog',
  templateUrl: './objective-catalog.component.html',
  styleUrls: ['./objective-catalog.component.scss'],
  standalone: true, // This tells Angular it's an island
  imports: [IonicModule, CommonModule, TranslateModule]
})

export class ObjectiveCatalogComponent implements OnInit {
  categories: MilestoneCategory[] = [];
  subCategories: MilestoneSubcategory[] = [];
  objectives: MilestoneObjective[] = [];
  treeData: any[] = []; // Replace 'any' with CategoryTreeItem if you made the model

  // This array holds whatever the user checks
  selectedObjectives: MilestoneObjective[] = [];

  constructor(
    private modalCtrl: ModalController,
    private milestoneService: MilestoneService
  ) {}

  async ngOnInit() {
    await this.milestoneService.dbReady;
    
    // Fetch all the master catalog data
    this.categories = await this.milestoneService.getCategories();
    this.subCategories = await this.milestoneService.getSubCategories();
    this.objectives = await this.milestoneService.getObjectivesAll(); // Assuming you have this method!

    this.buildTree();
  }

  buildTree() {
    this.treeData = this.categories.map(category => {
      const relatedSubCategories = this.subCategories.filter(sub => sub.category_id === category.id);

      const subcategoriesWithObjectives = relatedSubCategories.map(subcat => {
        return {
          subcategory: subcat,
          objectives: this.objectives.filter(obj => obj.subcategory_id === subcat.id)
        };
      });

      const orphanObjectives = this.objectives.filter(
        obj => obj.category_id === category.id && obj.subcategory_id === null
      );

      return {
        category: category,
        subcategories: subcategoriesWithObjectives,
        orphanObjectives: orphanObjectives
      };
    });
  }

  // The method you asked about! Add or remove from the selection array.
  toggleObjective(obj: MilestoneObjective) {
    const index = this.selectedObjectives.findIndex(item => item.id === obj.id);
    if (index > -1) {
      this.selectedObjectives.splice(index, 1); // It was checked, so uncheck it
    } else {
      this.selectedObjectives.push(obj); // It was unchecked, so add it
    }
  }

  // Close the modal and pass NOTHING back
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  // Close the modal and pass the array of selected items back to the main page
  confirm() {
    return this.modalCtrl.dismiss(this.selectedObjectives, 'confirm');
  }
}