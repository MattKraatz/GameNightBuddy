import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightCollectionComponent } from './game-night-collection.component';

describe('GameNightCollectionComponent', () => {
  let component: GameNightCollectionComponent;
  let fixture: ComponentFixture<GameNightCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
