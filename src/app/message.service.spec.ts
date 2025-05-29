import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSource = new BehaviorSubject<string>(''); // initial message
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}
