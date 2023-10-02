import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from 'src/app/services/submission/submission.service';
import { environment } from '../../../../../environments/environment';

// import { Dropbox } from 'dropbox';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private sanitizer: DomSanitizer
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

        this.response.forEach(
          async (question: {
            questionsAttribute: { statementImage: any };
            statementImage: SafeUrl;
            questionType: { title: string };
            questionsOptions: any[];
          }) => {
            // if (question?.questionsAttribute?.statementImage) {
            //   var res: any = await Promise.all([
            //     dbx
            //       .filesDownload({
            //         path: question.questionsAttribute.statementImage,
            //       })
            //       .then((res: any) => {
            //         question.statementImage =
            //           this.sanitizer.bypassSecurityTrustUrl(
            //             window.URL.createObjectURL(res.result.fileBlob)
            //           );
            //       }),
            //   ]);
            // }
            // if (question?.questionType.title == 'MCQ') {
            //   if (question?.questionsOptions) {
            //     question.questionsOptions.forEach(async (option) => {
            //       if (option?.image) {
            //         var res: any = await Promise.all([
            //           dbx
            //             .filesDownload({
            //               path: option.image,
            //             })
            //             .then((res: any) => {
            //               option.imageUrl =
            //                 this.sanitizer.bypassSecurityTrustUrl(
            //                   window.URL.createObjectURL(res.result.fileBlob)
            //                 );
            //             }),
            //         ]);
            //       }
            //     });
            //   }
            // }
          }
        );
        this.loading = false;
      });
  }
}
