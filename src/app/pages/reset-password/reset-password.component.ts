import { take } from 'rxjs';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecoveryPasswordService } from '../../services/recovery-password/recovery-password.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  form = this.fb.group({
    username: [],
    password: []
  });

  resetId: string = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly recoveryPasswordService: RecoveryPasswordService,
    private readonly notifications: NotificationsService
  ) {
    this.route.params.pipe(take(1)).subscribe(params=> this.resetId = params['resetId']);
  }
  onSubmit() {
    const { password, username } = this.form.value;
    this.recoveryPasswordService.finishRecovery({
      newPassword: password ?? '',
      username: username ?? '',
      resetPasswordId: this.resetId
    })
    .subscribe(()=> {
      this.notifications.send({
        message: 'Tu contraseña ha sido cambiada! Acceda la aplicación usando tu nombre de usuário y tu nueva contraseña.',
        type: 'success'
      });

      this.router.navigate(['login']);
    });
  }
}
