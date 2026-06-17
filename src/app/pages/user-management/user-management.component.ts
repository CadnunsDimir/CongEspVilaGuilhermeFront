import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  readonly roleOptions = ['', 'Reader', 'Admin', 'TerritoryServant'];
  savingRole = false;
  users$ = this.userService.users$;

  constructor(
    private readonly userService: UserService,
    private readonly notifications: NotificationsService
  ) { }

  updateRole(username: string, role: string) {

    this.savingRole = true;

    this.userService.updateRole(username, role)
      .pipe(finalize(() => this.savingRole = false))
      .subscribe(() => {
        this.userService.updateUserList();
        this.notifications.send({
          type: 'success',
          message: `Permissao ${role} aplicada para ${username}.`
        });
      });
  }
}
