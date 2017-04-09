import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGameNightsComponent } from './my-game-nights.component';

describe('MyGameNightsComponent', () => {
  let component: MyGameNightsComponent;
  let fixture: ComponentFixture<MyGameNightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGameNightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGameNightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
