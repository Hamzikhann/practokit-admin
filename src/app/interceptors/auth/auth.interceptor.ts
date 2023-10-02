import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if(window.navigator.onLine){
    request = request.clone({
      setHeaders: {
        // 'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        'access-token': `${this.authService.getToken()}`,
      },
    });
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 440) {
          this.authService.logOut();
          this.router.navigate(['/signin']);
          this.toastr.info(
            'Your session has expired. Please signin again.',
            'Session Expired'
          );
        } else if (error.status == 403) {
          if (request.url.endsWith('auth/login')) {
            this.toastr.error(
              'Please enter correct email and password.',
              'Incorrect Credentials'
            );
          } else {
            this.toastr.info(
              'You do not have permission to perform this task.',
              'Access Denied'
            );
            this.router.navigate(['/']);
          }
        } else if (error.status == 401) {
          this.toastr.error('Email is already Registered.');
        } else if (error.status == 405) {
          this.toastr.info(error.error.message, error.error.title);
        } else if (error.status == 406) {
          this.toastr.info('Old Password was incorrect.');
        } else {
          this.toastr.error('Something went wrong.');
          console.log(error.message);
        }
        return throwError(error);
      })
    );
    // } else {
    //   this.toastr.info("No Internet Connection");
    // }
  }
}
