import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Front';
  redirectUrl: string = "";

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

  }
  ngOnInit(): void {

    this.router.events
    .pipe(filter(x=> x instanceof NavigationStart && !x.url.includes('login') ))
    .subscribe((x: any)=> this.redirectUrl = x.url);

    this.auth.$notAuthenticated.subscribe(notAuthenticated => {
      if (notAuthenticated) {
        this.redirectToLogin();
      }
    });
  }
  redirectToLogin() {
    
    const options = { queryParams: { redirect: this.redirectUrl } }
    this.router.navigate(['/login'], options);
  }
}
