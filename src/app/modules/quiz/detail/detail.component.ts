import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { environment } from '../../../../environments/environment';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/services/helper/helper.service';

// import { Dropbox } from 'dropbox';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  selectedStudents: any[] = [];
  filterStudents: any[] = [];
  dropdownOpen = false;
  searchQueryOfStudents: string = '';

  //////////////////////////////////////////

  loading: boolean = false;
  currentUser: any;
  modalLoading: boolean = false;
  detailLoading: boolean = false;
  quizId: string | null = '';
  quiz: any;
  questionsType!: Set<string>;
  formatedTotalTime: string = '';
  totalMarks: number = 0;
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
  studentsList: any = [];
  alreadyAssignedStudentList: any = [];
  assignToList: any = [];
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private quizService: QuizService,
    private userService: UserService,
    private helperService: HelperService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.detailLoading = true;
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.quizId = this.activatedRoute.snapshot.paramMap.get('quizId');
    this.getQuizDetail();
  }

  getQuizDetail() {
    this.quizService.getQuizDetail(this.quizId).subscribe((res) => {
      // console.log(res.body);
      this.quiz = res.body;
      console.log(this.quiz);
      this.questionsType = new Set();
      var totalTime = 0;

      this.quiz.questionsPool.forEach(
        (q: {
          points: number;
          duration: number;
          questionType: { title: string };
          timeDuration: string;
        }) => {
          this.totalMarks += q.points;
          totalTime += q.duration;
          this.questionsType.add(q.questionType.title);
          var min =
            Math.floor(q.duration / 60) === 0
              ? ''
              : Math.floor(q.duration / 60) + ' min ';
          q.timeDuration = min + Math.floor(q.duration % 60) + ' sec';
        }
      );
      this.formatedTotalTime =
        Math.floor(totalTime / 60) +
        ' min ' +
        Math.floor(totalTime % 60) +
        ' sec';

      this.loading = false;
      this.detailLoading = false;
    });
  }

  onModalOpen(question: {
    questionTags: any[];
    id: any;
    statement: any;
    questionType: { title: any };
    questionDifficulty: { title: any };
    questionsOptions: any;
    duration: number;
    questionsAttribute: any;
    points: any;
  }) {
    this.resetLinks();
    this.detailLoading = true;
    var tagsList = question.questionTags.map((e: { tag: { title: any } }) => {
      return e.tag.title;
    });

    this.selectedQuestion = {
      id: question.id,
      statement: question.statement,
      class: this.quiz.classTitle,
      course: this.quiz.courseTitle,
      type: question.questionType.title,
      difficulty: question.questionDifficulty.title,
      options: question.questionsOptions,
      timeDuration:
        parseInt((question.duration / 60).toString()) +
        ' min ' +
        parseInt((question.duration % 60).toString()) +
        ' sec',
      tags: tagsList,
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

  getStudentsForAssessment() {
    this.modalLoading = true;
    this.studentsList = [];
    this.userService
      .getUsersForAssessments(this.quizId)
      .subscribe((res: any) => {
        res.body.notAssigned.forEach(
          (user: { firstName: string; lastName: string; id: any }) => {
            this.studentsList.push({
              label: user.firstName + ' ' + user.lastName,
              value: user.id,
            });
            // console.log(this.studentsList);
            this.filterStudents = this.studentsList;
          }
        );
        this.alreadyAssignedStudentList = res.body.assigned;
        this.modalLoading = false;
      });
  }

  assignToStudents() {
    if (!this.selectedStudents.length) {
      this.toastr.error('Select at least ONE Student!');
    } else {
      // console.log(this.selectedStudents);

      this.selectedStudents.map((e) => {
        this.assignToList.push(e.value);
      });
      // console.log(this.assignToList);
      var payload = {
        studentList: this.assignToList,
      };

      this.quizService
        .assignAssessment(this.quizId, payload)
        .subscribe((res) => {
          this.toastr.success(`Assessment Assigned to Students! ${res}`);
          let clk: any = document.getElementById('dismissAssignModal');
          clk.click();
          this.resetAssignToList();
        });
    }
  }

  removeStudent(
    student: { firstName: string; lastName: string; id: any },
    i: any
  ) {
    this.studentsList.push({
      label: student.firstName + ' ' + student.lastName,
      value: student.id,
    });
    this.alreadyAssignedStudentList.splice(i, 1);
  }

  viewResponse() {
    if (this.quiz.quizSubmissions.length == 0) {
      this.toastr.info('No response Found!');
    } else {
      this.router.navigate([
        'assessments/detail/' + this.quizId + '/responses',
      ]);
    }
  }

  resetAssignToList() {
    this.assignToList = [];
  }

  resetLinks() {
    this.safeUrl = '';
    this.optionsSafeUrl.forEach((element: any, index: string | number) => {
      this.optionsSafeUrl[index] = '';
    });
    this.hintSafeUrl = '';
  }

  //////////////////////////
  addCourse(name: any, value: any, event: any) {
    event.stopPropagation();

    // console.log(name);
    let newstu = {
      label: name,
      value: value,
    };

    this.selectedStudents.push(newstu);
    this.filterStudents = this.filterStudents.filter(
      (course) => course.label.trim() !== name.trim()
    );
  }

  removeCourse(index: number, cour: any, event: any) {
    event.stopPropagation();

    this.selectedStudents.splice(index, 1);
    let newcour = {
      title: cour,
    };
    this.filterStudents.push(cour);

    if (this.selectedStudents.length == 0) {
      this.filterStudents = this.studentsList;
    }
  }
  onInputChange() {
    this.dropdownOpen = true;
    if (this.searchQueryOfStudents !== '') {
      this.filterStudents = this.studentsList.filter(
        (course: { label: string }) =>
          !this.selectedStudents.includes(course.label)
      );
      // console.log(this.selectedTags, this.filterTags);

      this.filterStudents = this.filterStudents.filter(
        (course: { label: string }) =>
          course.label
            .toLowerCase()
            .includes(this.searchQueryOfStudents.toLowerCase())
      );
    } else {
      this.filterStudents = this.studentsList.filter(
        (course: { label: any }) =>
          !this.selectedStudents.includes(course.label)
      );
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  onClickedOutside(event: any) {
    console.log(event);
    if (event) {
      this.dropdownOpen = false;
    } else {
      console.log('hi');
      this.dropdownOpen = !this.dropdownOpen;
    }
  }
}
