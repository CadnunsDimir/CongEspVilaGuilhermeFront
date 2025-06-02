import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-loader-overlay',
  templateUrl: './loader-overlay.component.html',
  styleUrl: './loader-overlay.component.scss'
})
export class LoaderOverlayComponent {
  loader$ = this.service.loader$;

  constructor(private readonly service: LoaderService) {
    
  }
}
