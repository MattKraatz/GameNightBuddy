import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightNavbarComponent } from './game-night-navbar.component';

describe('GameNightNavbarComponent', () => {
  let component: GameNightNavbarComponent;
  let fixture: ComponentFixture<GameNightNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
