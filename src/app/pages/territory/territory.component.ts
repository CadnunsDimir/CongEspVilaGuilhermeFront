import { Component, OnInit } from '@angular/core';
import { TerritoryService } from '../../services/territory/territory.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrl: './territory.component.scss'
})
export class TerritoryComponent implements OnInit {
  cards$ = this.service.cards$;
  territoryCard$ = this.service.territoryCard$.pipe(
    tap(x => {
      this.neighborhood = x?.neighborhood,
        this.cardId = x?.cardId
    })
  );
  showCardList = false;
  neighborhood: string | undefined;
  cardId: number | undefined;
  constructor(private service: TerritoryService) { }
  ngOnInit() { }
  selectCard(cardId: number) {
    this.showCardList = false;
    this.service.selectCard(cardId);
  }
  mapClick($event: any) {
    console.log($event);
  }
}
