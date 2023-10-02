import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  baseUrl: string = environment.reqBaseUrl + 'courses/';
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(private http: HttpClient) {}

  getAllCourses() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getCourses(gradeId: string) {
    return this.http.get(this.baseUrl + gradeId, {
      observe: 'response',
    });
  }

  addCourse(payload: { title: string; classId: string }) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  updateCourse(courseId: string, payload: { title: string; classId: string }) {
    return this.http.put(this.baseUrl + courseId, payload, {
      observe: 'response',
    });
  }

  deleteCourse(courseId: string) {
    return this.http.delete(this.baseUrl + courseId, {
      observe: 'response',
    });
  }
}
