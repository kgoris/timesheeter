import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhistoricalComponent } from './userhistorical.component';

describe('UserhistoricalComponent', () => {
  let component: UserhistoricalComponent;
  let fixture: ComponentFixture<UserhistoricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhistoricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
