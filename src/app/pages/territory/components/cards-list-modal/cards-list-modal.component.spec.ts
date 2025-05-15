import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsListModalComponent } from './cards-list-modal.component';

describe('CardsListModalComponent', () => {
  let component: CardsListModalComponent;
  let fixture: ComponentFixture<CardsListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
