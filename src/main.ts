import { enableProdMode } from '@angular/core'; // <--- Added
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment'; // <--- Added
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

if (environment.production) { // <--- Added
  enableProdMode();
}

jeepSqlite(window);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));