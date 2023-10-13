import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.getUser().subscribe((res: any) => {
      this.currentUser = res;
      this.loading = false;
    });
  }
}
