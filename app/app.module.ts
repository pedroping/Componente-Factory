import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdCardModule,
  MdToolbarModule,
  MdTableModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { AppComponent } from './app.component';

import {
  CdkTableBasicExample,
  InlineMessageComponent,
} from './components/cdk-table/cdk-table-basic-example';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule,
    MdTableModule,
    CdkTableModule,
    MatPaginatorModule
  ],
  declarations: [AppComponent, CdkTableBasicExample, InlineMessageComponent],
  entryComponents: [InlineMessageComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
