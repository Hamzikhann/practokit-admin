import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

// import { NgSelectizeModule } from 'ng-selectize';

import { UsersRoutingModule } from './users-routing.module';
import { UserListingComponent } from './user-listing/user-listing.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    UserListingComponent,
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
  ],
  imports: [CommonModule, UsersRoutingModule, FormsModule, ClickOutsideModule],
})
export class UsersModule {}
