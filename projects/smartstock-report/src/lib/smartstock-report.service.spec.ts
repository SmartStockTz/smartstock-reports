import { TestBed } from '@angular/core/testing';

import { SmartstockReportService } from './smartstock-report.service';

describe('SmartstockReportService', () => {
  let service: SmartstockReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartstockReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
