import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WordCountRoutingModule } from './word-count-routing.module';
import { WordCount } from './word-count';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WordCountRoutingModule,
    TranslateModule
  ],
  declarations: [WordCount]
})
export class WordCountModule {}
