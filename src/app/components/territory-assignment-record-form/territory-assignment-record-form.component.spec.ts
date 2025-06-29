import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryAssignmentRecordFormComponent } from './territory-assignment-record-form.component';

describe('TerritoryAssignmentRecordFormComponent', () => {
  let component: TerritoryAssignmentRecordFormComponent;
  let fixture: ComponentFixture<TerritoryAssignmentRecordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerritoryAssignmentRecordFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerritoryAssignmentRecordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
