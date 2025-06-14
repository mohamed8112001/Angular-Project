

import { Routes } from '@angular/router';

import { LoginPageComponent } from './auth/login-page/login-page.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { TakeExamComponent } from './student/take-exam/take-exam.component';
import { ExamResultComponent } from './student/exam-result/exam-result.component';
import { StudentResultsComponent } from './student/results/results.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ExamFormComponent } from './admin/exam-form/exam-form.component';
import { QuestionFormComponent } from './admin/question-form/question-form.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full'
  },
  
  {
    path: 'admin/results',
    loadComponent: () => import('./admin/results-management/results-management.component').then(m => m.ResultsManagementComponent)
  },
  {
    path: 'admin',
    children: [
      {
        path: 'exams',
        loadComponent: () =>
          import('./admin/exam-management/exam-management.component').then(
            m => m.ExamManagementComponent
          )
      },
      {
        path: 'exams/create',
        loadComponent: () =>
          import('./admin/exam-form/exam-form.component').then(
            m => m.ExamFormComponent
          )
      },
      {
        path: 'exams/:id/edit',
        loadComponent: () =>
          import('./admin/exam-form/exam-form.component').then(
            m => m.ExamFormComponent
          )
      },
      {
        path: 'question-form/:examId',
        component: QuestionFormComponent
      }
    ]
  },
  { path: 'login/:id', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'student/dashboard', component: DashboardComponent },
  { path: 'student/take-exam/:id', component: TakeExamComponent },
  { path: 'student/exam-result', component: ExamResultComponent },
  { path: 'student/results', component: StudentResultsComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/exam-form', component: ExamFormComponent },
  { path: 'admin/question-form', component: QuestionFormComponent },
  { path: '**', component: NotFoundComponent }
];


  

