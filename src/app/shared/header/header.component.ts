import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loading: boolean = false;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.getUser().subscribe((res: any) => {
      // let userRes: any = JSON.parse(res);
      // console.log(userRes);
      this.user = res;
      // console.log(this.user.role);
      this.loading = false;
    });
  }

  logOut() {
    this.authService.logOut();
  }
}
