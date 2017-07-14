import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRecommenderComponent } from './game-recommender.component';

describe('GameRecommenderComponent', () => {
  let component: GameRecommenderComponent;
  let fixture: ComponentFixture<GameRecommenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRecommenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRecommenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
