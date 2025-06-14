import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';

@Component({
  imports: [CommonModule],
  selector: 'app-results-management',
  templateUrl: './results-management.component.html',
  styleUrls: ['./results-management.component.css']
})
export class ResultsManagementComponent implements OnInit {
  totalStudents = 0;
  averageScore = 0;
  passRate = 0;
  results: any[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    this.examService.getAllResults(token).subscribe({
      next: (data) => {
        this.results = data.data || [];
        this.totalStudents = this.results.length;
        this.averageScore = this.results.length
          ? Math.round(
              this.results.reduce((sum: number, r: any) => sum + (r.percentage || r.score || 0), 0) / this.results.length
            )
          : 0;
        this.passRate = this.results.length
          ? Math.round(
              (this.results.filter((r: any) => (r.percentage || r.score || 0) >= 50).length / this.results.length) * 100
            )
          : 0;
      },
      error: (err) => {
        console.error('Error loading results:', err);
      },
    });
  }
}
