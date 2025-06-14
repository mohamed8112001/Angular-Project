import { AuthService } from './../../services/authService';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPageComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService ){}

  registerErrorMessage: string = '';

  ngOnInit() :void{
    this.activatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.getUsername.setValue('');
        this.getEmail.setValue('');
        this.getPassword.setValue('');
        this.getRole.setValue('student');
      }
    })
  }

  registerForm= new FormGroup({
    username: new FormControl('',  [Validators.required, Validators.minLength(8)]),
    email: new FormControl('',  [
      Validators.required,
      Validators.pattern(/^[a-zA-Z]{3,8}(@)(gmail|yahoo)(.com)$/)
    ]),
    password:new FormControl('',  [Validators.required, Validators.minLength(6)]),
    role:new FormControl('student'),
  })
  
  get getUsername(){
    return this.registerForm.controls['username'];
  }
  get getEmail(){
    return this.registerForm.controls['email'];
  }
  get getPassword(){
    return this.registerForm.controls['password'];
  }
  get getRole(){
    return this.registerForm.controls['role'];
  }

  authHandler(event: Event){
    event.preventDefault();
    if(this.registerForm.status === 'VALID'){
      this.authService.register(this.registerForm.value).subscribe({
        next: ()=>{
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err)
          this.registerErrorMessage = 'Registration failed';
        }
      })
    }else{
      console.log('Form is invalid');
      this.registerErrorMessage = 'Form is invalid';
    }
  }

}
