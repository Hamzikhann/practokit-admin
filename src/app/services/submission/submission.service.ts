import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  baseUrl: string = environment.reqBaseUrl + 'submissions/';

  constructor(private http: HttpClient) {}

  getSubmissionDetail(quizId: string | null, userId: string | null) {
    return this.http.get(this.baseUrl + quizId + '/' + userId, {
      observe: 'response',
    });
  }
}
