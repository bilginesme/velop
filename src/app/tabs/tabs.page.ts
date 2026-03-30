import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    let test = this.translate.instant('MENU.DASHBOARD');
    console.log('translator test', test);
  }

}
