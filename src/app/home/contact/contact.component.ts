import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MessageService } from '../../message.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  messageFromParent = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    const savedData = this.sharedDataService.getContactData();

    this.contactForm = this.fb.group({
      email: [savedData?.email || '', [Validators.required, Validators.email]],
      phone: [savedData?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: [savedData?.message || '', [Validators.required, Validators.minLength(10)]]
    });

    this.messageService.currentMessage$.subscribe(msg => {
      this.messageFromParent = msg;
    });
  }

  ngOnDestroy(): void {
    this.sharedDataService.setContactData(this.contactForm.value);
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.messageService.updateMessage(
        `Contact Form ➤ Email: ${formData.email}, Phone: ${formData.phone}, Msg: ${formData.message}`
      );
      this.contactForm.reset();
      this.sharedDataService.setContactData(null);
    }
  }

  clearForm(): void {
    this.contactForm.reset();
    this.sharedDataService.setContactData(null);
  }
}
