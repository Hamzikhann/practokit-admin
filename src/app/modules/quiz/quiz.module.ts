import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClickOutsideModule } from 'ng-click-outside';

import { BuilderComponent } from './builder/builder.component';
import { AttemptComponent } from './attempt/attempt.component';
// import { NgSelectizeModule } from 'ng-selectize';
import { DataTablesModule } from 'angular-datatables';
import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: ListingComponent,
  },
  {
    path: 'create',
    component: BuilderComponent,
  },
  {
    path: 'edit/:quizId',
    component: BuilderComponent,
  },
  {
    path: 'detail/:quizId',
    component: DetailComponent,
  },
  {
    path: 'attempt/:quizId',
    component: AttemptComponent,
  },
  {
    path: 'attempt/:quizId/wrong/questions',
    component: AttemptComponent,
  },
  {
    path: 'detail/:quizId/responses',
    loadChildren: () =>
      import('./responses/response.module').then((m) => m.ResponseModule),
  },
];

@NgModule({
  declarations: [
    BuilderComponent,
    AttemptComponent,
    ListingComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    ClickOutsideModule,
    FormsModule,
    DataTablesModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
  ],
})
export class QuizModule {}
