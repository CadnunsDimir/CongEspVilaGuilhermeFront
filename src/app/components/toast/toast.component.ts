import { delay, of, tap } from 'rxjs';
import { NotificationsService } from './../../services/notifications/notifications.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  $data = this.notifications.$last.pipe(
    tap(x=> {
      if(x){
        of({})
          .pipe(delay(x.timeout || 3000))
          .subscribe(()=> this.notifications.clearLast());
      }
    })
  );

  constructor(
    private notifications: NotificationsService
  ){
  }

  click() {
    this.notifications.clearLast();
  }
}
