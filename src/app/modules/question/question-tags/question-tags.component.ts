import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course/course.service';
import { GradeService } from 'src/app/services/grade/grade.service';
// import { TagService } from 'src/app/services/questionTag/tag.service';
import { TagService } from 'src/app/services/questionTag/tag.service';
@Component({
  selector: 'app-question-tags',
  templateUrl: './question-tags.component.html',
  styleUrls: ['./question-tags.component.css'],
})
export class QuestionTagsComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;
  tagList: any;
  filteredTagList: any;
  gradeList: any;
  gradeId: string = '';
  CoursesList: any;
  courseId: string = '';
  search: string = '';
  selectedTag: {
    id: string;
    title: string;
    course: string;
    courseId: string;
    class: string;
    classId: string;
  } = { id: '', title: '', course: '', courseId: '', class: '', classId: '' };
  addTag: {
    title: string;
    gradeId: string;
    courseId: string;
  } = { title: '', gradeId: '', courseId: '' };
  updateTag: {
    title: string;
    classId: string;
    courseId: string;
  } = { title: '', courseId: '', classId: '' };

  constructor(
    private tagService: TagService,
    private toastr: ToastrService,
    private gradeService: GradeService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.getTags();
  }

  getTags() {
    this.tagService.getTags().subscribe((res: { body: any }) => {
      this.tagList = res.body;

      this.filteredTagList = this.tagList;
      this.sort();
      this.getGrades();
    });
  }

  getGrades() {
    this.gradeService.getAllGrades().subscribe((res) => {
      this.gradeList = res.body;
      this.loading = false;
    });
  }

  getCourses(gradeId?: any) {
    this.courseService
      .getCourses(gradeId ? gradeId : this.gradeId)
      .subscribe((res) => {
        this.CoursesList = res.body;
        if (this.CoursesList.length) {
          this.updateTag.courseId = this.CoursesList[0].id;
        } else {
          this.updateTag.courseId = '';
        }
      });
  }

  Filter() {
    if (this.courseId || this.gradeId) {
      this.filteredTagList = [];
      this.tagList.forEach(
        (tag: { course: { id: string; class: { id: string } } }) => {
          if (this.courseId) {
            if (
              this.courseId == tag.course.id &&
              this.gradeId == tag.course.class.id
            ) {
              this.filteredTagList.push(tag);
            }
          } else if (this.gradeId && this.gradeId == tag.course.class.id) {
            this.filteredTagList.push(tag);
          }
        }
      );
    } else {
      this.filteredTagList = this.tagList;
      this.sort();
    }
  }

  ResetFilter() {
    this.gradeId = '';
    this.courseId = '';
    this.filteredTagList = this.tagList;
  }

  ModalOpen(tag: {
    id: string;
    title: any;
    course: { title: any; id: any; class: { title: any; id: any } };
  }) {
    if (this.selectedTag.id != tag.id) {
      this.selectedTag = {
        id: tag.id,
        title: tag.title,
        course: tag.course.title,
        courseId: tag.course.id,
        class: tag.course.class.title,
        classId: tag.course.class.id,
      };

      this.resetUpdateTag();
    }
  }

  AddTag() {
    if (!this.addTag.gradeId) {
      this.toastr.info('Select Class!');
    } else if (!this.addTag.courseId) {
      this.toastr.info('Select Course!');
    } else if (!this.addTag.title) {
      this.toastr.info('Topic or Tag Name was empty!');
    } else {
      var payload = {
        title: this.addTag.title,
        courseId: this.addTag.courseId,
      };
      this.tagService.addTag(payload).subscribe((res: any) => {
        this.toastr.success('Topic or Tag added Successfully!');
        let clk: any = document.getElementById('dismissAddModal');
        clk.click();
        this.resetAddTag();
        this.getTags();
      });
    }
  }

  EditTag() {
    var error = '';
    if (this.updateTag.title == '') {
      error = 'Topic or Tag was empty!';
    } else if (this.updateTag.title == this.selectedTag.title) {
      error = 'No changes occured!';
    }

    if (error) {
      this.toastr.info(error);
    } else {
      var payload = {
        title: this.updateTag.title,
        courseId: this.updateTag.courseId,
      };
      this.tagService
        .editTag(this.selectedTag.id, payload)
        .subscribe((res: any) => {
          this.toastr.success('Topic or Tag Update Successfully!');
          let clk: any = document.getElementById('dismissUpdateModal');
          clk.click();
          this.resetUpdateTag();
          this.getTags();
        });
    }
  }

  DeleteTag() {
    this.tagService.deleteTag(this.selectedTag.id).subscribe((res: any) => {
      this.toastr.success('Tag Removed Successfully!');
      this.getTags();
    });
  }

  resetAddTag() {
    this.addTag = { title: '', gradeId: '', courseId: '' };
  }

  resetUpdateTag() {
    this.updateTag = {
      title: this.selectedTag.title,
      classId: this.selectedTag.classId,
      courseId: this.selectedTag.courseId,
    };
  }

  Search() {
    var data: any[] = [];
    if (this.search) {
      this.Filter();
      var list = this.filteredTagList;

      list.forEach((tag: { title: string }) => {
        if (tag.title.toLowerCase().includes(this.search.toLowerCase())) {
          data.push(tag);
        }
      });
      this.filteredTagList = data;
    } else {
      this.Filter();
      this.sort();
    }
  }

  sort() {
    this.filteredTagList.sort(function (
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
