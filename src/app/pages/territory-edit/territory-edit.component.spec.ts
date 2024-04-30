import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryEditComponent } from './territory-edit.component';

describe('TerritoryEditComponent', () => {
  let component: TerritoryEditComponent;
  let fixture: ComponentFixture<TerritoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerritoryEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerritoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
