import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryAllComponent } from './territory-all.component';

describe('TerritoryAllComponent', () => {
  let component: TerritoryAllComponent;
  let fixture: ComponentFixture<TerritoryAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerritoryAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerritoryAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
