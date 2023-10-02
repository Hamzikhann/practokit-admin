import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token!: string | null;
  visible: boolean = false;
  password!: string;
  confirmPassword!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }

  changePassword() {
    if (!this.password) {
      this.toastr.error('Please enter password.');
    } else if (!this.confirmPassword) {
      this.toastr.error('Please enter confirm password.');
    } else if (this.password.length < 8) {
      this.toastr.error('Use 8 characters or more for your password.');
    } else if (this.password != this.confirmPassword) {
      this.toastr.error('Password and confirm password must be same.');
    } else {
      var payload = {
        password: this.password,
        confirmPassword: this.confirmPassword,
      };
      this.authService.resetPassword(this.token, payload).subscribe((res) => {
        this.toastr.success('Your password has been reset.');
        this.router.navigate(['/login']);
      });
    }
  }
}
