import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  type:  'success' |'error'| 'info' | 'warning',
  message: string,
  timeout?: number
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  clearAll() {
    this.$_all.next([]);
  }
  
  send(notification: Notification) {
    this.$_last.next(notification);
    this.$_all.next([
      notification,
      ...this.$_all.getValue()
    ])
  }
  
  private $_last = new BehaviorSubject<Notification | undefined>(undefined);
  $last = this.$_last.asObservable();
  private $_all = new BehaviorSubject<Notification[]>([]);
  $all = this.$_all.asObservable();

  constructor() { }

  clearLast() {
    this.$_last.next(undefined);
  }
}
