import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './exam-result.html',
  styleUrls: ['./exam-result.css']
})
export class ExamResultComponent implements OnInit {
  results: any[] = [];
  loading = true;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    const token = localStorage.getItem('token') || '';
    this.examService.getStudentResults(token).subscribe({
      next: (response) => {
        this.results = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading results:', err);
        this.loading = false;
      }
    });
  }
}
