import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  baseUrl: string = environment.reqBaseUrl + 'classes/';
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(private http: HttpClient) {}

  getAllGrades() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getGradesWithCourses() {
    return this.http.get(this.baseUrl + 'courses', {
      observe: 'response',
    });
  }

  addGrade(payload: { title: string }) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  updateGrade(gradeId: string, payload: { title: string }) {
    return this.http.put(this.baseUrl + gradeId, payload, {
      observe: 'response',
    });
  }

  deleteGrade(gradeId: string) {
    return this.http.delete(this.baseUrl + gradeId, {
      observe: 'response',
    });
  }
}
