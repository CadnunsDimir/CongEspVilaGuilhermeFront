import { Component } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  $notifications = this.notifications.$all;
  constructor(private notifications: NotificationsService){}
}
