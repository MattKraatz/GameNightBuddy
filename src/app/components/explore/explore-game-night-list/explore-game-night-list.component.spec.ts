import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreGameNightListComponent } from './explore-game-night-list.component';

describe('ExploreGameNightListComponent', () => {
  let component: ExploreGameNightListComponent;
  let fixture: ComponentFixture<ExploreGameNightListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreGameNightListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreGameNightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
