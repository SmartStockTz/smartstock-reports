import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import {PeriodDateRangeState} from '../states/period-date-range.state';

//
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'DD MMM YYYY',
//   },
//   display: {
//     dateInput: 'DD MMM YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

@Component({
  selector: 'app-period-date-range',
  template: `
    <div class="container-fluid">
      <div class="row">
        <mat-form-field class="px-3 col-12 col-xl-4 col-lg-4 col-sm-12 col-md-4" [hidden]="hidePeriod"
                        appearance="outline">
          <mat-label>Sales By</mat-label>
          <mat-select [formControl]="periodFormControl">
            <mat-option value="day">Day</mat-option>
            <mat-option value="month">Month</mat-option>
            <mat-option value="year">Year</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field
          class="{{hidePeriod?'px-3 col-12 col-xl-6 col-lg-6 col-sm-12 col-md-6':'px-3 col-12 col-xl-4 col-lg-4 col-sm-12 col-md-4'}}"
          appearance="outline">
          <mat-label>Start Date</mat-label>
          <input [matDatepicker]="dp" matInput [min]="minDate" [max]="maxDate" [formControl]="fromDateFormControl">
          <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp [touchUi]="true"></mat-datepicker>
        </mat-form-field>
        <mat-form-field
          class="{{hidePeriod?'px-3 col-12 col-xl-6 col-lg-6 col-sm-12 col-md-6':'px-3 col-12 col-xl-4 col-lg-4 col-sm-12 col-md-4'}}"
          appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="dp2" [min]="minDate" [max]="maxDate" [formControl]="toDateFormControl">
          <mat-datepicker-toggle matSuffix [for]="dp2"></mat-datepicker-toggle>
          <mat-datepicker #dp2 [touchUi]="true"></mat-datepicker>
        </mat-form-field>
      </div>
      <div class="row">
        <button mat-raised-button class="mb-auto mt-1 p-1 col-12"
                color="primary"
                (click)="applyDateRange()">
          Load Report
        </button>
      </div>
    </div>

  `,
  styleUrls: [],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  // ],
})
export class PeriodDateRangeComponent implements OnInit, OnDestroy {
  dateRange: FormGroup;
  maxDate = new Date();
  minDate = new Date(new Date().setFullYear(2015));
  @Input() from = moment().subtract(7, 'days').toDate();
  @Input() to = new Date();
  @Input() hidePeriod = false;
  @Input() setPeriod = 'day';

  fromDateFormControl = new FormControl(moment().format('YYYY-MM-DD'));
  toDateFormControl = new FormControl(moment().format('YYYY-MM-DD'));
  periodFormControl = new FormControl();

  constructor(private periodDateRangeService: PeriodDateRangeState) {
    // this.dateRange = new FormGroup({
    //   from: new FormControl(new Date(new Date().setDate(new Date().getDate() - 7))),
    //   to: new FormControl(new Date())
    // });
  }

  ngOnDestroy(): void {
    this.periodDateRangeService.dateRange.next(null);
  }


  ngOnInit(): void {
    this.fromDateFormControl.setValue(this.from);
    // this.fromDateFormControl.setValue(this.hidePeriod ? this.from.getFullYear() : this.from);
    this.toDateFormControl.setValue(this.to);
    // console.log(this.from.getFullYear());
    this.periodFormControl.setValue(this.setPeriod);

  }

  applyDateRange(): void {
    this.periodDateRangeService.editDateRange({
      period: this.periodFormControl.value,
      startDate: moment(this.fromDateFormControl.value).toDate(),
      endDate: moment(this.toDateFormControl.value).toDate()
    });
  }
}
