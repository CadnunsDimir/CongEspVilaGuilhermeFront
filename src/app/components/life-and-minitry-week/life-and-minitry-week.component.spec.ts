import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeAndMinitryWeekComponent } from './life-and-minitry-week.component';

describe('LifeAndMinitryWeekComponent', () => {
  let component: LifeAndMinitryWeekComponent;
  let fixture: ComponentFixture<LifeAndMinitryWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LifeAndMinitryWeekComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifeAndMinitryWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
