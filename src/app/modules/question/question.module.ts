import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
// import { NgSelectizeModule } from 'ng-selectize';
import { ClickOutsideModule } from 'ng-click-outside';

import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionListingComponent } from './question-listing/question-listing.component';
import { QuestionTypesComponent } from './question-types/question-types.component';
import { QuestionTagsComponent } from './question-tags/question-tags.component';
import { QuestionDifficultiesComponent } from './question-difficulties/question-difficulties.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: '',
    component: QuestionListingComponent,
  },
  {
    path: 'add',
    component: AddQuestionComponent,
  },
  {
    path: 'edit/:questionId',
    component: AddQuestionComponent,
  },
  {
    path: 'difficulties',
    component: QuestionDifficultiesComponent,
  },
  {
    path: 'tags',
    component: QuestionTagsComponent,
  },
  {
    path: 'types',
    component: QuestionTypesComponent,
  },
];

@NgModule({
  declarations: [
    AddQuestionComponent,
    QuestionListingComponent,
    QuestionTypesComponent,
    QuestionTagsComponent,
    QuestionDifficultiesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    ClickOutsideModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class QuestionModule {}
