import { Component, EventEmitter, Input, model, OnInit, Output } from '@angular/core';
import { TerritoryService } from '../../../../services/territory/territory.service';
import { take } from 'rxjs';

export interface CardsSelectorChangeEvent{
  originCard: number,
  destinationCard?: number
}

@Component({
  selector: 'app-cards-selector',
  templateUrl: './cards-selector.component.html',
  styleUrl: './cards-selector.component.scss'
})
export class CardsSelectorComponent implements OnInit{
  showControls = model<boolean>(false);
  cards: number[] = [];
  protected _originCard: number = 0;

  @Input()
  set originCard(id: number | undefined){
    if(this._originCard != id){
      this.destinationCard = undefined;
    }
    if(id) {
      this._originCard = id;
    }
  }
  destinationCard: number | undefined;

  @Output()
  changeCards = new EventEmitter<CardsSelectorChangeEvent>();

  constructor(private readonly territory: TerritoryService) {
    
  }

  ngOnInit(): void {
    this.territory.cards$
      .pipe(take(1))
      .subscribe(cards=> this.cards = cards || []);
  }

  filteredCards(ignoreCard: number | undefined){
    return this.cards.filter(x=> x != ignoreCard);
  }

  changeValues() {
     this.changeCards.emit({
        originCard: this._originCard,
        destinationCard: this.destinationCard
      });
  }
}
