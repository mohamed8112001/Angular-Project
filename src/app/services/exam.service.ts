

import { Injectable } from '@angular/core';
import { examResponse } from './../models/examResponse';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Exam, Question } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  deleteQuestion(examId: string, questionId: string, token: string): Observable<any> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.delete<{ status: string }>(`${this.baseURL}/${examId}/${questionId}`, headers).pipe(
      map(res => res.status === 'success')
    );
  }

  updateQuestion(examId: string, questionId: string, question: Question, token: string): Observable<any> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.patch<{ status: string, data: any }>(`${this.baseURL}/${examId}/${questionId}`, question, headers).pipe(
      map(res => res.data)
    );
  }
  addQuestion(examId: string, question: any, token: string): Observable<any> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.post<{ status: string, data: any }>(`${this.baseURL}/${examId}/question`, question, headers).pipe(
      map(res => res.data)
    );
  }


  private baseURL = 'http://localhost:3000/exams';

  constructor(private http: HttpClient) { }

  getExams(token?: string): Observable<Exam[]> {
    const headers = token ? { headers: new HttpHeaders({ Authorization: token }) } : {};
    return this.http.get<{ status: string, data: Exam[] }>(this.baseURL, headers).pipe(
      map(res => res.data)
    );
  }

  getTeacherExams(token: string): Observable<Exam[]> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.get<{ status: string, data: Exam[] }>(`${this.baseURL}/teacher`, headers).pipe(
      map(res => res.data)
    );
  }

  getActiveExams(token?: string): Observable<Exam[]> {
    return this.getExams(token).pipe(
      map(exams => exams.filter(exam => exam.isActive))
    );
  }

  getExamById(id: string, token?: string): Observable<Exam> {
    const headers = token ? { headers: new HttpHeaders({ Authorization: token }) } : {};
    return this.http.get<{ status: string, data: Exam }>(`${this.baseURL}/${id}`, headers).pipe(
      map(res => res.data)
    );
  }

  createExam(exam: Partial<Exam>, token: string): Observable<Exam> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.post<{ status: string, data: Exam }>(this.baseURL, exam, headers).pipe(
      map(res => res.data)
    );
  }

  updateExam(id: string, examData: Partial<Exam>, token: string): Observable<Exam> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.patch<{ status: string, data: Exam }>(`${this.baseURL}/${id}`, examData, headers).pipe(
      map(res => res.data)
    );
  }

  deleteExam(id: string, token: string): Observable<boolean> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.delete<{ status: string }>(`${this.baseURL}/${id}`, headers).pipe(
      map(res => res.status === 'success')
    );
  }

  getAllResults(token: string): Observable<any> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.get<any>('http://localhost:3000/results', headers);
  }

  takeExam(examId: string, token: string): Observable<Exam> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.get<{ status: string, data: Exam }>(`${this.baseURL}/${examId}/take`, headers).pipe(
      map(res => res.data)
    );
  }

  submitExam(examId: string, answers: any, token: string): Observable<any> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.post<any>(`${this.baseURL}/${examId}/submit`, { answers }, headers);
  }

  getStudentResults(token: string): Observable<any> {
    const headers = { headers: new HttpHeaders({ Authorization: token }) };
    return this.http.get<any>('http://localhost:3000/results/stu', headers);
  }

}