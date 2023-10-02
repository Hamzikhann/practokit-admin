import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  updatePassword() {
    var error = '';
    if (!this.oldPassword) {
      error = 'Please Enter Old Password.';
    } else if (!this.newPassword) {
      error = 'Please Enter New Password.';
    } else if (this.newPassword == this.oldPassword) {
      error = 'New and Old Password cannot be same.';
    } else if (this.newPassword.length < 8) {
      error = 'Password must be 8 characters long.';
    } else if (!this.confirmPassword) {
      error = 'Confirm Password Field is required.';
    } else if (this.newPassword != this.confirmPassword) {
      error = 'New and Confirm Password are not same.';
    }

    if (error) {
      this.toastr.info(error);
    } else {
      var payload = {
        oldPassword: this.oldPassword,
        password: this.newPassword,
        password_confirmation: this.confirmPassword,
      };

      this.userService.resetPassword(payload).subscribe((res) => {
        this.toastr.success('Password Updated successfully');
        this.resetAll();
        this.location.back();
      });
    }
  }

  resetAll() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
