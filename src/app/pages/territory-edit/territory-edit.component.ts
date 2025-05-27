import { Component, OnInit } from '@angular/core';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TerritoryService } from '../../services/territory/territory.service';
import { Router } from '@angular/router';
import { scrollBottom } from '../../html-funcions.utils';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-territory-edit',
  templateUrl: './territory-edit.component.html',
  styleUrl: './territory-edit.component.scss'
})
export class TerritoryEditComponent implements OnInit {  
  draggingCard?: number;
  card: TerritoryCard = JSON.parse(sessionStorage.getItem("card")!);
  territoryCardForm!: FormGroup;
  saving = false;
  itemChangingPosition: number | undefined;
  isNewCard = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private territory: TerritoryService,
    private notification: NotificationsService
  ) { }

  ngOnInit(): void {
    if(!this.card) {
      this.isNewCard = true;
      this.card = {
        cardId: this.territory.newCardId(),
        directions: [],
        neighborhood: ''
      };
    }    
    this.territoryCardForm = this.fb.group({
      cardId: [this.card.cardId],
      neighborhood: [this.card.neighborhood],
      directions: this.fb.array(this.card.directions.map(x => this.buildDirectionFormControls(x)))
    });
  }

  buildDirectionFormControls(direction: Direction) {
    return this.fb.group({
      streetName: [direction.streetName],
      houseNumber: [direction.houseNumber],
      complementaryInfo: [direction.complementaryInfo],
      lat: [direction.lat],
      long: [direction.long]
    });
  }

  get directionsControls(): FormArray<FormGroup> {
    return this.territoryCardForm.get('directions') as FormArray;
  }

  get canDeleteCard() : boolean{
    return this.directionsControls.length == 0;
  }

  addNewDirecction() {
    this.directionsControls.push(this.buildDirectionFormControls({
      streetName: '',
      complementaryInfo: '',
      houseNumber: ''
    }));

    scrollBottom();
  }

  removeDirection(directionControlIndex: number) {
    this.directionsControls.removeAt(directionControlIndex);
  }

  moveDirection(from: number, to: number) {
    this.itemChangingPosition = from;
    
    const fromControl = this.directionsControls.controls[from];
    this.directionsControls.removeAt(from);
    this.directionsControls.insert(to, fromControl);
    
    setTimeout(() => this.itemChangingPosition = undefined, 300);
  }

  moveDown(from: number) {
    const to = from + 1;
    this.moveDirection(from, to);
  }

  moveUp(from: number) {
    const to = from - 1;
    this.moveDirection(from, to);
  }

  drag(draggingCard: number) {
    this.draggingCard = draggingCard;
  }

  drop(newPositionCard: number) {
    this.moveDirection(this.draggingCard!, newPositionCard);
    this.draggingCard = undefined;
  }

  cancel() {
    this.backToTerritory();
  }

  backToTerritory() {
    this.router.navigate(['territory']);
  }
  
  dragover($event: DragEvent) {
    $event.preventDefault();
  }
  
  save() {
    if (!this.saving) {
      this.saving = true;
      if (this.isNewCard) {
        this.territory.createCard(this.territoryCardForm.value)
          .subscribe(() => this.backToTerritory());
      } else {
        this.territory.updateCard(this.territoryCardForm.value);
        this.backToTerritory();
      }
    }
  }

  deleteCard() {
    this.territory.deleteCard(this.card.cardId).subscribe(deleted=> {
      if (!deleted) {
        return this.notification.send({
          message: "No fue posible borrar la tarjeta seleccionada! Intente mover o borrar las direcciones, salvar y después borrar la tarjeta.",
          type: 'error',
          timeout: 6000
        });
      }
      this.backToTerritory();
    });
  }
}
