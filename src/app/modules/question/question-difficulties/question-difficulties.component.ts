import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DifficultyService } from 'src/app/services/difficulty/difficulty.service';

@Component({
  selector: 'app-question-difficulties',
  templateUrl: './question-difficulties.component.html',
  styleUrls: ['./question-difficulties.component.css'],
})
export class QuestionDifficultiesComponent implements OnInit {
  loading: boolean = true;
  difficultyList: any;
  newDifficulty: string = '';
  selectedDifficulty: {
    id: string;
    title: string;
  } = { id: '', title: '' };

  constructor(
    private difficultyService: DifficultyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getQuestionDifficulties();
  }

  getQuestionDifficulties() {
    this.difficultyService.getAllDifficulties().subscribe((res) => {
      this.difficultyList = res.body;
      this.loading = false;
    });
  }

  ModalOpen(difficulty: { id: any; title: any }) {
    this.selectedDifficulty = { id: difficulty.id, title: difficulty.title };
  }
}
