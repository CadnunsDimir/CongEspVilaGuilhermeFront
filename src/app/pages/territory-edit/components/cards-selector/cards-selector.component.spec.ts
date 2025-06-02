import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsSelectorComponent } from './cards-selector.component';

describe('CardsSelectorComponent', () => {
  let component: CardsSelectorComponent;
  let fixture: ComponentFixture<CardsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
