import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DataComponent } from './data/data.component';
import { CalculateComponent } from './calculate/calculate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoonheffingComponent } from './loonheffing/loonheffing.component';
import { ResultComponent } from './result/result.component';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { HomeComponent } from './home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DataComponent,
    CalculateComponent,
    LoonheffingComponent,
    ResultComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'nl-NL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
