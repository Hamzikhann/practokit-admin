import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { QuestionService } from 'src/app/services/question/question.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { CourseService } from 'src/app/services/course/course.service';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

// import { Dropbox } from 'dropbox';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-listing',
  templateUrl: './question-listing.component.html',
  styleUrls: ['./question-listing.component.css'],
})
export class QuestionListingComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;
  detailLoading: boolean = false;
  gradeList: any;
  gradeId: string = '';
  CoursesList: any;
  courseId: string = '';
  questionsList: any;
  filteredQuestionList: any;
  tagsList: Set<string> = new Set();
  selectedQuestion: {
    id: string;
    statement: string;
    class: string;
    course: string;
    type: string;
    difficulty: string;
    options: any;
    timeDuration: string;
    tags: any;
    points: any;
    questionsAttribute: any;
  } = {
    id: '',
    statement: '',
    class: '',
    course: '',
    type: '',
    difficulty: '',
    options: null,
    timeDuration: '',
    tags: null,
    questionsAttribute: null,
    points: 0,
  };

  safeUrl: any = '';
  optionsSafeUrl: any = ['', '', '', '', '', '', '', ''];
  hintSafeUrl: any = '';
  popUpImageSource: any;
  popUpImage: any;

  constructor(
    private questionService: QuestionService,
    private gradeService: GradeService,
    private toastr: ToastrService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.getGrades();
    this.getQuestions();
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
      this.questionsList = res.body;
      this.filteredQuestionList = this.questionsList;
      this.loading = false;
    });
  }

  getGrades() {
    this.gradeService.getAllGrades().subscribe((res) => {
      this.gradeList = res.body;
    });
  }

  onModalOpen(question: {
    questionTags: any[];
    id: any;
    statement: any;
    course: { class: { title: any }; title: any };
    questionType: { title: any };
    questionDifficulty: { title: any };
    questionsOptions: any;
    duration: number;
    questionsAttribute: any;
    points: any;
  }) {
    this.resetLinks();
    this.detailLoading = true;

    question.questionTags.forEach((element: { tag: { title: string } }) => {
      this.tagsList.add(element.tag.title);
    });

    this.selectedQuestion = {
      id: question.id,
      statement: question.statement,
      class: question.course.class.title,
      course: question.course.title,
      type: question.questionType.title,
      difficulty: question.questionDifficulty.title,
      options: question.questionsOptions,
      timeDuration:
        parseInt((question.duration / 60).toString()) +
        ' min ' +
        parseInt((question.duration % 60).toString()) +
        ' sec',
      tags: this.tagsList,
      questionsAttribute: question.questionsAttribute,
      points: question.points,
    };
    this.loadImage();

    this.detailLoading = false;
  }

  deleteQuestion() {
    this.questionService
      .deleteQuestion(this.selectedQuestion.id)
      .subscribe((res) => {
        this.toastr.success('Question Deleted Successfully!');
        this.getQuestions();
      });
  }

  getCourses(gradeId?: any) {
    this.courseService
      .getCourses(gradeId ? gradeId : this.gradeId)
      .subscribe((res) => {
        this.CoursesList = res.body;
      });
  }

  loadImage() {
    // var dbx = new Dropbox({ accessToken: environment.dropBoxToken });
    // if (this.selectedQuestion.questionsAttribute?.statementImage) {
    //   dbx
    //     .filesDownload({
    //       path: this.selectedQuestion.questionsAttribute.statementImage,
    //     })
    //     .then((res: any) => {
    //       this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       console.log('got error:', error.status);
    //       this.safeUrl = '';
    //     });
    // }
    // var options = this.selectedQuestion.options;
    // if (options[0]?.image) {
    //   dbx
    //     .filesDownload({ path: options[0].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[0] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[0] = '';
    //       console.log('0 got error:', error);
    //     });
    // }
    // if (options[1]?.image) {
    //   dbx
    //     .filesDownload({ path: options[1].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[1] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[1] = '';
    //       console.log('1 got error:', error);
    //     });
    // }
    // if (options[2]?.image) {
    //   dbx
    //     .filesDownload({ path: options[2].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[2] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[2] = '';
    //       console.log('2 got error:', error);
    //     });
    // }
    // if (options[3]?.image) {
    //   dbx
    //     .filesDownload({ path: options[3].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[3] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[3] = '';
    //       console.log('3 got error:', error);
    //     });
    // }
    // if (options[4]?.image) {
    //   dbx
    //     .filesDownload({ path: options[4].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[4] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[4] = '';
    //       console.log('4 got error:', error);
    //     });
    // }
    // if (options[5]?.image) {
    //   dbx
    //     .filesDownload({ path: options[5].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[5] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[5] = '';
    //       console.log('5 got error:', error);
    //     });
    // }
    // if (options[6]?.image) {
    //   dbx
    //     .filesDownload({ path: options[6].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[6] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[6] = '';
    //       console.log('6 got error:', error);
    //     });
    // }
    // if (options[7]?.image) {
    //   dbx
    //     .filesDownload({ path: options[7].image })
    //     .then((res: any) => {
    //       this.optionsSafeUrl[7] = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       this.optionsSafeUrl[7] = '';
    //       console.log('7 got error:', error);
    //     });
    // }
    // if (this.selectedQuestion.questionsAttribute?.hintFile) {
    //   dbx
    //     .filesDownload({
    //       path: this.selectedQuestion.questionsAttribute.hintFile,
    //     })
    //     .then((res: any) => {
    //       this.hintSafeUrl = this.sanitizer.bypassSecurityTrustUrl(
    //         window.URL.createObjectURL(res.result.fileBlob)
    //       );
    //     })
    //     .catch((error) => {
    //       console.log('got error:', error);
    //       this.hintSafeUrl = null;
    //     });
    // }
  }

  Filter() {
    this.loading = true;
    this.filteredQuestionList = [];
    if (this.gradeId) {
      this.questionsList.forEach(
        (question: { course: { id: string; class: { id: string } } }) => {
          if (this.courseId) {
            if (
              this.courseId == question.course.id &&
              this.gradeId &&
              this.gradeId == question.course.class.id
            ) {
              this.filteredQuestionList.push(question);
            }
          } else if (this.gradeId && this.gradeId == question.course.class.id) {
            this.filteredQuestionList.push(question);
          }
        }
      );
    } else {
      this.filteredQuestionList = this.questionsList;
    }
    this.loading = false;
  }

  resetLinks() {
    this.safeUrl = '';
    this.optionsSafeUrl.forEach((element: any, index: string | number) => {
      this.optionsSafeUrl[index] = '';
    });
    this.hintSafeUrl = '';
  }
}
