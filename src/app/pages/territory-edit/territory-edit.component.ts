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

  card: TerritoryCard = JSON.parse(sessionStorage.getItem("card")!);
  territoryCardForm!: FormGroup;
  saving = false;

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private territory: TerritoryService){}

  ngOnInit(): void {
    console.log(this.card);
    this.territoryCardForm = this.fb.group({
      cardId: [this.card.cardId],
      neighborhood: [this.card.neighborhood],
      directions: this.fb.array(this.card.directions.map(x=> this.buildDirectionFormControls(x)))
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

  save() {
    if(!this.saving){
      this.saving = true;
      console.log(this.territoryCardForm.value);
      // setTimeout(() => this.saving = false, 1000);
      this.territory.updateCard(this.territoryCardForm.value).subscribe(()=>{
        this.territory.selectCard(this.card.cardId);
        this.router.navigate(['territory']);
      });
    }
  }
}
