import {Component, Injectable, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {toSqlDate} from '@smartstocktz/core-libs';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {PeriodDateRangeService} from '../services/period-date-range.service';


const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMM YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'smartstock-period-date-range',
  template: `
    <div class="d-flex flex-row justify-content-end ">
      <mat-form-field class="px-3" [hidden]="hidePeriod" appearance="outline">
        <mat-label>Sales By</mat-label>
        <mat-select [formControl]="periodFormControl">
          <mat-option value="day">Day</mat-option>
          <mat-option value="month">Month</mat-option>
          <mat-option value="year">Year</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field class="px-3" appearance="outline">
        <mat-label>Start Date</mat-label>
        <input matInput [matDatepicker]="dp" [min]="minDate" [max]="maxDate" [formControl]="fromDateFormControl"
               (dateChange)="chosenDayHandler($event, dp, 'startDate')">
        <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
        <mat-datepicker #dp
                        startView="multi-year"
                        (yearSelected)="chosenYearHandler($event, dp, 'startDate')"
                        (monthSelected)="chosenMonthHandler($event, dp, 'startDate')"
        >
        </mat-datepicker>
      </mat-form-field>
      <mat-form-field class="px-3" appearance="outline">
        <mat-label>End Date</mat-label>
        <input matInput [matDatepicker]="dp2" [min]="minDate" [max]="maxDate" [formControl]="toDateFormControl"
               (dateChange)="chosenDayHandler($event, dp, 'endDate')">
        <mat-datepicker-toggle matSuffix [for]="dp2"></mat-datepicker-toggle>
        <mat-datepicker #dp2
                        startView="multi-year"
                        (yearSelected)="chosenYearHandler($event, dp2, 'endDate')"
                        (monthSelected)="chosenMonthHandler($event, dp2, 'endDate')"
        >
        </mat-datepicker>
      </mat-form-field>
    </div>

  `,
  // styleUrls: ['../styles/sales-trends.style.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PeriodDateRangeComponent implements OnInit {
  dateRange: FormGroup;
  maxDate = new Date();
  minDate = new Date(new Date().setFullYear(2015));
  from = new Date(new Date().setDate(new Date().getDate() - 7));
  to = new Date();
 @ Input() hidePeriod = false;
 @ Input() setPeriod = 'day';

  fromDateFormControl = new FormControl(moment());
  toDateFormControl = new FormControl(moment());
  periodFormControl = new FormControl();
  constructor(private periodDateRangeService: PeriodDateRangeService) {
    // this.dateRange = new FormGroup({
    //   from: new FormControl(new Date(new Date().setDate(new Date().getDate() - 7))),
    //   to: new FormControl(new Date())
    // });
  }


  ngOnInit(): void {
    this.fromDateFormControl.setValue(this.hidePeriod ? (this.from.getFullYear() - 1).toString() : this.from);
    // this.fromDateFormControl.setValue(this.hidePeriod ? this.from.getFullYear() : this.from);
    this.toDateFormControl.setValue(this.to);
    console.log(this.from.getFullYear());
    this.periodFormControl.setValue(this.setPeriod);
    this.periodFormControl.valueChanges.subscribe(value => {
      this.periodDateRangeService.editPeriod(value);
    });
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<any>, selectedInput: string): any {
    if (selectedInput === 'startDate') {
      this.from = new Date(new Date().setFullYear(normalizedYear.year()));

      if (this.periodFormControl.value === 'year') {
        datepicker.close();
        this.from = new Date(new Date(this.from).setMonth(0));
        this.from = new Date(new Date(this.from).setDate(1));
        this.fromDateFormControl.setValue(this.hidePeriod === true ? normalizedYear.year() : this.from);
        this.periodDateRangeService.editStartDate(toSqlDate(this.from));
      }
    } else {
      this.to = new Date(new Date().setFullYear(normalizedYear.year()));
      if (this.periodFormControl.value === 'year') {
        datepicker.close();
        this.to = new Date(new Date(this.to).setMonth(12));
        this.to = new Date(new Date(this.to).setDate(1));
        this.to = new Date(new Date(this.to).setDate(new Date(this.to).getDate() - 1));
        this.toDateFormControl.setValue(this.hidePeriod === true ? this.to.getFullYear().toString() : this.to);
        this.periodDateRangeService.editEndDate(toSqlDate(this.to));
      }
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<any>, selectedInput: string): any {
    if (selectedInput === 'startDate') {
      this.from = new Date(new Date(this.from).setMonth(normalizedMonth.month()));
      if (this.periodFormControl.value === 'month') {
        datepicker.close();
        this.from = new Date(new Date(this.from).setDate(1));
        this.fromDateFormControl.setValue(this.from);
        this.periodDateRangeService.editStartDate(toSqlDate(this.from));
      }
    } else {
      this.to = new Date(new Date(this.to).setMonth(normalizedMonth.month()));
      if (this.periodFormControl.value === 'month') {
        datepicker.close();
        this.to = new Date(new Date(this.to).setDate(1));
        this.to = new Date(new Date(this.to).setDate(new Date(this.to).getDate() - 1));
        this.toDateFormControl.setValue(this.to);
        this.periodDateRangeService.editEndDate(toSqlDate(this.to));
      }
    }
  }

  chosenDayHandler(normalizedDate: any, datepicker: MatDatepicker<any>, selectedInput: string): any {
    normalizedDate = normalizedDate.target.value;

    if (selectedInput === 'startDate') {
      this.from = new Date(new Date(this.from).setDate(normalizedDate.date()));
      datepicker.close();
      this.fromDateFormControl.setValue(this.from);
      this.periodDateRangeService.editStartDate(toSqlDate(this.from));
    } else {
      this.to = new Date(new Date(this.to).setDate(normalizedDate.date()));
      datepicker.close();
      this.toDateFormControl.setValue(this.to);
      this.periodDateRangeService.editEndDate(toSqlDate(this.to));
    }
  }

}
