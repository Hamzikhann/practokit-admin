import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ComplaintsService } from 'src/app/services/complaints/complaints.service';
import * as moment from 'moment';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css'],
})
export class ComplaintsComponent implements OnInit {
  loading: boolean = true;
  complaintsList: any;
  status: string = '';
  problemStatus: any = [
    {
      title: 'Not Fixed',
      value: 'not-fixed',
    },
    {
      title: 'In Progress',
      value: 'in-progress',
    },
    {
      title: 'Fixed',
      value: 'fixed',
    },
  ];

  constructor(
    private complaintsService: ComplaintsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getAlCompaints();
  }

  getAlCompaints() {
    this.complaintsService.getAllComplaints().subscribe((res) => {
      this.complaintsList = res.body;
      this.complaintsList.forEach(
        (complaint: { createdAt: moment.MomentInput }) => {
          complaint.createdAt = moment(complaint.createdAt).format(
            'MMM Do YYYY, h:mm a'
          );
        }
      );
      this.loading = false;
    });
  }

  changeStatus(complaintId: any, status: any) {
    this.complaintsService
      .updateStatus(complaintId, { status: status })
      .subscribe((res) => {
        this.toastr.success('Problem Status Successfully Updated');
        this.status = '';
        this.getAlCompaints();
      });
  }
}
