import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'smartstock-sales-growth',
  template: `
    <mat-card class="mat-elevation-z3" style="border-radius: 15px; border-left: 5px solid green;">
      <div class="row pt-3 m-0 justify-content-center align-items-center">
        <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">trending_up</mat-icon>
        <p class="m-0 h6">Sales Growth in {{selectedYear}}</p>
        <div class="row">
          <mat-form-field style="width: 50px;visibility: hidden">
            <!--            <mat-label>Year</mat-label>-->
            <input matInput hidden [matDatepicker]="dp" [formControl]="salesYearFormControl">
            <!--            <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>-->
            <mat-datepicker #dp
                            startView="multi-year"
                            (yearSelected)="chosenYearHandler($event,dp)"
                            panelClass="example-month-picker">
            </mat-datepicker>
          </mat-form-field>
          <button mat-icon-button color="primary" class="mr-0 ml-auto" (click)="dp.open()" matTooltip="Select Year">
            <mat-icon>today</mat-icon>
          </button>
        </div>
      </div>

      <hr class="w-75 mt-0 mx-auto" color="primary">
      <div class="d-flex justify-content-center align-items-center py-3" style="min-height: 200px">
        <div style="width: 100%; height: 100%" id="salesGrowth"></div>
        <smartstock-data-not-ready style="position: absolute" [width]="100" height="100"
                                   [isLoading]="salesStatusProgress"
                                   *ngIf="salesStatusProgress  || (!salesGrowthStatus)"></smartstock-data-not-ready>
      </div>
    </mat-card>
  `,
  styleUrls: ['../styles/sales-growth.style.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class SalesGrowthComponent implements OnInit {
  salesStatusProgress = false;
  salesGrowthStatus: { x: string, y: number }[];
  salesGrowthChart: Highcharts.Chart = undefined;
  salesYearFormControl = new FormControl(moment());
  selectedYear = new Date().getFullYear();
  channel = 'retail';
  @Input() salesChannel;

  constructor(private readonly  report: ReportService,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    // console.log(this.startDateFormControl);
    this.getSalesStatus(this.channel, this.selectedYear);
    this.salesChannel.subscribe(value => {
      this.channel = value;
      this.getSalesStatus(value, this.selectedYear);
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.salesYearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.salesYearFormControl.setValue(ctrlValue);
    datepicker.close();
    this.selectedYear = new Date(this.salesYearFormControl.value).getFullYear();
    this.getSalesStatus(this.channel, this.selectedYear);
  }

  // tslint:disable-next-line:typedef
  private getSalesStatus(channel: string, year: number) {
    this.salesStatusProgress = true;
    this.report.getSalesOverview(year + '-01-01', year + '-12-31', channel).then(status => {
      this.salesStatusProgress = false;
      this.salesGrowthStatus = status;
      this.initiateGraph(this.salesGrowthStatus);
    }).catch(reason => {
      this.salesStatusProgress = false;
      this.logger.i(reason);
    });
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    let monthSalesData = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0
    };
    if(this.selectedYear === new Date().getFullYear()){
    let monthSalesDataKeys = Object.keys(monthSalesData);
     monthSalesDataKeys = monthSalesDataKeys.splice((new Date().getMonth()) +1,11 - (new Date().getMonth()));
    	monthSalesDataKeys.forEach(value =>{
    		delete monthSalesData[value];
    	});
    }

    data.forEach(val => {
        const convDate = new Date(val._id).getMonth();
        monthSalesData[Object.keys(monthSalesData)[convDate]] += parseFloat(val.total);
      }
    );
    // @ts-ignore
    this.salesGrowthChart = Highcharts.chart('salesGrowth', {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: null
      },
      // @ts-ignore
      xAxis: {
        // allowDecimals: false,
        categories: Object.keys(monthSalesData),
        title: {
          text: this.selectedYear
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
        pointFormat: '{series.name} <b>Tzs {point.y:,.0f}/=</b>'
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
           series: {
            fillOpacity: 0
        }
      },
      legend: {
        enabled: false
      },
      // @ts-ignore
      series: [{
        name: 'Sales',
        color: '#0b2e13',
        data: Object.values(monthSalesData)
      }]
    });
  }
}
