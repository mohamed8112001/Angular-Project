import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  exams: Exam[] = [];
  recentResults: any[] = [];
  studentStats = {
    totalExamsTaken: 0,
    averageScore: 0,
    passedExams: 0,
    lastExamDate: null as Date | null
  };

  constructor(private examService: ExamService){}

  ngOnInit():void{
    this.loadExams();
    this.loadStudentResults();
  }

  loadExams(): void {
    const token = localStorage.getItem('token') || '';
    this.examService.getActiveExams(token).subscribe({
      next: (exams)=>{
        this.exams = exams || [];
      },
      error:(err)=>{
        console.log('Error loading exams:', err);
      }
    });
  }

  loadStudentResults(): void {
    const token = localStorage.getItem('token') || '';
    this.examService.getStudentResults(token).subscribe({
      next: (response) => {
        this.recentResults = (response.data || []).slice(0, 5); // Show latest 5 results
        this.calculateStudentStats();
      },
      error: (err) => {
        console.error('Error loading student results:', err);
      }
    });
  }

  calculateStudentStats(): void {
    if (this.recentResults.length === 0) {
      return;
    }

    this.studentStats.totalExamsTaken = this.recentResults.length;
    this.studentStats.passedExams = this.recentResults.filter(r => r.passed).length;

    const scores = this.recentResults.map(r => r.percentage || 0);
    this.studentStats.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Get the most recent exam date
    const dates = this.recentResults
      .map(r => r.completedAt)
      .filter(date => date)
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    this.studentStats.lastExamDate = dates.length > 0 ? dates[0] : null;
  }

  takeExam(examId: string) {
    // Navigate to take exam page
    window.location.href = `/student/take-exam/${examId}`;
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
      year: 'numeric'
    });
  }

  formatDateTime(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
