import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NsnAddComponent } from './nsn-add.component';
import { NsnSearchComponent } from './nsn-search.component';

const routes: Routes = [
    { path: 'nsn/search',  component: NsnSearchComponent },
    { path: 'nsn/add', component: NsnAddComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NSNWorkspaceRoutingModule { }

