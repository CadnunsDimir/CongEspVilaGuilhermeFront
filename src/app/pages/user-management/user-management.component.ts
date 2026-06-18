import { Component } from '@angular/core';
import { UserListItem, UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users$ = this.userService.users$;
  editUser?: UserListItem;

  constructor(private readonly userService: UserService) { }

  openEditModal(user: UserListItem) {
    this.editUser = user;
  }

  onModalSaved() {
    this.editUser = undefined;
    this.userService.updateUserList();
  }

  onModalClosed() {
    this.editUser = undefined;
  }
}
