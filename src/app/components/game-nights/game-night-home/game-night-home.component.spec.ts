import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightHomeComponent } from './game-night-home.component';

describe('GameNightHomeComponent', () => {
  let component: GameNightHomeComponent;
  let fixture: ComponentFixture<GameNightHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
