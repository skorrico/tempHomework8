import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TabsComponent } from './tabs/tabs.component';
import { ChartsModule } from 'ng2-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { FavoriteComponent } from './favorite/favorite.component';
// import { NgbdModalComponent, NgbdModalContent } from './modal-component';


@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    TabsComponent,
    ProgressBarComponent,
    FavoriteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule, 
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent, SearchFormComponent],
  entryComponents: [TabsComponent]
})
export class AppModule { }
