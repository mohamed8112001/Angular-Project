import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ExamService } from '../../services/exam.service';
import { LoadingService } from '../../services/loading.servise';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-management.component.html',
  styleUrls: ['./exam-management.component.css']
})
export class ExamManagementComponent implements OnInit {
  exams: Exam[] = [];
  private examService = inject(ExamService);
  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loadingService.showLoading();
    const token = localStorage.getItem('token') || '';

    // Use teacher-specific endpoint for admin users
    this.examService.getTeacherExams(token).subscribe({
      next: (exams) => {
        this.exams = exams;
        this.loadingService.hideLoading();
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        // Fallback to general exams endpoint
        this.examService.getExams(token).subscribe({
          next: (exams) => {
            this.exams = exams;
            this.loadingService.hideLoading();
          },
          error: (fallbackError) => {
            console.error('Error loading exams (fallback):', fallbackError);
            this.loadingService.hideLoading();
          }
        });
      },
    });
  }

  deleteExam(examId: string): void {
    if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      this.loadingService.showLoading();
      const token = localStorage.getItem('token') || '';
      this.examService.deleteExam(examId, token).subscribe({
        next: () => {
          this.loadExams();
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
          this.loadingService.hideLoading();
        },
      });
    }
  }
}
