import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NSNSearchComponent } from './nsn-workspace/nsn-search.component';

const routes: Routes = [
  {
    path: 'nsn', component: NSNSearchComponent, children: [
      {
        path: 'nsn',
        loadChildren: () => import('./nsn-workspace/nsn-workspace.module').then(m => m.NSNWorkspaceModule),
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