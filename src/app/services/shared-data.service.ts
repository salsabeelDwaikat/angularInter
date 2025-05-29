import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private feedbackData: any = null;
  private aboutData: any = null;
  private contactData: any = null;

  // Feedback data
  setFeedbackData(data: any): void {
    this.feedbackData = data;
  }

  getFeedbackData(): any {
    return this.feedbackData;
  }

  // About data
  setAboutData(data: any): void {
    this.aboutData = data;
  }

  getAboutData(): any {
    return this.aboutData;
  }

  // Contact data
  setContactData(data: any): void {
    this.contactData = data;
  }

  getContactData(): any {
    return this.contactData;
  }

  clearAll(): void {
    this.feedbackData = null;
    this.aboutData = null;
    this.contactData = null;
  }
}
