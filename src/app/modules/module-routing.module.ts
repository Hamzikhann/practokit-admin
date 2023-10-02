import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
// import { NgSelectizeModule } from 'ng-selectize';

import { MainComponent } from './main.component';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'classes',
        loadChildren: () =>
          import('./classes/classes.module').then((m) => m.ClassesModule),
      },
      {
        path: 'subjects',
        loadChildren: () =>
          import('./courses/courses.module').then((m) => m.CoursesModule),
      },
      {
        path: 'questions',
        loadChildren: () =>
          import('./question/question.module').then((m) => m.QuestionModule),
      },
      {
        path: 'assessments',
        loadChildren: () =>
          import('./quiz/quiz.module').then((m) => m.QuizModule),
      },
      {
        path: 'complaints',
        loadChildren: () =>
          import('./complaints/complaints.module').then(
            (m) => m.ComplaintsModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    RouterModule.forChild(routes),
  ],
})
export class ModuleRouting {}
