import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedbackForm: FormGroup;
  submitted = false;

  constructor(private sharedDataService: SharedDataService) {
    this.feedbackForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      feedback: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  ngOnInit(): void {
    const savedData = this.sharedDataService.getFeedbackData();
    if (savedData) {
      this.feedbackForm.setValue({
        name: savedData.name || '',
        feedback: savedData.feedback || ''
      });
      this.submitted = savedData.submitted || false;
    }
  }

  ngOnDestroy(): void {
    this.sharedDataService.setFeedbackData({
      ...this.feedbackForm.value,
      submitted: this.submitted
    });
  }

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      this.submitted = true;
    }
  }

  clearForm(): void {
    this.feedbackForm.reset({
      name: '',
      feedback: ''
    });
    this.submitted = false;
    this.sharedDataService.setFeedbackData(null);
  }
}
