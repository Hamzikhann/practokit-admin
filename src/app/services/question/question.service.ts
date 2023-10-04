import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  baseUrl: string = environment.reqBaseUrl + 'questions/';
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;

  constructor(private http: HttpClient) {}

  addQuestion(payload: any) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  editQuestion(questionId: string | null, payload: any) {
    return this.http.put(this.baseUrl + questionId, payload, {
      observe: 'response',
    });
  }

  getAllQuestions() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getAllQuestionsOfCourse(courseId: string) {
    return this.http.get(this.baseUrl + courseId, {
      observe: 'response',
    });
  }

  getQuestionsCountByDiffficulty() {
    return this.http.get(this.baseUrl + 'all/count', {
      observe: 'response',
    });
  }

  getQuestionsById(questionId: string | null) {
    return this.http.get(this.baseUrl + 'find/' + questionId, {
      observe: 'response',
    });
  }

  deleteQuestion(questionId: string) {
    return this.http.delete(this.baseUrl + questionId, {
      observe: 'response',
    });
  }

  getFileSafeUrl(payload: any) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }
}
