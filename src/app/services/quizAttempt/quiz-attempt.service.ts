import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizAttemptService {
  baseUrl: string = environment.reqBaseUrl + 'submissions/';

  private quizSource: BehaviorSubject<any>;
  currentQuiz: any;

  constructor(private http: HttpClient) {
    this.quizSource = new BehaviorSubject<any>(null);
    this.currentQuiz = this.quizSource.asObservable();
  }

  changeQuiz(quiz: any) {
    this.quizSource.next(quiz);
  }

  SubmitQuiz(paylaod: { quizId: any; response: string }) {
    return this.http.post(this.baseUrl, paylaod, {
      observe: 'response',
    });
  }
}
