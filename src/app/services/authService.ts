import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {authResponse} from '../models/authResponse'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string='http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  register(user:any): Observable<authResponse>{
    return this.http.post<authResponse>(this.baseURL,user);
  }

  login(user: any): Observable<authResponse>{
    return this.http.post<authResponse>(`${this.baseURL}/login`,user);
  }


}
