// import { flatten } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DifficultyService } from 'src/app/services/difficulty/difficulty.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { TagService } from 'src/app/services/questionTag/tag.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { CourseService } from 'src/app/services/course/course.service';
import { environment } from '../../../../environments/environment';
import { HelperService } from 'src/app/services/helper/helper.service';

// import { Dropbox } from 'dropbox';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css'],
})
export class BuilderComponent implements OnInit {
  selectedTags: any[] = [];
  filterTags: any[] = [];
  dropdownOpen = false;
  searchQueryOfTags: string = '';

  selectedDifficulty: any[] = [];
  filterDifficulty: any[] = [];
  dropdownOpenOfDifficulty = false;
  searchQueryOfDifficulty: string = '';
  ////////////
  loading: boolean = false;
  questionsLoading: boolean = false;

  detailLoading: boolean = false;
  reviewLoading: boolean = false;

  viewAssessment: Boolean = false;
  editAssessment: Boolean = true;
  step: number = 1;
  title: string | null = null;
  gradeId: string = '';
  gradeTitle: string = '';
  courseTitle: string = '';
  CoursesList: any = [];
  gradeList: any = [];
  difficultyList: any = [];
  tagList: any = [];
  questions: any = [];
  filteredQuestions: any = [];
  multipleOptionsConfig = Object.assign(
    {},
    {
      highlight: false,
      create: false,
      persist: true,
      plugins: ['dropdown_direction', 'remove_button'],
      dropdownDirection: 'down',
    },
    {
      labelField: 'label',
      valueField: 'value',
      searchField: ['label', 'value'],
      maxItems: 100,
    }
  );
  reviewTags = new Set();
  selectedDifficulties: any = [];
  // selectedTags: string[] = [];
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

  oldCourseId: string = '';
  courseId: string = '';
  selectedQuestions: any = [];
  selectedQuestionsIds: any = [];
  assessmentLink: string = '';

  totalMarks: number = 0;
  totalTime: number = 0;
  formatedTotalTime: string = '';
  selectedQuestionsType: Set<string> = new Set();

  quizId: string | null = '';
  editMode: boolean = false;

  // for Pagination
  q: number | null = null;
  perPagePagination: number = 10;
  pageLength: number | null = null;
  lastPageLength: number | null = null;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private gradeService: GradeService,
    private tagService: TagService,
    private questionService: QuestionService,
    private diffService: DifficultyService,
    private quizService: QuizService,
    private courseService: CourseService,
    private helperService: HelperService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.quizId = this.activatedRoute.snapshot.paramMap.get('quizId');
    // console.log(this.quizId);
    this.getClasses();
    // this.getDifficulties();
    // this.getTags();
    if (this.quizId) {
      this.loading = true;
      this.editMode = true;
      this.getQuizDetail();
    }
  }

  getQuizDetail() {
    this.quizService.getQuizDetail(this.quizId).subscribe((res: any) => {
      // console.log(res);
      this.getCourses(res.body['classId']);
      this.title = res.body['title'];
      this.gradeId = res.body['classId'];
      this.courseId = res.body['courseId'];
      this.gradeTitle = res.body['classTitle'];
      this.courseTitle = res.body['courseTitle'];
      this.getTags();
      this.getAllCourseQuestions();

      res.body['tags'].forEach((element: { id: string }) => {
        this.selectedTags.push(element.id);
      });
      res.body['questionsPool'].forEach((element: { id: any }) => {
        this.selectedQuestions.push(element);
        this.selectedQuestionsIds.push(element.id);
      });
      this.loading = false;
      this.filter();
    });
  }

  showEditView() {
    this.editAssessment = true;
    this.viewAssessment = false;
  }

  showAssessmentView() {
    this.editAssessment = false;
    this.viewAssessment = true;
  }

  getClasses() {
    this.gradeService.getAllGrades().subscribe((res: any) => {
      // console.log(res);
      this.gradeList = res.body;
    });
  }

  getCourses(gradeId?: any) {
    this.courseService
      .getCourses(gradeId ? gradeId : this.gradeId)
      .subscribe((res: any) => {
        this.CoursesList = res.body;
      });
  }

  getDifficulties() {
    this.diffService.getAllDifficulties().subscribe((res: any) => {
      res.body.forEach((diff: { title: any; id: any }) => {
        this.difficultyList.push({
          label: diff.title,
          value: diff.id,
        });
      });
      // console.log(this.difficultyList);
      this.filterDifficulty = this.difficultyList;
      // console.log(this.filterDifficulty);
    });
  }

  getTags() {
    this.tagService.getTagsByCourseId(this.courseId).subscribe((res: any) => {
      res.body.forEach((tag: { title: any; id: any }) => {
        this.tagList.push({
          label: tag.title,
          value: tag.id,
        });
      });
      // console.log(this.tagList);
      this.filterTags = this.tagList;
      // console.log(this.filterTags);
    });
  }

  getAllCourseQuestions() {
    this.questionsLoading = true;
    if (this.oldCourseId != this.courseId) {
      this.selectedQuestions = [];
      this.selectedQuestionsIds = [];
      this.selectedTags = [];
      this.selectedDifficulties = [];
    }
    this.questionService
      .getAllQuestionsOfCourse(this.courseId)
      .subscribe((res) => {
        this.oldCourseId = this.courseId;
        this.questions = res.body;
        this.questions.forEach(
          (element: { duration: number; timeDuration: string }) => {
            var min =
              Math.floor(element.duration / 60) === 0
                ? ''
                : Math.floor(element.duration / 60) + ' min ';
            element.timeDuration =
              min + Math.floor(element.duration % 60) + ' sec';
          }
        );
        this.filteredQuestions = this.questions.map((e: any) => {
          return e;
        });

        // For Pagination
        this.pageLength = Math.floor(
          this.filteredQuestions.length / this.perPagePagination + 1
        );
        this.lastPageLength =
          this.filteredQuestions.length % this.perPagePagination;
        //

        this.questionsLoading = false;
      });
  }

  goToStep(number: number) {
    this.step = number;
  }

  selectQuestion(question: { id: any }) {
    if (this.selectedQuestionsIds.indexOf(question.id) == -1) {
      this.selectedQuestions.push(question);
      this.selectedQuestionsIds.push(question.id);
    } else {
      this.deSelectQuestion(question.id);
    }
  }

  deSelectQuestion(id: any) {
    var index = this.selectedQuestionsIds.indexOf(id);
    this.selectedQuestions.splice(index, 1);
    this.selectedQuestionsIds.splice(index, 1);

    this.filter();
  }

  getReviewData() {
    this.reviewLoading = true;
    this.totalMarks = 0;
    this.totalTime = 0;
    this.reviewTags = new Set();
    this.selectedQuestionsType = new Set();

    this.selectedQuestions.forEach(
      (q: {
        points: number;
        duration: number;
        questionType: { title: string };
        questionTags: any[];
      }) => {
        this.totalMarks = this.totalMarks + q.points;
        this.totalTime += q.duration;
        this.selectedQuestionsType.add(q.questionType.title);

        q.questionTags.forEach((t: { tag: { title: unknown } }) => {
          this.reviewTags.add(t.tag.title);
        });
      }
    );

    this.formatedTotalTime =
      Math.floor(this.totalTime / 60) +
      ' min ' +
      Math.floor(this.totalTime % 60) +
      ' sec';
    this.reviewLoading = false;
  }

  setGrade() {
    this.gradeTitle =
      this.gradeList[
        this.gradeList
          .map((e: { id: any }) => {
            return e.id;
          })
          .indexOf(this.gradeId)
      ].title;
  }

  setCourse() {
    this.courseTitle =
      this.CoursesList[
        this.CoursesList.map((e: { id: any }) => {
          return e.id;
        }).indexOf(this.courseId)
      ].title;
  }

  createQuiz() {
    if (this.selectedQuestions.length < 5) {
      this.toastr.error('Please select at least 5 questions');
    } else {
      var tagsIds: any[] = [];
      this.selectedQuestions.forEach((q: { questionTags: any[] }) => {
        q.questionTags.forEach((t: { tag: { id: any } }) => {
          if (tagsIds.indexOf(t.tag.id) == -1) {
            tagsIds.push(t.tag.id);
          }
        });
      });

      var payload;
      if (this.editMode) {
        payload = {
          title: this.title,
          tagsIdList: tagsIds,
          questionsIds: this.selectedQuestionsIds,
        };

        this.quizService
          .UpdateQuiz(this.quizId, payload)
          .subscribe((res: any) => {
            this.toastr.success('Assessment Updated!');
            this.router.navigate(['assessments/detail/', res.body['quizId']]);
          });
      } else {
        payload = {
          title: this.title,
          tagsIdList: tagsIds,
          courseId: this.courseId,
          questionsIds: this.selectedQuestionsIds,
        };

        this.quizService.GenerateQuiz(payload).subscribe((res: any) => {
          this.toastr.success('Assessment Created!');
          this.router.navigate(['assessments/detail/', res.body['quizId']]);
        });
      }
    }
  }

  validAssessment() {
    if (this.selectedQuestions.length == 0) {
      this.toastr.error('No question selected.');
    } else {
      this.getReviewData();
      this.showAssessmentView();
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 5);
      }
    })();
  }

  filter() {
    if (
      this.selectedDifficulties.length == 0 &&
      this.selectedTags.length == 0
    ) {
      this.filteredQuestions = this.questions.map((e: any) => {
        return e;
      });
    } else if (
      this.selectedDifficulties.length == 0 &&
      this.selectedTags.length != 0
    ) {
      var newfilterQuestion: any[] = [];
      this.questions.forEach((q: { questionTags: any[]; id: any }) => {
        q.questionTags.forEach((t: { tag: { id: string } }) => {
          if (
            newfilterQuestion
              .map((e) => {
                return e.id;
              })
              .indexOf(q.id) == -1
          ) {
            if (
              this.selectedTags.indexOf(t.tag.id) != -1 ||
              this.selectedQuestionsIds.indexOf(q.id) != -1
            ) {
              newfilterQuestion.push(q);
            }
          }
        });
      });
      this.filteredQuestions = newfilterQuestion;
    } else if (
      this.selectedDifficulties.length != 0 &&
      this.selectedTags.length == 0
    ) {
      var newfilterQuestion = [];
      this.questions.forEach(
        (q: { id: any; questionDifficulty: { id: any } }) => {
          if (
            newfilterQuestion
              .map((e) => {
                return e.id;
              })
              .indexOf(q.id) == -1
          ) {
            if (
              this.selectedDifficulties.indexOf(q.questionDifficulty.id) !=
                -1 ||
              this.selectedQuestionsIds.indexOf(q.id) != -1
            ) {
              newfilterQuestion.push(q);
            }
          }
        }
      );
      this.filteredQuestions = newfilterQuestion;
    } else {
      var newfilterQuestion = [];
      this.questions.forEach(
        (q: {
          questionTags: any[];
          id: any;
          questionDifficulty: { id: any };
        }) => {
          q.questionTags.forEach((t: { tag: { id: string } }) => {
            if (
              newfilterQuestion
                .map((e) => {
                  return e.id;
                })
                .indexOf(q.id) == -1
            ) {
              if (this.selectedQuestionsIds.indexOf(q.id) != -1) {
                newfilterQuestion.push(q);
              } else if (this.selectedTags.indexOf(t.tag.id) != -1) {
                if (
                  this.selectedDifficulties.indexOf(q.questionDifficulty.id) !=
                  -1
                ) {
                  newfilterQuestion.push(q);
                }
              }
            }
          });
        }
      );
      this.filteredQuestions = newfilterQuestion;
    }
  }

  onModalOpen(question: {
    questionTags: any[];
    id: any;
    statement: any;
    course: { class: { title: any }; title: any };
    questionType: { title: any };
    questionDifficulty: { title: any };
    questionsOptions: any;
    timeDuration: any;
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
      timeDuration: question.timeDuration,
      tags: this.tagsList,
      questionsAttribute: question.questionsAttribute,
      points: question.points,
    };
    this.loadImage();

    this.detailLoading = false;
  }

  loadImage() {
    // var dbx = new Dropbox({ accessToken: environment.dropBoxToken });

    if (this.selectedQuestion.questionsAttribute?.statementImage) {
      this.helperService
        .getFileSafeUrl({
          file: this.selectedQuestion.questionsAttribute.statementImage,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.safeUrl = response.safeUrl;
        });
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
    }

    var options = this.selectedQuestion.options;
    if (options[0]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[0]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[0] = response.safeUrl;
        });
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
    }
    if (options[1]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[1]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[1] = response.safeUrl;
        });
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
    }
    if (options[2]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[2]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[2] = response.safeUrl;
        });
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
    }
    if (options[3]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[3]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[3] = response.safeUrl;
        });
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
    }
    if (options[4]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[4]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[4] = response.safeUrl;
        });
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
    }
    if (options[5]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[5]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[5] = response.safeUrl;
        });
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
    }
    if (options[6]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[6]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[6] = response.safeUrl;
        });
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
    }
    if (options[7]?.image) {
      this.helperService
        .getFileSafeUrl({
          file: options[7]?.image,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.optionsSafeUrl[7] = response.safeUrl;
        });
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
    }

    if (this.selectedQuestion.questionsAttribute?.hintFile) {
      this.helperService
        .getFileSafeUrl({
          file: this.selectedQuestion.questionsAttribute.hintFile,
        })
        .subscribe((res: any) => {
          const response = res.body;
          this.hintSafeUrl = response.safeUrl;
        });
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
    }
  }

  resetLinks() {
    this.safeUrl = '';
    this.optionsSafeUrl.forEach((element: any, index: string | number) => {
      this.optionsSafeUrl[index] = '';
    });
    this.hintSafeUrl = '';
  }

  //////////////////////////
  addCourse(name: any, event: any) {
    event.stopPropagation();
    // console.log(name);
    this.selectedTags.push(name);
    this.filterTags = this.filterTags.filter(
      (course) => course.label.trim() !== name.trim()
    );
  }

  removeCourse(index: number, cour: any, event: any) {
    event.stopPropagation();
    this.selectedTags.splice(index, 1);
    let newcour = {
      label: cour,
    };
    this.filterTags.push(newcour);

    if (this.selectedTags.length == 0) {
      this.filterTags = this.tagList;
    }
  }
  onInputChange() {
    this.dropdownOpen = true;
    // let taags: any[] = [];
    // this.selectedTags.forEach((e) => {
    //   taags.push(e.label);
    // });
    // console.log(taags);
    if (this.searchQueryOfTags !== '') {
      this.filterTags = this.tagList.filter(
        (course: { label: string }) => !this.selectedTags.includes(course.label)
      );
      // console.log(this.selectedTags, this.filterTags);

      this.filterTags = this.filterTags.filter((course: { label: string }) =>
        course.label
          .toLowerCase()
          .includes(this.searchQueryOfTags.toLowerCase())
      );
    } else {
      this.filterTags = this.tagList.filter(
        (course: { label: any }) => !this.selectedTags.includes(course.label)
      );
    }
  }
  toggleDropdown() {
    this.dropdownOpenOfDifficulty = false;
    this.dropdownOpen = !this.dropdownOpen;
  }
  onClickedOutside(event: any) {
    if (event) {
      this.dropdownOpen = false;
    } else {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  ///////////////////////////////////////////////

  //////////////////////////
  addDifficulty(name: any, event: any) {
    event.stopPropagation();
    // console.log(name);
    this.selectedDifficulty.push(name);
    this.filterDifficulty = this.filterDifficulty.filter(
      (course) => course.label.trim() !== name.trim()
    );
  }

  removeDifficulty(index: number, cour: any, event: any) {
    event.stopPropagation();
    this.selectedDifficulty.splice(index, 1);
    let newcour = {
      label: cour,
    };
    this.filterDifficulty.push(newcour);

    if (this.selectedDifficulty.length == 0) {
      this.filterDifficulty = this.difficultyList;
    }
  }
  onInputDifficulty() {
    this.dropdownOpenOfDifficulty = true;
    // let difficulty: any[] = [];

    // this.selectedDifficulty.forEach((e) => {
    //   difficulty.push(e.label);
    // });
    // console.log(difficulty, this.selectedDifficulty);

    if (this.searchQueryOfDifficulty !== '') {
      this.filterDifficulty = this.difficultyList.filter(
        (course: { label: string }) =>
          !this.selectedDifficulty.includes(course.label)
      );
      // console.log(this.selectedDifficulty, this.filterTags);

      this.filterDifficulty = this.filterDifficulty.filter(
        (course: { label: string }) =>
          course.label
            .toLowerCase()
            .includes(this.searchQueryOfDifficulty.toLowerCase())
      );
    } else {
      this.filterDifficulty = this.difficultyList.filter(
        (course: { label: any }) =>
          !this.selectedDifficulty.includes(course.label)
      );
    }
  }
  toggleDropdownOfDifficulty() {
    // console.log(this.filterDifficulty);
    this.dropdownOpen = false;
    this.dropdownOpenOfDifficulty = !this.dropdownOpenOfDifficulty;
  }

  onClickedOutsideforDiffculty(event: any) {
    if (event) {
      this.dropdownOpenOfDifficulty = false;
    } else {
      this.dropdownOpenOfDifficulty = !this.dropdownOpenOfDifficulty;
    }
  }
}
