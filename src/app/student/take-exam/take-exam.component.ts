import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { Exam, Question } from '../../models/exam.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  questions: Question[] = [];
  answers: { [questionId: string]: string } = {};
  examId: string | null = null;
  score: number = 0;
  total: number = 0;
  percentage: number = 0;
  showScoreModal = false;
  timeRemaining: number = 0;
  timer: any;
  private sub: Subscription = new Subscription();

  constructor(private examService: ExamService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe({
      next:(params)=>{
        this.examId = params.get('id');
        if (this.examId) {
          this.loadExam();
        }
      }
    });
  }

  loadExam() {
    if (!this.examId) return;

    const token = localStorage.getItem('token') || '';
    this.examService.takeExam(this.examId, token).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.questions = exam.questions || [];
        this.timeRemaining = exam.duration * 60; // Convert minutes to seconds
        this.startTimer();
      },
      error: (err) => {
        console.error('Failed to fetch exam:', err);
        alert('Failed to load exam. Please try again.');
        this.router.navigate(['/student/dashboard']);
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  getTimeDisplay(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onAnswerChange(questionId: string, optionId: string) {
    this.answers[questionId] = optionId;
  }

  submitExam() {
    if (!this.examId) return;

    if (this.timer) {
      clearInterval(this.timer);
    }

    const token = localStorage.getItem('token') || '';
    this.examService.submitExam(this.examId, this.answers, token).subscribe({
      next: (result) => {
        this.score = result.score;
        this.total = result.total;
        this.percentage = parseFloat(result.percentage);
        this.showScoreModal = true;
      },
      error: (err) => {
        console.error('Failed to submit exam:', err);
        alert('Failed to submit exam. Please try again.');
      }
    });
  }

  closeScoreModal() {
    this.showScoreModal = false;
    this.router.navigate(['/student/dashboard']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}