import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  $isLogged = this.auth.$notAuthenticated.pipe(map(x => !x));
  showMenu = false;
  menuItens = [
    { label: 'Página inicial', route: '/home' },
    { label: 'Territórios', route: '/territory' },
  ];
  constructor(private auth: AuthService) {

  }

  logout() {
    this.showMenu = false;
    this.auth.requestUserLogin();
  }
}
