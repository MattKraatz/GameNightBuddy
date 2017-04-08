import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightListComponent } from './game-night-list.component';

describe('GameNightListComponent', () => {
  let component: GameNightListComponent;
  let fixture: ComponentFixture<GameNightListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
