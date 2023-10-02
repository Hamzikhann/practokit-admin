import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesListingComponent } from './courses-listing/courses-listing.component';


@NgModule({
  declarations: [CoursesListingComponent],
  imports: [
    CommonModule,
    FormsModule,
    CoursesRoutingModule
  ]
})
export class CoursesModule { }
