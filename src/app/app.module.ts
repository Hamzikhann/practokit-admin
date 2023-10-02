import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
// import { NgSelectizeModule } from 'ng-selectize';

/** Project Files Imports. */
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { SigninComponent } from './components/signin/signin.component';

/** Library Imports. */
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockCutCopyDirective } from './directives/blockCutCopy/block-cut-copy.directive';
import { PhoneNoDirective } from './directives/phoneNo/phone-no.directive';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset/password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/module-routing.module').then((m) => m.ModuleRouting),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    BlockCutCopyDirective,
    PhoneNoDirective,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DataTablesModule,

    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [NgbModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
