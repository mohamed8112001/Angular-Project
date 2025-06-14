import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamService } from '../../services/exam.service';

interface StudentResult {
  _id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
  completedAt: Date;
  timeTaken: number;
}

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class StudentResultsComponent implements OnInit {
  results: StudentResult[] = [];
  loading = true;
  error = '';
  
  // Statistics
  totalExamsTaken = 0;
  averageScore = 0;
  passedExams = 0;
  failedExams = 0;
  bestScore = 0;
  worstScore = 100;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadStudentResults();
  }

  loadStudentResults(): void {
    this.loading = true;
    const token = localStorage.getItem('token') || '';
    
    this.examService.getStudentResults(token).subscribe({
      next: (response) => {
        this.results = response.data || [];
        this.calculateStatistics();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading student results:', err);
        this.error = 'Failed to load results. Please try again.';
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    if (this.results.length === 0) {
      return;
    }

    this.totalExamsTaken = this.results.length;
    this.passedExams = this.results.filter(r => r.passed).length;
    this.failedExams = this.totalExamsTaken - this.passedExams;
    
    const scores = this.results.map(r => r.percentage);
    this.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    this.bestScore = Math.max(...scores);
    this.worstScore = Math.min(...scores);
  }

  getScoreClass(percentage: number): string {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    return 'poor';
  }

  getPassedClass(passed: boolean): string {
    return passed ? 'passed' : 'failed';
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
