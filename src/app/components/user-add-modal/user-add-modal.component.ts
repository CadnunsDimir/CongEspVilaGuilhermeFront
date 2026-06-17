import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UserPayload, UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-user-add-modal',
  templateUrl: './user-add-modal.component.html',
  styleUrls: ['./user-add-modal.component.scss']
})
export class UserAddModalComponent {
  showModal = false;
  savingUser = false;

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notifications: NotificationsService
  ) { }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    this.userForm.markAsPristine();
  }

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
          message: `Usuário ${response.userName || payload.username} salvo.`
        });
        this.userForm.reset();
        this.closeModal();
        this.userService.updateUserList();
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
