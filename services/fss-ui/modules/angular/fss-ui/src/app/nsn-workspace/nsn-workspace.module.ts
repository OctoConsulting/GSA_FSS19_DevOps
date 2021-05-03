import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NSNSearchComponent } from './nsn-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NSNWorkspaceRoutingModule } from './nsn-workspace-routing.module';
import { NSNAddEditComponent } from './nsn-addedit.component';

@NgModule({
  declarations: [
    NSNSearchComponent,
    NSNAddEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule,
    NSNWorkspaceRoutingModule
  ]
})
export class NSNWorkspaceModule { }
