import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const url = 'https://fe44-213-6-46-155.ngrok-free.app/polls/api/login/'

      const body = this.loginForm.value;

      this.http.post(url, body).subscribe({
        next: (res) => {
          alert('Login successful!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Login failed. Please try again.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
