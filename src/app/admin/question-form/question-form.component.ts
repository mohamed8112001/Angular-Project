import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { Exam, Question } from '../../models/exam.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './question-form.html',
  styleUrls: ['./question-form.css']
})
export class QuestionFormComponent implements OnInit {
  examId: string = '';
  exam: Exam | null = null;
  questions: Question[] = [];
  newQuestion: Partial<Question> & { text?: string; type?: string; points?: number } = {
    question: '',
    text: '',
    type: 'multiple-choice',
    points: 1,
    options: []
  };

  trueFalseAnswer: string = 'true';

  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    const token = localStorage.getItem('token') || '';
    if (this.examId) {
      this.examService.getExamById(this.examId, token).subscribe({
        next: (exam) => {
          this.exam = exam;
          this.questions = exam.questions || [];
        },
        error: (err) => {
          console.error('Error loading exam:', err);
        }
      });
    }
  }

  addOption(): void {
    if (!this.newQuestion.options) {
      this.newQuestion.options = [];
    }
    this.newQuestion.options.push({ text: '', isCorrect: false });
  }

  removeOption(index: number): void {
    if (this.newQuestion.options) {
      this.newQuestion.options.splice(index, 1);
    }
  }

  addQuestion(): void {
    const token = localStorage.getItem('token') || '';

    // Prepare question data
    let questionData: any = {
      question: this.newQuestion.text || this.newQuestion.question,
      options: []
    };

    // Handle different question types
    if (this.newQuestion.type === 'true-false') {
      questionData.options = [
        { text: 'True', isCorrect: this.trueFalseAnswer === 'true' },
        { text: 'False', isCorrect: this.trueFalseAnswer === 'false' }
      ];
    } else {
      questionData.options = this.newQuestion.options || [];
    }

    this.examService.addQuestion(this.examId, questionData, token).subscribe({
      next: (response) => {
        console.log('Question added successfully:', response);
        // Reload exam to get updated questions
        this.examService.getExamById(this.examId, token).subscribe({
          next: (exam) => {
            this.exam = exam;
            this.questions = exam.questions || [];
            // Reset form
            this.resetForm();
          }
        });
      },
      error: (err) => {
        console.error('Error adding question:', err);
        alert('Failed to add question. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.newQuestion = {
      question: '',
      text: '',
      type: 'multiple-choice',
      points: 1,
      options: []
    };
    this.trueFalseAnswer = 'true';
  }

  updateQuestion(question: Question): void {
    // Implementation for updating question
    console.log('Update question:', question);
  }

  deleteQuestion(questionId: string): void {
    if (confirm('Are you sure you want to delete this question?')) {
      const token = localStorage.getItem('token') || '';
      this.examService.deleteQuestion(this.examId, questionId, token).subscribe({
        next: () => {
          // Reload questions
          this.examService.getExamById(this.examId, token).subscribe({
            next: (exam) => {
              this.exam = exam;
              this.questions = exam.questions || [];
            }
          });
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          alert('Failed to delete question. Please try again.');
        }
      });
    }
  }


}