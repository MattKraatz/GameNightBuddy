import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDropdownComponent } from './game-dropdown.component';

describe('GameDropdownComponent', () => {
  let component: GameDropdownComponent;
  let fixture: ComponentFixture<GameDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
