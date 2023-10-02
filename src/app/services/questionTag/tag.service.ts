import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  baseUrl: string = environment.reqBaseUrl + 'tags/';
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(private http: HttpClient) {}

  getTags() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getTagsByCourseId(courseId: string) {
    return this.http.get(this.baseUrl + courseId, {
      observe: 'response',
    });
  }

  addTag(payload: { title: string; courseId: string }) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  editTag(tagId: string, payload: { title: string; courseId: string }) {
    return this.http.put(this.baseUrl + tagId, payload, {
      observe: 'response',
    });
  }

  deleteTag(tagId: string) {
    return this.http.delete(this.baseUrl + tagId, {
      observe: 'response',
    });
  }
}
