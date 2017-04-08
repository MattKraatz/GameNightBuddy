import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightRegistrationComponent } from './game-night-registration.component';

describe('GameNightRegistrationComponent', () => {
  let component: GameNightRegistrationComponent;
  let fixture: ComponentFixture<GameNightRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
