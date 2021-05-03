import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NSNAddEditComponent } from './nsn-addedit.component';

describe('NSNAddEditComponent', () => {
  let component: NSNAddEditComponent;
  let fixture: ComponentFixture<NSNAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NSNAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NSNAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
