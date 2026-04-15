import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
// 1. Add these three imports at the top
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MilestoneService } from '../../services/milestone.service';
import { MilestoneCategory } from '../../models/milestone-category.model';
import { MilestoneSubcategory } from '../../models/milestone-subcategory.model';
import { MilestoneObjective } from '../../models/milestone-objective.model';
import { IonHeader, IonToolbar, IonContent, IonButton, IonButtons } from "@ionic/angular/standalone";
import { ObjectiveLog } from 'src/app/models/objective-log';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-objective-log-detail',
  templateUrl: './objective-log-detail.component.html',
  styleUrls: ['./objective-log-detail.component.scss'],
  standalone: true, // This tells Angular it's an island
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})

export class ObjectiveLogDetailComponent implements OnInit {
  @Input() objectiveLog!: ObjectiveLog; // Passed in from the main page
  public logData!: ObjectiveLog;   // Create a working copy so we don't mutate the list UI until they hit "Save"
  public isCompleted: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.logData = { ...this.objectiveLog }; // Clone the object
    this.isCompleted = this.logData.is_succeeded === 1;
  }

  onStatusChange() {
    // Bridge: Boolean (UI) -> Number (DB)
    // We explicitly assign 1 or 0 to the number field
    this.logData.is_succeeded = this.isCompleted ? 1 : 0;
    
    if (this.isCompleted) {
      this.logData.date_achieved = this.logData.date_achieved || new Date().toISOString();
    } else {
      this.logData.date_achieved = null;
    }
  }

  save() {
    this.modalCtrl.dismiss(this.logData, 'save');
  }

  async deleteLog() {
    this.modalCtrl.dismiss(this.logData, 'delete');
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}