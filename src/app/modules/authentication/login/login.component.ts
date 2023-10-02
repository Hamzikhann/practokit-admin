import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  Login() {
    if (this.email.trim() == '') {
      this.toastr.error('Please enter your email');
    } else if (this.password.trim() == '') {
      this.toastr.error('Please enter your password');
    } else {
      var payload = {
        email: this.email,
        password: this.password,
      };
      this.authService.login(payload).subscribe((res: any) => {
        this.toastr.success('Login Successful.');
        this.authService.storeUserData(res.body['token'], res.body['user']);
        this.authService.setUser(res.body['user']);
        this.router.navigate(['/']);
      });
    }
  }
}
