import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTestCompComponent } from './my-test-comp/my-test-comp.component';

const routes: Routes = [
    {
        path: 'test',
        component: MyTestCompComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
