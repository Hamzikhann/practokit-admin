import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { QuestionService } from 'src/app/services/question/question.service';
// import { QuestionTypeService } from 'src/app/services/questionType/question-type.service';
import { QuestionTypeService } from 'src/app/services/questionType/question-type.service';
@Component({
  selector: 'app-question-types',
  templateUrl: './question-types.component.html',
  styleUrls: ['./question-types.component.css'],
})
export class QuestionTypesComponent implements OnInit {
  loading: boolean = false;
  questionsTypeList: any;
  newType: string = '';
  selectedType: {
    id: string;
    title: string;
  } = { id: '', title: '' };

  constructor(
    private typeService: QuestionTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getQuestionTypes();
  }

  getQuestionTypes() {
    this.typeService.getAllTypes().subscribe((res: any) => {
      this.questionsTypeList = res.body;
      this.sort();
      this.loading = false;
    });
  }

  sort() {
    this.questionsTypeList.sort(function (
      a: { title: number },
      b: { title: number }
    ) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  }
}
