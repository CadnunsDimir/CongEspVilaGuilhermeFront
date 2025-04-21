import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsTableComponent } from './directions-table.component';

describe('DirectionsTableComponent', () => {
  let component: DirectionsTableComponent;
  let fixture: ComponentFixture<DirectionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectionsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
