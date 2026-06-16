import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UserPayload, UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  readonly roleOptions = ['', 'Admin', 'TerritoryServant'];
  savingUser = false;
  savingRole = false;
  users$ = this.userService.users$;

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  roleForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    role: [this.roleOptions[1], [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notifications: NotificationsService
  ) { }

  saveUser() {
    if (this.userForm.invalid || this.savingUser) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.savingUser = true;
    const payload = this.trimUserPayload(this.userForm.getRawValue() as UserPayload);

    this.userService.createOrUpdateUser(payload)
      .pipe(finalize(() => this.savingUser = false))
      .subscribe(response => {
        this.notifications.send({
          type: 'success',
          message: `Usuario ${response.userName || payload.username} salvo.`
        });
        this.userForm.reset();
        this.userService.updateUserList();
      });
  }

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

  private trimUserPayload(user: UserPayload): UserPayload {
    return {
      email: user.email.trim(),
      username: user.username.trim(),
      password: user.password
    };
  }
}
