import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.reqBaseUrl + 'users/';

  constructor(private http: HttpClient) {}

  addUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    courses: any;
  }) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  getUsers() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getUsersForAssessments(assessmentId: string | null) {
    return this.http.get(this.baseUrl + 'assessment/' + assessmentId, {
      observe: 'response',
    });
  }

  updateUserRole(userId: string, payload: { role: any; courses: any }) {
    return this.http.put(this.baseUrl + userId, payload, {
      observe: 'response',
    });
  }

  updateProfile(payload: { firstName: string; lastName: string }) {
    return this.http.put(this.baseUrl + 'profile/edit', payload, {
      observe: 'response',
    });
  }

  resetPassword(payload: {
    oldPassword: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.http.put(this.baseUrl + 'reset/password', payload, {
      observe: 'response',
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(this.baseUrl + userId, {
      observe: 'response',
    });
  }
}
