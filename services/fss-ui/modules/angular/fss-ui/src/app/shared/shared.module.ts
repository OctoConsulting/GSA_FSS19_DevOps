import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplacePipe } from './pipes/replace.pipe';

@NgModule({
  declarations: [
    ReplacePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReplacePipe
  ]
})
export class SharedModule { }
