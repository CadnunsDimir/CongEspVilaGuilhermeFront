import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Front';
  constructor(
    private auth: AuthService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.auth.$notAuthenticated.subscribe(notAuthenticated => {
      if (notAuthenticated) {
        this.redirectToLogin();
      }
    });
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
