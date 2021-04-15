import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NsnWorkspaceComponent } from './nsn-workspace.component';
import { TooltipComponent } from '../tooltip/tooltip.component';

@NgModule({
  declarations: [
    NsnWorkspaceComponent,
    TooltipComponent
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
