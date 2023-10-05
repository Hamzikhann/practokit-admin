import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from 'src/app/services/submission/submission.service';
import { environment } from '../../../../../environments/environment';

// import { Dropbox } from 'dropbox';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HelperService } from 'src/app/services/helper/helper.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  loading: boolean = false;
  userId: string | null = '';
  quizId: string | null = '';
  submission: any;
  response: any;
  safeUrl: any;
  optionSafeUrl: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private sanitizer: DomSanitizer,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.quizId = this.activatedRoute.snapshot.paramMap.get('quizId');
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    // console.log(this.quizId, this.userId);
    // var dbx = new Dropbox({ accessToken: environment.dropBoxToken });

    this.submissionService
      .getSubmissionDetail(this.quizId, this.userId)
      .subscribe((res) => {
        this.submission = res.body;
        this.response = JSON.parse(
          this.submission.quizSubmissionResponse.response
        );

        // console.log(this.response);
        this.response.forEach(async (question: any) => {
          // console.log(question);
          if (question?.questionsAttribute?.statementImage) {
            // console.log(question?.questionsAttribute?.statementImage);
            this.helperService
              .getFileSafeUrl({
                file: question?.questionsAttribute?.statementImage,
              })
              .subscribe((e: any) => {
                const response = e.body;
                question.questionsAttribute.imageSrc = response.safeUrl;
              });
          }
          if (question?.questionType.title == 'MCQ') {
            if (question?.questionsOptions) {
              question.questionsOptions.forEach(
                async (option: { image: any; imageSrc: any }, index: any) => {
                  if (option?.image) {
                    this.helperService
                      .getFileSafeUrl({ file: option?.image })
                      .subscribe((e: any) => {
                        const response = e.body;
                        option.imageSrc = response.safeUrl;
                      });
                  }
                }
              );
            }
          }
        });
        this.loading = false;
      });
  }
}
