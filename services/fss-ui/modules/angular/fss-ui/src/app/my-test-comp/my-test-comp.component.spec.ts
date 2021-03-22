import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTestCompComponent } from './my-test-comp.component';

describe('MyTestCompComponent', () => {
  let component: MyTestCompComponent;
  let fixture: ComponentFixture<MyTestCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTestCompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTestCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
