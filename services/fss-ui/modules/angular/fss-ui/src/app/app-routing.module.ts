import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NsnWorkspaceComponent } from './nsn-workspace/nsn-workspace.component';
import { NsnWorkspaceModule } from './nsn-workspace/nsn-workspace.module';

const routes: Routes = [
  {
    path: '', component: NsnWorkspaceComponent, children: [
      {
        path: '',
        component: NsnWorkspaceComponent,
        data: {
          title: 'NSN'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),NsnWorkspaceModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
