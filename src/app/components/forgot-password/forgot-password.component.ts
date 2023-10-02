import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  email!: string;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  recoverPassword() {
    if (!this.email) {
      this.toastr.error('Please enter email.');
    } else {
      var payload = {
        email: this.email.trim(),
      };
      this.authService.forgotPassword(payload).subscribe((res) => {
        this.toastr.success('A recovery link has been sent to your email.');
        this.router.navigate(['/signin']);
      });
    }
  }
}
