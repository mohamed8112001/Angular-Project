import { examResponse } from './../models/examResponse';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  baseURL: string='http://localhost:3000/exams';

  constructor(private http: HttpClient) { }

  getAllExams(token?: string): Observable<{ status: string, data: examResponse[] }>{
    const headers = token ? { headers: new HttpHeaders({ Authorization: token }) } : {};
    return this.http.get<{ status: string, data: examResponse[] }>(this.baseURL, headers);
  }

  getTeacherExams(token?: string): Observable<{ status: string, data: examResponse[] }> {
    const headers = token ? { headers: new HttpHeaders({ Authorization: token }) } : {};
    return this.http.get<{ status: string, data: examResponse[] }>(`${this.baseURL}/teacher`, headers);
  }

  getExamById(id: string, token?: string): Observable<{ status: string, data: examResponse }> {
    const headers = token ? { headers: new HttpHeaders({ Authorization: token }) } : {};
    return this.http.get<{ status: string, data: examResponse }>(`${this.baseURL}/${id}`, headers);
  }

  getAllResults(token?: string): Observable<any> {
    const headers = token ? { headers: new HttpHeaders({ Authorization: token }) } : {};
    return this.http.get<any>('http://localhost:3001/results', headers);
  }
}
