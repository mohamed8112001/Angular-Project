import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  exams: Exam[] = [];
  totalQuestions: number = 0;
  recentActivities: { message: string; time: Date }[] = [];
  studentResults: any[] = [];
  totalStudents = 0;
  averageScore = 0;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadStudentResults();
  }

  loadExams(): void {
    const token = localStorage.getItem('token') || '';

    // Use teacher-specific endpoint for admin users
    this.examService.getTeacherExams(token).subscribe({
      next: (exams) => {
        this.exams = exams || [];
        this.totalQuestions = this.calculateTotalQuestions(this.exams);
        this.recentActivities = this.exams.flatMap((e) => {
          if (e.updatedAt && e.updatedAt !== e.createdAt) {
            return [{
              message: `Updated exam "${e.title || 'Untitled Exam'}"`,
              time: new Date(e.updatedAt),
            }];
          } else if (e.createdAt) {
            return [{
              message: `Created exam "${e.title || 'Untitled Exam'}"`,
              time: new Date(e.createdAt),
            }];
          } else {
            return [{
              message: `Created exam "${e.title || 'Untitled Exam'}"`,
              time: new Date(),
            }];
          }
        })
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 4);
      },
      error: (err) => {
        console.error('Error loading teacher exams:', err);
        // Fallback to general exams endpoint
        this.examService.getExams(token).subscribe({
          next: (exams) => {
            this.exams = exams || [];
            this.totalQuestions = this.calculateTotalQuestions(this.exams);
          },
          error: (fallbackErr) => {
            console.error('Error loading exams (fallback):', fallbackErr);
            this.exams = [];
          }
        });
      },
    });
  }

  deleteExam(examId: string): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      const token = localStorage.getItem('token') || '';
      this.examService.deleteExam(examId, token).subscribe({
        next: () => {
          this.loadExams();
        },
        error: () => {
          alert('Failed to delete exam.');
        }
      });
    }
  }

  private calculateTotalQuestions(exams: Exam[]): number {
    return exams.reduce(
      (total, exam) => total + (exam.questions?.length || 0),
      0
    );
  }

  loadStudentResults(): void {
    const token = localStorage.getItem('token') || '';
    this.examService.getAllResults(token).subscribe({
      next: (response) => {
        this.studentResults = (response.data || []).slice(0, 10); // Show latest 10 results
        this.calculateResultsStatistics();
      },
      error: (err) => {
        console.error('Error loading student results:', err);
      }
    });
  }

  calculateResultsStatistics(): void {
    if (this.studentResults.length === 0) {
      return;
    }

    // Get unique students
    const uniqueStudents = new Set(this.studentResults.map(r => r.studentId));
    this.totalStudents = uniqueStudents.size;

    // Calculate average score
    const scores = this.studentResults.map(r => r.percentage || 0);
    this.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
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

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
