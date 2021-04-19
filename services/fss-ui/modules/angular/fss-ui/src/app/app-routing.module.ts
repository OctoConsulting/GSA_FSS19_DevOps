import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NsnSearchComponent } from './nsn-workspace/nsn-search.component';

const routes: Routes = [
  {
    path: 'nsn', component: NsnSearchComponent, children: [
      {
        path: 'nsn',
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