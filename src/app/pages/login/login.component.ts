import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  login = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(7)]]
  });
  redirectUrl: any;



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.redirectUrl = this.router.routerState.snapshot.root.queryParams['redirect'];
  }

  onSubmit() {
    console.log(this.login.value);
    const formData = this.login.value;
    this.auth.loginOnApi({
      login: formData.username || '',
      password: formData.password || ''
    }).subscribe(() => this.router.navigate([this.redirectUrl || "/"]));
  }
  newPassword() {

  }
}
