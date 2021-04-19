import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsnSearchComponent } from './nsn-search.component';

describe('NsnSearchComponent', () => {
  let component: NsnSearchComponent;
  let fixture: ComponentFixture<NsnSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsnSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
