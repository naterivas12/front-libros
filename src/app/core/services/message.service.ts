import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Message {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<Message>();
  message$ = this.messageSubject.asObservable();

  showSuccess(message: string): void {
    this.messageSubject.next({ type: 'success', text: message });
  }

  showError(message: string): void {
    this.messageSubject.next({ type: 'error', text: message });
  }

  showInfo(message: string): void {
    this.messageSubject.next({ type: 'info', text: message });
  }

  showWarning(message: string): void {
    this.messageSubject.next({ type: 'warning', text: message });
  }
}
