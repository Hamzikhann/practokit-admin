import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GradeService } from 'src/app/services/grade/grade.service';

@Component({
  selector: 'app-class-listing',
  templateUrl: './class-listing.component.html',
  styleUrls: ['./class-listing.component.css'],
})
export class ClassListingComponent implements OnInit {
  loading: boolean = true;
  disableButton: boolean = false;
  currentUser: any;
  gradeList: any = [];
  newGrade: string = '';
  selectedGrade: {
    id: string;
    title: string;
  } = { id: '', title: '' };

  constructor(
    private gradeService: GradeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    // console.log(this.currentUser);
    this.getGradeListing();
  }

  getGradeListing() {
    this.gradeService.getAllGrades().subscribe((res) => {
      this.gradeList = res.body;
      this.sort();
    });
  }

  ModalOpen(grade: { id: any; title: any }) {
    this.selectedGrade = { id: grade.id, title: grade.title };
  }

  AddGrade() {
    if (this.newGrade) {
      this.disableButton = true;
      var payload = {
        title: this.newGrade,
      };
      this.gradeService.addGrade(payload).subscribe((res) => {
        this.toastr.success('Class Added Successfully!');
        let clk: any = document.getElementById('dismissAddModal');
        clk.click();
        this.disableButton = false;
        this.newGrade = '';
        this.getGradeListing();
      });
      this.disableButton = false;
    } else {
      this.toastr.info('Class Name was empty!');
    }
  }

  EditGrade() {
    if (this.selectedGrade.title) {
      var payload = {
        title: this.selectedGrade.title,
      };
      this.gradeService
        .updateGrade(this.selectedGrade.id, payload)
        .subscribe((res) => {
          this.toastr.success('Class Update Successfully!');
          let clk: any = document.getElementById('dismissEditModal');

          clk.click();
          this.getGradeListing();
        });
    } else {
      this.toastr.info('Class Title was empty!');
    }
  }

  DeleteGrade() {
    this.gradeService.deleteGrade(this.selectedGrade.id).subscribe((res) => {
      this.toastr.success('Class Removed Successfully!');
      let clk: any = document.getElementById('dismissDeleteModal');
      clk.click();
      this.getGradeListing();
    });
  }

  sort() {
    this.gradeList.sort(function (a: { title: number }, b: { title: number }) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    this.loading = false;
  }
}
