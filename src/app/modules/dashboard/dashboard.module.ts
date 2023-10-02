import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxCaptureModule } from 'ngx-capture';
import { ExportAsModule } from 'ngx-export-as';

import { DashboardComponent } from './dashboard/dashboard.component';



const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxCaptureModule,
    ExportAsModule
  ]
})
export class DashboardModule { }
