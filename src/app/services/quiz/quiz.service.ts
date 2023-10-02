import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  baseUrl: string = environment.reqBaseUrl + 'quizzes/';

  constructor(private http: HttpClient) {}

  GenerateQuiz(payload: {
    title: string | null;
    tagsIdList: any[];
    courseId: string;
    questionsIds: any;
  }) {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
    });
  }

  UpdateQuiz(
    quizId: string | null,
    payload: { title: string | null; tagsIdList: any[]; questionsIds: any }
  ) {
    return this.http.put(this.baseUrl + quizId, payload, {
      observe: 'response',
    });
  }

  assignAssessment(quizId: string | null, payload: { studentList: any }) {
    return this.http.post(this.baseUrl + 'assign/' + quizId, payload, {
      observe: 'response',
    });
  }

  getAllAssessments() {
    return this.http.get(this.baseUrl, {
      observe: 'response',
    });
  }

  getQuizDetail(quizId: string | null) {
    return this.http.get(this.baseUrl + quizId, {
      observe: 'response',
    });
  }

  reAttemptWrongQuestions(quizId: string) {
    return this.http.get(this.baseUrl + quizId + '/wrong/Questions', {
      observe: 'response',
    });
  }

  getQuizResult(quizId: string) {
    return this.http.get(this.baseUrl + quizId + '/result', {
      observe: 'response',
    });
  }

  deleteAssessment(quizId: string) {
    return this.http.delete(this.baseUrl + quizId, {
      observe: 'response',
    });
  }
}
