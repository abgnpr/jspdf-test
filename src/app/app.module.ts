import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { JspdfPlaygroundComponent } from './components/jspdf-playground/jspdf-playground.component';

@NgModule({
  declarations: [
    AppComponent,
    JspdfPlaygroundComponent
  ],
  imports: [
    BrowserModule,
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
