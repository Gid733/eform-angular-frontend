import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'example-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/example-pn/example-pn.module#ExamplePnModule'
  },
  {
    path: 'vehicles-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/vehicles-pn/vehicles-pn.module#VehiclesPnModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRoutingModule {
}
