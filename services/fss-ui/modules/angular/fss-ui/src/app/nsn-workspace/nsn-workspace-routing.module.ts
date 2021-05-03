import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NSNAddEditComponent } from './nsn-addedit.component';
import { NSNSearchComponent } from './nsn-search.component';

const routes: Routes = [
    { path: 'nsn/search',  component: NSNSearchComponent },
    { path: 'nsn/add', component: NSNAddEditComponent},
    { path: 'nsn/edit', component: NSNAddEditComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NSNWorkspaceRoutingModule { }

