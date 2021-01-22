import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as Highcharts from 'highcharts';
import {toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CartModel} from '../models/cart.model';
import {json2csv} from '../services/json2csv.service';
import {DatePipe} from '@angular/common';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

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

@Component({
  selector: 'smartstock-report-sale-trends',
  template: `
    <div class="col-12" style="margin-top: 1em">
      <div class="row col-lg-11 mx-auto pt-3 justify-content-end ">
        <mat-form-field appearance="outline">
          <mat-label>Sales By</mat-label>
          <mat-select [formControl]="period" value="retail">
            <mat-option value="day">Day</mat-option>
            <mat-option value="month">Month</mat-option>
            <mat-option value="year">Year</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="row m-0">
        <mat-form-field class="px-3 mx-auto" appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="dp" [min]="minDate" [max]="maxDate" [formControl]="salesTrendDayFromDateFormControl">
          <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp
                          startView="multi-year"
                          (yearSelected)="chosenYearHandler($event, dp, 'startDate')"
                          (monthSelected)="chosenMonthHandler($event, dp, 'startDate')"
                          (daySelected)="chosenDayHandler($event, dp, 'startDate')"
          >
          </mat-datepicker>
        </mat-form-field>
        <mat-form-field class="mx-auto" appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="dp2" [min]="minDate" [max]="maxDate" [formControl]="salesTrendDayToDateFormControl">
          <mat-datepicker-toggle matSuffix [for]="dp2"></mat-datepicker-toggle>
          <mat-datepicker #dp2
                          startView="multi-year"
                          (yearSelected)="chosenYearHandler($event, dp2, 'endDate')"
                          (monthSelected)="chosenMonthHandler($event, dp2, 'endDate')"
                          (daySelected)="chosenDayHandler($event, dp2, 'endDate')"
          >
          </mat-datepicker>
        </mat-form-field>
        </div>
        <!--        <mat-form-field class="px-3" appearance="outline">-->
        <!--          <mat-label>Select Date Range</mat-label>-->
        <!--          <mat-date-range-input-->
        <!--            [formGroup]="dateRange"-->
        <!--            [rangePicker]="dateRangePicker">-->
        <!--            <input matStartDate placeholder="Start date" formControlName="from">-->
        <!--            <input matEndDate placeholder="End date" formControlName="to">-->
        <!--          </mat-date-range-input>-->
        <!--          <mat-datepicker-toggle matSuffix [for]="dateRangePicker"></mat-datepicker-toggle>-->
        <!--          <mat-date-range-picker #dateRangePicker></mat-date-range-picker>-->
        <!--        </mat-form-field>-->
        <!--        <button (click)="refreshTrendReport()" [disabled]="salesByDayTrendProgress" mat-flat-button-->
        <!--                class="ft-button dashboard-refresh-button" color="primary">-->
        <!--          <mat-icon *ngIf="!salesByDayTrendProgress">refresh</mat-icon>-->
        <!--          <mat-progress-spinner *ngIf="salesByDayTrendProgress" style="display: inline-block"-->
        <!--                                mode="indeterminate"-->
        <!--                                [diameter]="15" color="primary">-->
        <!--          </mat-progress-spinner>-->
        <!--        </button>-->
      </div>
      <div class="row m-0 py-2">
        <div class="col-lg-5 py-3">
          <mat-card class="mat-elevation-z3">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">trending_up</mat-icon>
              <p class="mr-auto my-0 h6">Cart Report</p>
              <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
                <mat-icon>get_app</mat-icon>
              </button>
            </div>
            <hr class="w-75 mt-0 mx-auto" color="primary">

            <div style="display: flex; flex-flow: row; align-items: center">
              <!--            <h6 class="col-8">Cart Report</h6>-->
              <span style="flex-grow: 1"></span>
            </div>
            <mat-card-header>
              <div>
                <!--                <mat-form-field style="margin-right: 8px">-->
                <!--                  <mat-label>From Date</mat-label>-->
                <!--                  <input matInput [matDatepicker]="pickerFromSaleTrendDay" [formControl]="salesTrendDayFromDateFormControl">-->
                <!--                  <mat-datepicker-toggle matSuffix [for]="pickerFromSaleTrendDay"></mat-datepicker-toggle>-->
                <!--                  <mat-datepicker [touchUi]="true" #pickerFromSaleTrendDay></mat-datepicker>-->
                <!--                </mat-form-field>-->
                <!--                <mat-form-field>-->
                <!--                  <mat-label>To Date</mat-label>-->
                <!--                  <input matInput [matDatepicker]="pickerToSaleTrendDay" [formControl]="salesTrendDayToDateFormControl">-->
                <!--                  <mat-datepicker-toggle matSuffix [for]="pickerToSaleTrendDay"></mat-datepicker-toggle>-->
                <!--                  <mat-datepicker [touchUi]="true" #pickerToSaleTrendDay></mat-datepicker>-->
                <!--                </mat-form-field>-->
                <!--                <button (click)="refreshTrendReport()" [disabled]="salesByDayTrendProgress" mat-flat-button-->
                <!--                        class="ft-button dashboard-refresh-button" color="primary">-->
                <!--                  <mat-icon *ngIf="!salesByDayTrendProgress">refresh</mat-icon>-->
                <!--                  <mat-progress-spinner *ngIf="salesByDayTrendProgress" style="display: inline-block"-->
                <!--                                        mode="indeterminate"-->
                <!--                                        [diameter]="15" color="primary">-->
                <!--                  </mat-progress-spinner>-->
                <!--                </button>-->
              </div>

            </mat-card-header>


            <div style="display: flex; justify-content: center">
              <mat-spinner *ngIf="isLoading"></mat-spinner>
            </div>

            <smartstock-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></smartstock-data-not-ready>

            <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="salesData" matSort>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell
                    *matCellDef="let element">{{period.value === 'day' ? (element.id | date: 'dd MMM YYYY') : period.value === 'month' ? (element.id | date: 'MMM YYYY') : (element.id)}}</td>
                <td mat-footer-cell *matFooterCellDef> Total </td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
                <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
                <td mat-footer-cell *matFooterCellDef> {{totalSales | currency: ' '}}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="salesColumns"></tr>
              <tr matTooltip="{{row}}" class="table-data-row" mat-row
                  *matRowDef="let row; columns: salesColumns;"></tr>
              <tr class="font-weight-bold" mat-footer-row *matFooterRowDef="salesColumns"></tr>


            </table>
            <mat-paginator [pageSizeOptions]="[5, 10, 20, 100]" showFirstLastButtons></mat-paginator>
          </mat-card>
        </div>
        <div class="col-lg-7 py-3">
          <mat-card class="mat-elevation-z3">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">trending_up</mat-icon>
              <p class="m-0 h6">Daily Sales</p>
            </div>
            <hr class="w-75 mt-0 mx-auto" color="primary">
            <!--            <div class="d-flex flex-row flex-wrap btn-block align-items-center">-->
            <!--              <span class="flex-grow-1"></span>-->
            <!--              <div>-->
            <!--                <mat-form-field style="margin-right: 8px">-->
            <!--                  <mat-label>From Date</mat-label>-->
            <!--                  <input matInput [matDatepicker]="pickerFromSaleTrendDay" [formControl]="salesTrendDayFromDateFormControl">-->
            <!--                  <mat-datepicker-toggle matSuffix [for]="pickerFromSaleTrendDay"></mat-datepicker-toggle>-->
            <!--                  <mat-datepicker [touchUi]="true" #pickerFromSaleTrendDay></mat-datepicker>-->
            <!--                </mat-form-field>-->
            <!--                <mat-form-field>-->
            <!--                  <mat-label>To Date</mat-label>-->
            <!--                  <input matInput [matDatepicker]="pickerToSaleTrendDay" [formControl]="salesTrendDayToDateFormControl">-->
            <!--                  <mat-datepicker-toggle matSuffix [for]="pickerToSaleTrendDay"></mat-datepicker-toggle>-->
            <!--                  <mat-datepicker [touchUi]="true" #pickerToSaleTrendDay></mat-datepicker>-->
            <!--                </mat-form-field>-->
            <!--                <button (click)="refreshTrendReport()" [disabled]="salesByDayTrendProgress" mat-flat-button-->
            <!--                        class="ft-button dashboard-refresh-button" color="primary">-->
            <!--                  <mat-icon *ngIf="!salesByDayTrendProgress">refresh</mat-icon>-->
            <!--                  <mat-progress-spinner *ngIf="salesByDayTrendProgress" style="display: inline-block"-->
            <!--                                        mode="indeterminate"-->
            <!--                                        [diameter]="15" color="primary">-->
            <!--                  </mat-progress-spinner>-->
            <!--                </button>-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="row">
              <div class="col-12">
                <!--<mat-card>-->
                <div id="salesTrendByDay"></div>
                <smartstock-data-not-ready [isLoading]="isLoading"
                                           *ngIf="noDataRetrieved || isLoading"></smartstock-data-not-ready>
                <!--<smartstock-data-not-ready></smartstock-data-not-ready>-->
                <!--</mat-card>-->
              </div>
            </div>
          </mat-card>

        </div>
      </div>

    </div>
    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()">
        CSV
      </button>
    </mat-menu>
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
export class SalesTrendsComponent implements OnInit {
  salesTrendDayFromDateFormControl = new FormControl(moment());
  salesTrendDayToDateFormControl = new FormControl(moment());
  salesByDayTrendProgress = false;
  trendChart: Highcharts.Chart = undefined;
  period = new FormControl('day');
  isLoading = false;
  noDataRetrieved = true;
  salesData: MatTableDataSource<CartModel>;
  salesColumns = ['date', 'amount'];
  dateRange: FormGroup;
  maxDate = new Date();
  minDate = new Date(new Date().setFullYear(2015));
  from = new Date(new Date().setDate(new Date().getDate() - 7));
  to = new Date();
  totalSales = 0;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly reportService: ReportService,
    private datePipe: DatePipe,
  ) {
    this.dateRange = new FormGroup({
      from: new FormControl(new Date(new Date().setDate(new Date().getDate() - 7))),
      to: new FormControl(new Date())
    });
  }


  ngOnInit(): void {
    this.salesTrendDayFromDateFormControl.setValue(this.from);
    this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
      toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);
    this.period.valueChanges.subscribe(value => {
      this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
        toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);
    });
  }

  // tslint:disable-next-line:typedef
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>, selectedInput: string) {
    if (selectedInput === 'startDate') {
      this.from = new Date(new Date().setFullYear(normalizedYear.year()));

      if (this.period.value === 'year') {
        datepicker.close();
        this.from = new Date(new Date(this.from).setMonth(0));
        this.from = new Date(new Date(this.from).setDate(1));
        this.salesTrendDayFromDateFormControl.setValue(this.from);
        this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
          toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);
      }
    } else {
      this.to = new Date(new Date().setFullYear(normalizedYear.year()));
      if (this.period.value === 'year') {
        datepicker.close();
        this.to = new Date(new Date(this.to).setMonth(12));
        this.to = new Date(new Date(this.to).setDate(1));
        this.to = new Date(new Date(this.to).setDate(new Date(this.to).getDate() - 1));
        this.salesTrendDayToDateFormControl.setValue(this.to);
        this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
          toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);

      }
    }
  }

  // tslint:disable-next-line:typedef
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, selectedInput: string) {
    if (selectedInput === 'startDate') {
      this.from = new Date(new Date(this.from).setMonth(normalizedMonth.month()));
      if (this.period.value === 'month') {
        datepicker.close();
        this.from = new Date(new Date(this.from).setDate(1));
        this.salesTrendDayFromDateFormControl.setValue(this.from);
        this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
          toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);

      }
    } else {
      this.to = new Date(new Date(this.to).setMonth(normalizedMonth.month() + 1));
      if (this.period.value === 'month') {
        datepicker.close();
        this.to = new Date(new Date(this.to).setDate(1));
        this.to = new Date(new Date(this.to).setDate(new Date(this.to).getDate() - 1));
        this.salesTrendDayToDateFormControl.setValue(this.to);
        this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
          toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);
      }
    }
  }

  // tslint:disable-next-line:typedef
  chosenDayHandler(normalizedDate: Moment, datepicker: MatDatepicker<Moment>, selectedInput: string) {
    if (selectedInput === 'startDate') {
      this.from = new Date(new Date(this.from).setDate(normalizedDate.date()));
      datepicker.close();
      this.salesTrendDayFromDateFormControl.setValue(this.from);
      this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
        toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);

    } else {
      this.to = new Date(new Date(this.to).setDate(normalizedDate.date()));
      datepicker.close();
      this.salesTrendDayToDateFormControl.setValue(this.to);
      this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
        toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.period.value);
    }
  }

  private _listenForDateChange(): void {
    this.salesTrendDayFromDateFormControl.valueChanges.subscribe(value => {
      this.refreshTrendReport();
    });
    this.salesTrendDayToDateFormControl.valueChanges.subscribe(value => {
      this.refreshTrendReport();
    });
  }

  private _getSalesTrend(from: string, to: string, period: string): void {
    this.isLoading = true;
    this.salesByDayTrendProgress = true;
    this.reportService.getSalesOverview(from, to, this.period.value).then(value => {
      this.isLoading = false;
      this.noDataRetrieved = false;
      this.initiateGraph(value);
      this.salesData = new MatTableDataSource(value);
      this.totalSales = value.map(t => t.amount).reduce((acc, data) => acc + data, 0);
      setTimeout(() => {
        this.salesData.paginator = this.paginator;
        this.salesData.sort = this.sort;
      });
      this.salesByDayTrendProgress = false;
    }).catch(reason => {
      this.isLoading = false;
      this.noDataRetrieved = true;
      // console.log(reason);
      this.salesByDayTrendProgress = false;
    });
  }


  exportReport(): void {
    const exportedDataCartColumns = ['_id', 'amount', 'quantity', 'seller', 'date'];
    json2csv('cart_report.csv', exportedDataCartColumns, this.salesData.filteredData).catch(reason => {
    });
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    const saleDays = [];
    const totalSales = [];
    Object.keys(data).forEach(key => {
      if (this.period.value === 'day') {
        saleDays.push(this.datePipe.transform(data[key].id, 'dd MMM YYYY'));
      } else if (this.period.value === 'month') {
        saleDays.push(this.datePipe.transform(data[key].id, 'MMM YYYY'));
      } else {
        saleDays.push(data[key].id);
      }
      totalSales.push(data[key].amount);
    });
    // @ts-ignore
    this.trendChart = Highcharts.chart('salesTrendByDay', {
      chart: {
        type: 'column'
      },
      title: {
        text: null
      },
      // @ts-ignore
      xAxis: {
        // allowDecimals: false,
        categories: saleDays,
        title: {
          text: this.period.value.charAt(0).toUpperCase() + this.period.value.substr(1)
        },
        labels: {
          // tslint:disable-next-line:typedef
          formatter() {
            return this.value;
          }
        }
      },
      // @ts-ignore
      yAxis: {
        title: {
          text: 'Total Sales'
        },
        // lineColor: '#1b5e20',
        labels: {
          // tslint:disable-next-line:typedef
          formatter() {
            return this.value;
          }
        }
      },
      tooltip: {
        // pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
      },
      plotOptions: {
        // area: {
        //   // pointStart: saleDays[0],
        //   marker: {
        //     enabled: false,
        //     symbol: 'circle',
        //     radius: 4,
        //     states: {
        //       hover: {
        //         enabled: true
        //       }
        //     }
        //   }
        // }


      },
      legend: {
        enabled: false
      },
      // @ts-ignore
      series: [{
        name: 'Sales',
        color: '#0b2e13',
        data: totalSales
      }]
    });
  }

  // tslint:disable-next-line:typedef
  refreshTrendReport() {
    this._getSalesTrend(toSqlDate(new Date(this.dateRange.value.from)),
      toSqlDate(new Date(this.dateRange.value.to)), this.period.value);
  }
}
