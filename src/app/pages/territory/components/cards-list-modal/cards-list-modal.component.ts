import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cards-list-modal',
  templateUrl: './cards-list-modal.component.html',
  styleUrl: './cards-list-modal.component.scss'
})
export class CardsListModalComponent {
  public _show: boolean | undefined;
  search: any;

  @Input({ required: true})
  get showCardList() {
    return this._show;
  }
  set showCardList(show: boolean | undefined){
    this._show = show;
    this.scrollToOption();
  };
  @Output()
  showCardListChange = new EventEmitter<string>();

  @Input({ required: true})
  cards$: Observable<number[] | undefined> | undefined;

  @Input({ required: true})
  cardId$: Observable<number | undefined> | undefined;

  @Output()
  select = new EventEmitter<number>()

  selectCard(cardId: number) {
    this.select.emit(cardId);
  }

  scrollToOption() {
    const item = document.querySelector('.cards-list li.selected');
    item?.scrollIntoView();
  }
  
  closeModal() {
    this.showCardList = false;
  }
}
