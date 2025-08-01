import { Component, HostBinding } from '@angular/core';
import { filter, map, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { MenuOption } from '../../models/menu.models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isLogged$ = this.auth.$notAuthenticated.pipe(map(x => !x));
  url: string = '';
  showMenu = false;
  menuItens: MenuOption[] = [
    { label: 'Página inicial', route: '/home' },
    { label: 'Territórios', route: '/territory' },
    { label: 'Território da Congregação', route: '/territory/all' },
    { label: 'Território - Registro de Designação', route: '/territory/assignment' },
    { label: 'Predicacion - Programacion Mensual', route: '/preaching-schedule'},
    { label: 'Reunion - Vida y Ministerio', route: '/meetings/life-and-ministry'},
    { label: 'Reunión - Fin de Semana', route: '/meetings/weekends'},
    { label: 'Reunion - Assign. Mecánicas + Limpieza', route: '/meetings/assignments'},
  ];
  
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter((x: any)=> x instanceof NavigationEnd),
        map((x: NavigationEnd) =>x.url),
        tap(x=> this.url = x))
      .subscribe();
  }

  logout() {
    this.showMenu = false;
    this.auth.requestUserLogin();
  }

  isSelected(item: MenuOption): boolean {
    return this.url == item.route;
  }
}
