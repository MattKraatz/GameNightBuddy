import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightsComponent } from './game-nights.component';

describe('GameNightsComponent', () => {
  let component: GameNightsComponent;
  let fixture: ComponentFixture<GameNightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
