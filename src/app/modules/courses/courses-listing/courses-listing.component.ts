import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course/course.service';
import { GradeService } from 'src/app/services/grade/grade.service';

@Component({
  selector: 'app-courses-listing',
  templateUrl: './courses-listing.component.html',
  styleUrls: ['./courses-listing.component.css'],
})
export class CoursesListingComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;
  gradeId: string = '';
  coursesList: any = [];
  filteredCourseList: any;
  classesList: Set<string> = new Set();
  newCourse: string = '';
  gradeList: any;
  search: any;
  selectedCourse: {
    id: string;
    class: string;
    title: string;
  } = { id: '', class: '', title: '' };
  editCourse: {
    id: string;
    class: string;
    title: string;
  } = { id: '', class: '', title: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private toastr: ToastrService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.getCourses();
    this.getGrades();
  }

  getGrades() {
    this.gradeService.getAllGrades().subscribe((res) => {
      // console.log(res);
      this.gradeList = res.body;
    });
  }

  getCourses() {
    this.gradeId = this.search = '';
    this.courseService.getAllCourses().subscribe((res) => {
      this.coursesList = res.body;
      this.filteredCourseList = this.coursesList;

      this.coursesList.forEach((element: { class: { title: string } }) => {
        this.classesList.add(element.class.title);
      });
      this.loading = false;
    });
  }

  ModalOpen(course: { id: any; class: { id: any }; title: any }) {
    this.selectedCourse = {
      id: course.id,
      class: course.class.id,
      title: course.title,
    };
    this.editCourse.class = this.selectedCourse.class;
  }

  AddCourse() {
    if (!this.gradeId) {
      this.toastr.info('Select class!');
    } else if (!this.newCourse) {
      this.toastr.info('Course Name was empty!');
    } else {
      var payload = {
        title: this.newCourse,
        classId: this.gradeId,
      };
      this.courseService.addCourse(payload).subscribe((res) => {
        this.toastr.success('Course Added Successfully!');
        let clk: any = document.getElementById('dismissAddModal');
        clk.click();
        this.newCourse = this.gradeId = '';
        this.getCourses();
      });
    }
  }

  EditCourse() {
    var error = '';
    if (this.editCourse.title == '' && this.selectedCourse.title == '') {
      error = 'Course was empty!';
    } else if (this.editCourse.class == '' && this.editCourse.class == '') {
      error = 'Class was empty!';
    } else if (
      this.editCourse.title == '' &&
      this.editCourse.class == this.selectedCourse.class
    ) {
      error = 'No changes occured!';
    }

    if (error) {
      this.toastr.info(error);
    } else {
      var payload = {
        title:
          this.editCourse.title == ''
            ? this.selectedCourse.title
            : this.editCourse.title,
        classId:
          this.editCourse.class == ''
            ? this.selectedCourse.class
            : this.editCourse.class,
      };

      // console.log('payload: ', payload);

      this.courseService
        .updateCourse(this.selectedCourse.id, payload)
        .subscribe((res) => {
          this.toastr.success('Course Update Successfully!');
          let clk: any = document.getElementById('dismissUpdateModal');
          clk.click();
          this.editCourse = { id: '', class: '', title: '' };
          this.getCourses();
        });
    }
  }

  DeleteCourse() {
    this.courseService.deleteCourse(this.selectedCourse.id).subscribe((res) => {
      this.toastr.success('Course Removed Successfully!');
      let clk: any = document.getElementById('dismissDeleteModal');
      clk.click();
      this.getCourses();
    });
  }

  resetAddCourse() {
    this.selectedCourse = { id: '', class: '', title: '' };
  }

  resetEditCourse() {
    this.editCourse = this.selectedCourse;
  }

  Filter() {
    this.filteredCourseList = [];

    if (this.gradeId) {
      this.coursesList.forEach((course: { class: { id: string } }) => {
        if (this.gradeId && this.gradeId == course.class.id) {
          this.filteredCourseList.push(course);
        }
      });
    } else {
      this.filteredCourseList = this.coursesList;
    }
  }

  Search() {
    var data: any[] = [];
    if (this.search) {
      this.Filter();
      var list = this.filteredCourseList;

      list.forEach((tag: { title: string }) => {
        if (tag.title.toLowerCase().includes(this.search.toLowerCase())) {
          data.push(tag);
        }
      });
      this.filteredCourseList = data;
    } else {
      this.Filter();
    }
  }
}
