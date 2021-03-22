import { TestBed } from '@angular/core/testing';

import { NsnWorkspaceService } from './nsn-workspace.service';

describe('NsnWorkspaceService', () => {
  let service: NsnWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NsnWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
