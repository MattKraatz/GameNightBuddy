import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightComponent } from './game-night.component';

describe('GameNightComponent', () => {
  let component: GameNightComponent;
  let fixture: ComponentFixture<GameNightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
