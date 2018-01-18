import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncodingModalContentComponent } from './encoding-modal-content.component';

describe('EncodingModalContentComponent', () => {
  let component: EncodingModalContentComponent;
  let fixture: ComponentFixture<EncodingModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncodingModalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncodingModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
