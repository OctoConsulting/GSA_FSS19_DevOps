import { TestBed } from '@angular/core/testing';

import { NSNService } from './nsn.service';

describe('NSNService', () => {
  let service: NSNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NSNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
