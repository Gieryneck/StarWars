import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MenuContainerComponent } from './components/menu-container/menu-container.component';
import { MenuElementComponent } from './components/menu-element/menu-element.component';
import { HttpClientModule } from "@angular/common/http";
import { ProfileViewComponent } from './components/profile-view/profile-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuContainerComponent,
    MenuElementComponent,
    ProfileViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
