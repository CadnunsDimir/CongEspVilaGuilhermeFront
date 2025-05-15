import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFixedDaysButtonComponent } from './edit-fixed-days-button.component';

describe('EditFixedDaysButtonComponent', () => {
  let component: EditFixedDaysButtonComponent;
  let fixture: ComponentFixture<EditFixedDaysButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFixedDaysButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFixedDaysButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
