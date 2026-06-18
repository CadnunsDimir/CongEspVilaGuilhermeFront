import { Component } from '@angular/core';
import { UserListItem, UserService } from '../../services/users/user.service';
import { ROLE_LABEL_MAP } from '../../utils/roles.constant';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users$ = this.userService.users$;
  editUser?: UserListItem;

  readonly roleLabelMap = ROLE_LABEL_MAP;

  constructor(private readonly userService: UserService) { }

  openEditModal(user: UserListItem) {
    this.editUser = user;
  }

  onModalSaved() {
    this.editUser = undefined;
    this.userService.updateUserList();
  }

  getRoleLabel(role: string) {
    return this.roleLabelMap[role] ?? role;
  }

  getRoleDisplay(roles: string[]) {
    return roles.map(role => this.getRoleLabel(role)).join(', ');
  }

  onModalClosed() {
    this.editUser = undefined;
  }
}
