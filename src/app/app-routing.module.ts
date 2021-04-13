import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculateComponent } from './calculate/calculate.component';
import { DataComponent } from './data/data.component';
import { HomeComponent } from './home/home.component';
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
    path: 'result',
    component: ResultComponent,
    resolve: { result: ResultResolver },
    canActivate: [DataGuardService]
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
