import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNightMembersComponent } from './game-night-members.component';

describe('GameNightMembersComponent', () => {
  let component: GameNightMembersComponent;
  let fixture: ComponentFixture<GameNightMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNightMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNightMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
