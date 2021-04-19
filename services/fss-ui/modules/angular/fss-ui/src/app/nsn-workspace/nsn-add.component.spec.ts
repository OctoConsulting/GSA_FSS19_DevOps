import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsnAddComponent } from './nsn-add.component';

describe('NsnAddComponent', () => {
  let component: NsnAddComponent;
  let fixture: ComponentFixture<NsnAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsnAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsnAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
