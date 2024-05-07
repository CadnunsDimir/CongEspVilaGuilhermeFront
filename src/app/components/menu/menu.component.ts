import { Component } from '@angular/core';
import { filter, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  $isLogged = this.auth.$notAuthenticated.pipe(map(x => !x));
  url: string = '';
  showMenu = false;
  menuItens = [
    { label: 'Página inicial', route: '/home' },
    { label: 'Territórios', route: '/territory' },
  ];
  constructor(
    private auth: AuthService, 
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter((x: any)=> x instanceof NavigationEnd),
        map((x: NavigationEnd) =>x.url)
      ).subscribe(x=> this.url = x);
  }

  logout() {
    this.showMenu = false;
    this.auth.requestUserLogin();
  }

  isSelected(route: string): any {
    console.log(route, this.router.url.includes(route));
    this.router.url.includes(route);
  }
}
