import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const url = 'https://fe44-213-6-46-155.ngrok-free.app/polls/api/register/';
      this.http.post(url, this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          alert('Registration successful!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert(`Registration failed. Please try again.\nError: ${err.status} ${err.statusText}`);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}
