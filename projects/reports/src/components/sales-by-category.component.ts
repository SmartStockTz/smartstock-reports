import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {FormControl} from '@angular/forms';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'smartstock-sales-by-category',
  template: `
    <mat-card class="mat-elevation-z3" style="height: 100%;border-radius: 15px">
      <div class="row pt-3 m-0 justify-content-center align-items-center">
        <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">category</mat-icon>
        <p class="m-0 h6">Sales By Category in {{month}} {{selectedYear}}</p>
        <div class="row">
          <mat-form-field style="width: 50px;visibility: hidden">
            <!--            <mat-label>Year</mat-label>-->
            <input matInput hidden [matDatepicker]="dp" [formControl]="salesYearFormControl">
            <!--            <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>-->
            <mat-datepicker #dp
                            startView="multi-year"
                            (yearSelected)="chosenYearHandler($event)"
                            (monthSelected)="chosenMonthHandler($event, dp)"
                            >
            </mat-datepicker>
          </mat-form-field>
          <button mat-icon-button color="primary" class="mr-0 ml-auto" (click)="dp.open()" matTooltip="Select Year">
            <mat-icon>today</mat-icon>
          </button>
        </div>
      </div>
      <hr class="w-75 mt-0 mx-auto" color="primary">
      <div class="d-flex justify-content-center align-items-center py-3" style="min-height: 200px">
        <div style="width: 100%; height: 100%" id="salesByCategory"></div>
        <smartstock-data-not-ready style="position: absolute" [width]="100" height="100"
                                   [isLoading]="salesStatusProgress"
                                   *ngIf="salesStatusProgress  || (!salesByCategoryStatus)"></smartstock-data-not-ready>
      </div>
    </mat-card>
  `,
  styleUrls: ['../styles/sales-by-category.style.scss'],
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
export class SalesByCategoryComponent implements OnInit {
  salesStatusProgress = false;
  salesByCategoryStatus: { x: string; y: number }[];
  salesByCategoryChart: Highcharts.Chart = undefined;
  @Input() salesChannel;
  channel = 'retail';
  salesYearFormControl = new FormControl(moment());
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  totalSales = 0;
  month;
  sellerSalesData = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  constructor(
    private readonly report: ReportService,
    private readonly logger: LogService
  ) {}

  ngOnInit(): void {
    this.month = Object.keys(this.sellerSalesData)[this.selectedMonth];
    this.getSalesByCategory();
    this.salesChannel.subscribe((value) => {
      this.channel = value;
      this.getSalesByCategory();
    });
  }

  // tslint:disable-next-line:typedef
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.salesYearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.salesYearFormControl.setValue(ctrlValue);
    this.selectedYear = new Date(this.salesYearFormControl.value).getFullYear();
  }

  // tslint:disable-next-line:typedef
  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.salesYearFormControl.value;
    ctrlValue.month(normalizedMonth.month());
    this.salesYearFormControl.setValue(ctrlValue);
    this.selectedMonth = new Date(this.salesYearFormControl.value).getMonth();
    this.month = Object.keys(this.sellerSalesData)[this.selectedMonth];
    this.getSalesByCategory();
    datepicker.close();
  }

  // tslint:disable-next-line:typedef
  private getSalesByCategory() {
    this.salesStatusProgress = true;
    this.selectedMonth += 1;
    if (this.selectedMonth < 10) {
      // tslint:disable-next-line:radix
      this.selectedMonth = parseInt('0' + this.selectedMonth);
    }
    this.report.getSalesByCategory(this.channel, this.selectedYear + '-' + this.selectedMonth + '-01',
      this.selectedYear + '-' + this.selectedMonth + '-31').then(status => {
      this.salesStatusProgress = false;
      this.salesByCategoryStatus = status;
      console.log(status);
      this.initiateGraph(this.salesByCategoryStatus);
    }).catch(reason => {
      this.salesStatusProgress = false;
      this.logger.i(reason);
      // this.logger.i(reason, 'StockStatusComponent:26');
    });
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    const x = data.map((value) => value.sales);
    const y: any[] = data.map((value) => {
      return {
        y: value.y,
        name: value.x,
      };
    });
    // @ts-ignore
    this.salesByCategoryChart = Highcharts.chart('salesByCategory', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        events: {
          load(event) {
            const total = this.series[0].data[0].total;
            const text = this.renderer
              .text('Total: ' + total, this.plotLeft, this.plotHeight)
              .attr({
                zIndex: 5,
              })
              .add();
          },
        },
      },
      title: {
        text: null,
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
      },
      tooltip: {
        pointFormat:
          '{series.name}<br>: <b>{point.percentage:.1f}% </b><br><b>: {point.y}/=</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>',
          },
        },
      },
      series: [
        {
          name: '',
          colorByPoint: true,
          data: data.map((val) => {
            if (val.channel === this.channel) {
              return {
                name: val._id,
                y: val.sales,
                sliced: true,
                selected: true,
              };
            } else {
              return {
                name: val._id,
                y: 0,
                sliced: true,
                selected: true,
              };
            }
          }),
        },
      ],
    });
  }
}
