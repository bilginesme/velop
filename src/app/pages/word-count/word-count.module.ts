import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WordCountRoutingModule } from './word-count-routing.module';
import { WordCount } from './word-count';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WordCountRoutingModule
  ],
  declarations: [WordCount]
})
export class WordCountModule {}
