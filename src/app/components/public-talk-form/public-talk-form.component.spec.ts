import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTalkFormComponent } from './public-talk-form.component';

describe('PublicTalkFormComponent', () => {
  let component: PublicTalkFormComponent;
  let fixture: ComponentFixture<PublicTalkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicTalkFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicTalkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
