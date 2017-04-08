import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightMatchesComponent } from './game-night-matches.component';

describe('GameNightMatchesComponent', () => {
  let component: GameNightMatchesComponent;
  let fixture: ComponentFixture<GameNightMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
