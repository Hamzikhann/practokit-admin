import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course/course.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

import { NgxCaptureService } from 'ngx-capture';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  exportAsConfig: ExportAsConfig = {
    elementIdOrContent: 'screen',
    type: 'png',
  };

  constructor(
    private courseService: CourseService,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private questionService: QuestionService,

    private captureService: NgxCaptureService,
    private exportAsService: ExportAsService,
    private sanitizer: DomSanitizer
  ) {}

  loading: boolean = false;
  questionstatsLoading: boolean = false;
  quizStatsLoading: boolean = false;
  QuestionsCountLoading: boolean = false;

  currentUser: any;
  allQuestionStats: any;
  allQuizStats: any;
  questionStats: any;
  quizStats: any;
  totalCourses: any;
  totalTags: any;
  totalUsers: any;
  editorsList: any = [];
  teachersList: any = [];

  veryEasy: any = 0;
  easy: any = 0;
  medium: any = 0;
  hard: any = 0;
  veryHard: any = 0;

  editorId: string = '';
  teacherId: string = '';

  img = '';

  @ViewChild('screen', { static: true }) screen: any;
  saveImage(img: string) {
    this.img = img;

    // console.log(this.img);
  }

  ngOnInit(): void {
    this.loading = true;
    this.questionstatsLoading = true;
    this.quizStatsLoading = true;

    let user: any = localStorage.getItem('user');

    this.currentUser = JSON.parse(user);
    // console.log(this.currentUser);
    this.getDashboard();
  }

  getDashboard() {
    this.dashboardService.getDashboard().subscribe((res: any) => {
      // console.log(res.body['editorsAndTeachers']);
      if (res.body['editorsAndTeachers']) {
        res.body['editorsAndTeachers'].forEach(
          (user: { role: { title: string } }) => {
            if (user.role.title == 'Teacher') {
              this.teachersList.push(user);
            } else if (user.role.title == 'Editor') {
              this.editorsList.push(user);
            }
          }
        );
        // console.log(this.teachersList);
      }

      this.totalCourses = res.body['count'].courses;
      this.totalTags = res.body['count'].tags;
      this.totalUsers = res.body['count'].users;

      this.allQuestionStats = res.body['count']['questions'];
      this.setQuestionStats(this.allQuestionStats);

      this.allQuizStats = res.body['count']['quizzes'];
      this.setQuizStats(this.allQuizStats);

      this.loading = false;
    });
  }

  setQuestionStats(obj: { today: any; yesterday: any; week: any; month: any }) {
    this.questionStats = {
      today: obj.today,
      yesterday: obj.yesterday,
      week: obj.week,
      month: obj.month,
    };
    this.questionstatsLoading = false;
  }

  setQuizStats(obj: { today: any; yesterday: any; week: any; month: any }) {
    this.quizStats = {
      today: obj.today,
      yesterday: obj.yesterday,
      week: obj.week,
      month: obj.month,
    };
    this.quizStatsLoading = false;
  }

  GetEditorStats() {
    if (this.editorId != '') {
      this.questionstatsLoading = true;
      this.dashboardService
        .getEditorDashboard(this.editorId)
        .subscribe((res: any) => {
          this.setQuestionStats(res.body['count']['questions']);
        });
    } else {
      this.setQuestionStats(this.allQuestionStats);
    }
  }

  GetTeacherStats() {
    if (this.teacherId != '') {
      this.quizStatsLoading = true;
      this.dashboardService
        .getTeacherDashboard(this.teacherId)
        .subscribe((res: any) => {
          this.setQuizStats(res.body['count']['quizzes']);
        });
    } else {
      this.setQuizStats(this.allQuizStats);
    }
  }

  getQuestionsCountByDifficulty() {
    this.QuestionsCountLoading = true;

    this.questionService
      .getQuestionsCountByDiffficulty()
      .subscribe((res: any) => {
        this.veryEasy = res.body['veryEasy'];
        this.easy = res.body['easy'];
        this.medium = res.body['medium'];
        this.hard = res.body['hard'];
        this.veryHard = res.body['veryHard'];

        this.QuestionsCountLoading = false;
      });
  }

  // export() {
  //   // download the file using old school javascript method
  //   this.exportAsService.save(this.exportAsConfig, 'My File Name' + Date.now().toString()).subscribe(() => {
  //     // save started
  //   });
  //   // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //   // this.exportAsService.get(this.exportAsConfig).subscribe(content => {
  //   //   console.log(content);
  //   // });
  // }

  // ===========================================================================
  // imgBase64: any = '';

  // @ViewChild('screen', { static: true }) screen: any;
  // capture() {
  //   this.captureService
  //     .getImage(this.screen.nativeElement, true)
  //     .subscribe((img) => {
  //       this.imgBase64 = img;

  //       console.log(this.imgBase64)
  //       const file = this.DataURIToBlob(this.imgBase64);

  //       const safeUrl = this.sanitizer.bypassSecurityTrustUrl(
  //         window.URL.createObjectURL(file)
  //       );
  // console.log(safeUrl);
  //     });
  // }

  // DataURIToBlob(dataURI: string) {
  //   const splitDataURI = dataURI.split(',');
  //   const byteString =
  //     splitDataURI[0].indexOf('base64') >= 0
  //       ? atob(splitDataURI[1])
  //       : decodeURI(splitDataURI[1]);
  //   const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  //   const ia = new Uint8Array(byteString.length);
  //   for (let i = 0; i < byteString.length; i++)
  //     ia[i] = byteString.charCodeAt(i);

  //   return new Blob([ia], { type: mimeString });
  // }
}
