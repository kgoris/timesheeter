import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncodingModalComponent } from './encoding-modal.component';

describe('EncodingModalComponent', () => {
  let component: EncodingModalComponent;
  let fixture: ComponentFixture<EncodingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncodingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncodingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
