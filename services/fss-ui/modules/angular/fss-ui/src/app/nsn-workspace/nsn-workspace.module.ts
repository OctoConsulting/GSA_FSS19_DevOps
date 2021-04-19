import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NsnSearchComponent } from './nsn-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NSNWorkspaceRoutingModule } from './nsn-workspace-routing.module';
import { NsnAddComponent } from './nsn-add.component';

@NgModule({
  declarations: [
    NsnSearchComponent,
    NsnAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NSNWorkspaceRoutingModule
  ]
})
export class NsnWorkspaceModule { }
