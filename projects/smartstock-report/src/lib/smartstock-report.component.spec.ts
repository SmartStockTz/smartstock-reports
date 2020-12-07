import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartstockReportComponent } from './smartstock-report.component';

describe('SmartstockReportComponent', () => {
  let component: SmartstockReportComponent;
  let fixture: ComponentFixture<SmartstockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartstockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartstockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
