import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NsnWorkspaceComponent } from './nsn-workspace.component';

@NgModule({
  declarations: [
    NsnWorkspaceComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    NsnWorkspaceComponent
  ],
})
export class NsnWorkspaceModule { }
