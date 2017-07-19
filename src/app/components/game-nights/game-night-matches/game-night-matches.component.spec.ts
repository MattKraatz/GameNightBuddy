import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightMatchesContainer } from './game-night-matches.component';

describe('GameNightMatchesComponent', () => {
  let component: GameNightMatchesContainer;
  let fixture: ComponentFixture<GameNightMatchesContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightMatchesContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightMatchesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
