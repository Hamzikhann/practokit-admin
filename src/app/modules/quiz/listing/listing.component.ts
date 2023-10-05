import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { CourseService } from 'src/app/services/course/course.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { QuizService } from 'src/app/services/quiz/quiz.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;
  gradeId: string = '';
  gradeList: any = [];
  courseId: string = '';
  coursesList: any = [];
  assessmentList: any = [];
  filteredAssessmentList: any = [];

  selectedAssessment: {
    id: string;
    course: string;
    class: string;
    title: string;
  } = { id: '', course: '', class: '', title: '' };

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService,
    private gradeService: GradeService,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.getGrades();
    this.getAssessments();
  }

  getGrades() {
    this.gradeService.getAllGrades().subscribe((res) => {
      // console.log(res.body);
      this.gradeList = res.body;
    });
  }

  getAssessments() {
    // console.log(this.currentUser);

    // const payload = {
    //   role: this.currentUser.role.title,
    //   userID: this.currentUser.createdBy,
    // };
    this.quizService.getAllAssessments().subscribe((res: any) => {
      // console.log(res.body);
      res.body.forEach(
        (assessment: {
          questionsPool: string;
          createdAt: moment.MomentInput;
          assignTos: any[];
          uniqueAssignTos: Set<unknown>;
        }) => {
          assessment.questionsPool = JSON.parse(assessment.questionsPool);
          assessment.createdAt = moment(assessment.createdAt).format(
            'MMM Do YYYY, h:mm a'
          );

          var list = assessment.assignTos.map(
            (e: { userId: any; quizId: any }) => {
              return e.userId + e.quizId;
            }
          );
          const assignSet = new Set();
          list.forEach((element: unknown) => {
            assignSet.add(element);
          });
          assessment.uniqueAssignTos = assignSet;
        }
      );
      this.filteredAssessmentList = this.assessmentList = res.body;
      this.loading = false;
    });
  }

  getCourses(gradeId?: any) {
    this.courseService
      .getCourses(gradeId ? gradeId : this.gradeId)
      .subscribe((res) => {
        this.coursesList = res.body;
      });
  }

  modalOpen(assessment: {
    id: any;
    course: { title: any; class: { title: any } };
    title: any;
  }) {
    this.selectedAssessment = {
      id: assessment.id,
      course: assessment.course.title,
      class: assessment.course.class.title,
      title: assessment.title,
    };
  }

  Filter() {
    this.filteredAssessmentList = this.assessmentList;
    // console.log(this.filteredAssessmentList);
    if (this.gradeId) {
      this.filteredAssessmentList = [];
      this.assessmentList.forEach(
        (assessment: { course: { class: { id: string }; id: string } }) => {
          if (this.courseId) {
            if (
              assessment.course.class.id == this.gradeId &&
              assessment.course.id == this.courseId
            ) {
              this.filteredAssessmentList.push(assessment);
            }
          } else {
            if (assessment.course.class.id == this.gradeId) {
              this.filteredAssessmentList.push(assessment);
            }
          }
        }
      );
    }
  }

  deleteAssessment() {
    this.loading = true;
    this.quizService
      .deleteAssessment(this.selectedAssessment.id)
      .subscribe((res) => {
        this.toastr.success('Assessment Deleted Successfully!');
        let clk: any = document.getElementById('dismissDeleteModal');
        clk.click();
        this.getAssessments();
        this.loading = false;
      });
  }
}
