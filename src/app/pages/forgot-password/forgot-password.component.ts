import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecoveryPasswordService } from '../../services/recovery-password/recovery-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  form = this.fb.group({
    username: []
  });

  emailSent = false;
  constructor(private readonly fb: FormBuilder, 
    private readonly recoveryPasswordService: RecoveryPasswordService) {

  }

  onSubmit() {
    this.recoveryPasswordService.initRecovery(this.form.value.username).subscribe(() => this.emailSent = true);
  }
}
