import { Injectable } from '@angular/core';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: string;
}

export interface Exam {
  id: number;
  title: string;
  questions: Question[];
}

@Injectable({ providedIn: 'root' })
export class ExamService {
  private exams: Exam[] = [
    {
      id: 1,
      title: 'JavaScript Basics',
      questions: [
        { id: 1, text: 'What is a closure?', options: ['A function with preserved data', 'A CSS property', 'A type of loop'], correct: 'A function with preserved data' },
        { id: 2, text: 'Which keyword declares a constant?', options: ['const', 'let', 'var'], correct: 'const' }
      ]
    },
    {
      id: 2,
      title: 'Angular Fundamentals',
      questions: [
        { id: 1, text: 'What is a component?', options: ['A service', 'A UI building block', 'A router'], correct: 'A UI building block' },
        { id: 2, text: 'Which file defines routes?', options: ['app.routes.ts', 'main.ts', 'polyfills.ts'], correct: 'app.routes.ts' }
      ]
    }
  ];

  getExams(): Exam[] {
    return this.exams;
  }

  getExamById(id: number): Exam | undefined {
    return this.exams.find(e => e.id === id);
  }

  addQuestion(examId: number, question: Question) {
    const exam = this.getExamById(examId);
    if (exam) {
      exam.questions.push({ ...question });
    }
  }

  updateQuestion(examId: number, question: Question) {
    const exam = this.getExamById(examId);
    if (exam) {
      const idx = exam.questions.findIndex(q => q.id === question.id);
      if (idx > -1) {
        exam.questions[idx] = { ...question };
      }
    }
  }

  deleteQuestion(examId: number, questionId: number) {
    const exam = this.getExamById(examId);
    if (exam) {
      exam.questions = exam.questions.filter(q => q.id !== questionId);
    }
  }
}
