import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
  {
    path: "",
    component: ListingComponent,
  },
  {
    path: ":userId/detail",
    component: DetailComponent,
  },
];

@NgModule({
  declarations: [ListingComponent, DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ResponseModule { }
