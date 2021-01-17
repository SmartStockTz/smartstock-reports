import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import * as Highcharts from 'highcharts';
import {toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';

@Component({
  selector: 'smartstock-report-sale-trends',
  template: `
    <div class="col-12" style="margin-top: 1em">
      <mat-card class="mat-elevation-z3">
        <div class="row pt-3 m-0 justify-content-center align-items-center">
          <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">trending_up</mat-icon>
          <p class="m-0 h6">Daily Sales Trends</p>
        </div>
        <hr class="w-75 mt-0 mx-auto" color="primary">
        <div class="d-flex flex-row flex-wrap btn-block align-items-center">
          <span class="flex-grow-1"></span>
          <div>
            <mat-form-field style="margin-right: 8px">
              <mat-label>From Date</mat-label>
              <input matInput [matDatepicker]="pickerFromSaleTrendDay" [formControl]="salesTrendDayFromDateFormControl">
              <mat-datepicker-toggle matSuffix [for]="pickerFromSaleTrendDay"></mat-datepicker-toggle>
              <mat-datepicker [touchUi]="true" #pickerFromSaleTrendDay></mat-datepicker>
            </mat-form-field>
            <mat-form-field>
              <mat-label>To Date</mat-label>
              <input matInput [matDatepicker]="pickerToSaleTrendDay" [formControl]="salesTrendDayToDateFormControl">
              <mat-datepicker-toggle matSuffix [for]="pickerToSaleTrendDay"></mat-datepicker-toggle>
              <mat-datepicker [touchUi]="true" #pickerToSaleTrendDay></mat-datepicker>
            </mat-form-field>
            <button (click)="refreshTrendReport()" [disabled]="salesByDayTrendProgress" mat-flat-button
                    class="ft-button dashboard-refresh-button" color="primary">
              <mat-icon *ngIf="!salesByDayTrendProgress">refresh</mat-icon>
              <mat-progress-spinner *ngIf="salesByDayTrendProgress" style="display: inline-block"
                                    mode="indeterminate"
                                    [diameter]="15" color="primary">
              </mat-progress-spinner>
            </button>
          </div>
        </div>

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
  `,
  // styleUrls: ['../styles/sales-trends.style.scss']
})
export class SalesTrendsComponent implements OnInit {
  salesTrendDayFromDateFormControl = new FormControl();
  salesTrendDayToDateFormControl = new FormControl();
  salesByDayTrendProgress = false;
  trendChart: Highcharts.Chart = undefined;
  channel = 'retail';
  isLoading = false;
  noDataRetrieved = true;
  @Input() salesChannel;

  constructor(
    private readonly reportService: ReportService,
  ) {
  }

  ngOnInit(): void {
    const date = new Date();
    const fromDate = new Date(new Date().setDate(date.getDate() - 7));
    this.salesTrendDayFromDateFormControl.setValue(fromDate);
    this.salesTrendDayToDateFormControl.setValue(date);
    this._getSalesTrend(toSqlDate(fromDate), toSqlDate(date), this.channel);
    this._listenForDateChange();
    this.salesChannel.subscribe(value => {
      this.channel = value;
      this._getSalesTrend(toSqlDate(fromDate), toSqlDate(date), value);
    });
  }

  private _listenForDateChange(): void {
    this.salesTrendDayFromDateFormControl.valueChanges.subscribe(value => {
      this.refreshTrendReport();
    });
    this.salesTrendDayToDateFormControl.valueChanges.subscribe(value => {
      this.refreshTrendReport();
    });
  }

  private _getSalesTrend(from: string, to: string, channel: string): void {
    this.isLoading = true;
    this.salesByDayTrendProgress = true;
    this.reportService.getSalesTrend(from, to, channel).then(value => {
      this.isLoading = false;
      this.noDataRetrieved = false;
      this.initiateGraph(value);
      this.salesByDayTrendProgress = false;
    }).catch(reason => {
      this.isLoading = false;
      this.noDataRetrieved = true;
      // console.log(reason);
      this.salesByDayTrendProgress = false;
    });
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    const saleDays = [];
    const totalSales = [];
    Object.keys(data).forEach(key => {
      saleDays.push(data[key]._id);
      totalSales.push(data[key].total);
    });
    // @ts-ignore
    this.trendChart = Highcharts.chart('salesTrendByDay', {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: null
      },
      // @ts-ignore
      xAxis: {
        // allowDecimals: false,
        categories: saleDays,
        title: {
          text: 'Day'
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
    this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
      toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)), this.channel);
  }
}
