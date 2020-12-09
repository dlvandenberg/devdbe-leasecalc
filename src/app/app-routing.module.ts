import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculateComponent } from './calculate/calculate.component';
import { DataComponent } from './data/data.component';
import { LoonheffingComponent } from './loonheffing/loonheffing.component';
import { ResultComponent } from './result/result.component';
import { ResultResolver } from './result/result.resolver';
import { DataGuardService } from './services/data-guard.service';

const routes: Routes = [
  { path: 'data', component: DataComponent },
  {
    path: 'bereken',
    component: CalculateComponent,
    canActivate: [DataGuardService],
  },
  {
    path: 'loonheffing/:loon',
    component: LoonheffingComponent,
    canActivate: [DataGuardService],
  },
  {
    path: 'result',
    component: ResultComponent,
    resolve: { result: ResultResolver },
    canActivate: [DataGuardService]
  },
  { path: '', component: DataComponent, pathMatch: 'full' },
  { path: '**', component: DataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
