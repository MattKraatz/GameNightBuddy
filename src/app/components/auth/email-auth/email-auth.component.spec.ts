import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAuthComponent } from './email-auth.component';

describe('EmailAuthComponent', () => {
  let component: EmailAuthComponent;
  let fixture: ComponentFixture<EmailAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
