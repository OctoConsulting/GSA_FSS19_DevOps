import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NSNSearchComponent } from './nsn-search.component';

describe('NSNSearchComponent', () => {
  let component: NSNSearchComponent;
  let fixture: ComponentFixture<NSNSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NSNSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NSNSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
