import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz/quiz.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  loading: boolean = false;
  quizId: string | null = '';
  quiz: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.quizId = this.activatedRoute.snapshot.paramMap.get('quizId');
    this.quizService.getQuizDetail(this.quizId).subscribe((res: any) => {
      this.quiz = res.body;

      this.quiz.quizSubmissions.forEach((element: any) => {
        element.createdAt = moment(element.createdAt).format(
          'MMM Do YYYY, h:mm a'
        );
        element.timeSpend =
          parseInt((element.timeSpend / 60).toString()) +
          ' min ' +
          parseInt((element.timeSpend % 60).toString()) +
          ' sec';
      });

      this.loading = false;
    });
  }
}
