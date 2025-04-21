import { Component, OnInit } from '@angular/core';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { Form, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TerritoryService } from '../../services/territory/territory.service';
import { Route, Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private territory: TerritoryService) { }

  ngOnInit(): void {
    console.log(this.card);
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

  addNewDirecction() {
    this.directionsControls.push(this.buildDirectionFormControls({
      streetName: '',
      complementaryInfo: '',
      houseNumber: ''
    }));
  }

  removeDirection(directionControlIndex: number) {
    this.directionsControls.removeAt(directionControlIndex);
  }

  moveDirection(from: number, to: number) {
    this.itemChangingPosition = from;

    const values = [...this.directionsControls.value];

    const itemToUp = values[to];
    const itemToDown = values[from];
    values[to] = itemToDown;
    values[from] = itemToUp;

    setTimeout(() => {
      this.directionsControls.setValue(values);
      this.itemChangingPosition = to;
    }, 200);

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
      this.territory.updateCard(this.territoryCardForm.value);
      this.backToTerritory();
    }
  }
}
