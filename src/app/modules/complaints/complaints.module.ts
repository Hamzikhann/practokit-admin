import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ComplaintsComponent } from './complaints/complaints.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ComplaintsComponent }
]

@NgModule({
  declarations: [ComplaintsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forChild(routes)
  ]
})
export class ComplaintsModule { }
