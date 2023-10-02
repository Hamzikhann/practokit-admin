import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDifficultiesComponent } from './question-difficulties.component';

describe('QuestionDifficultiesComponent', () => {
  let component: QuestionDifficultiesComponent;
  let fixture: ComponentFixture<QuestionDifficultiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDifficultiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDifficultiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
