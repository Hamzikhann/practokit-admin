import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassListingComponent } from './class-listing/class-listing.component';

const routes: Routes = [{ path: '', component: ClassListingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
