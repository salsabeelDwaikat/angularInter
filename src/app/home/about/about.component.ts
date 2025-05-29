import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MessageService } from '../../message.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  aboutForm: FormGroup;
  roles = ['Admin', 'Editor', 'Viewer'];
  messageFromParent = '';

  constructor(
    private messageService: MessageService,
    private sharedDataService: SharedDataService
  ) {
    this.aboutForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      role: new FormControl('', Validators.required),
      isSubscribed: new FormControl(false)
    });
  }

  ngOnInit(): void {
    // Restore data 
    const savedData = this.sharedDataService.getAboutData();
    if (savedData) {
      this.aboutForm.setValue(savedData);
    }

    // Receive message from parent
    this.messageService.currentMessage$.subscribe(msg => {
      this.messageFromParent = msg;
    });
  }

  ngOnDestroy(): void {
    this.sharedDataService.setAboutData(this.aboutForm.value);
  }

  sendToParent(): void {
    const { name, role, isSubscribed } = this.aboutForm.value;
    this.messageService.updateMessage(
      `Name: ${name}, Role: ${role}, Subscribed: ${isSubscribed}`
    );
  }

  clearForm(): void {
    this.aboutForm.reset({
      name: '',
      role: '',
      isSubscribed: false
    });
    this.sharedDataService.setAboutData(null);
  }
}
