import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsnWorkspaceComponent } from './nsn-workspace.component';

describe('NsnWorkspaceComponent', () => {
  let component: NsnWorkspaceComponent;
  let fixture: ComponentFixture<NsnWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsnWorkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsnWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
