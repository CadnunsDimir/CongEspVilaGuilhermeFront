import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeAndMinitryComponent } from './life-and-minitry.component';

describe('LifeAndMinitryComponent', () => {
  let component: LifeAndMinitryComponent;
  let fixture: ComponentFixture<LifeAndMinitryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LifeAndMinitryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifeAndMinitryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
