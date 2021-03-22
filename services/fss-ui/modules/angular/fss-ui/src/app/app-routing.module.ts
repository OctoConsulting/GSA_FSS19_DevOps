import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NsnWorkspaceComponent } from './nsn-workspace/nsn-workspace.component';

const routes: Routes = [
  {
    path: '', component: NsnWorkspaceComponent, children: [
      {
        path: '',
        loadChildren: () => import('./nsn-workspace/nsn-workspace.module').then(m => m.NsnWorkspaceModule),
        data: {
          title: 'NSN'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
