import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  currentUser: any;
  updateProfile: {
    firstName: string;
    lastName: string;
  } = { firstName: '', lastName: '' };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.updateProfile = this.currentUser;
  }

  editProfile() {
    var error = '';
    if (!this.updateProfile.firstName) {
      error = 'First Name required!';
    } else if (!this.updateProfile.lastName) {
      error = 'Last Name required!';
    }

    if (error) {
      this.toastr.info(error);
    } else {
      var payload = {
        firstName: this.updateProfile.firstName,
        lastName: this.updateProfile.lastName,
      };

      this.userService.updateProfile(payload).subscribe((res: any) => {
        this.resetUpdateProfile();
        this.toastr.success('Profile Updated successfully');
        this.authService.storeUserData(null, res.body['user']);
        this.authService.setUser(res.body['user']);
        this.location.back();
      });
    }
  }

  resetUpdateProfile() {
    this.updateProfile = { firstName: '', lastName: '' };
  }
}
