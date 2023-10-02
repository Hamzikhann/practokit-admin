import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClassesRoutingModule } from './classes-routing.module';
import { ClassListingComponent } from './class-listing/class-listing.component';


@NgModule({
  declarations: [ClassListingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ClassesRoutingModule
  ]
})
export class ClassesModule { }
