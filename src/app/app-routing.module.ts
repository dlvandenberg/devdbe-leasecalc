import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculateComponent } from './calculate/calculate.component';
import { DataComponent } from './data/data.component';

const routes: Routes = [
  { path: 'data', component: DataComponent },
  { path: 'calculate', component: CalculateComponent },
  { path: '', component: DataComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
