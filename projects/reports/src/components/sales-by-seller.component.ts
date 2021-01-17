import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {FormControl} from '@angular/forms';

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
  selector: 'smartstock-sales-by-seller',
  template: `
    <mat-card class="mat-elevation-z3" style="height: 100%;border-radius: 15px">
      <div class="row pt-3 m-0 justify-content-center align-items-center">
        <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">people</mat-icon>
        <p class="m-0 h6">Sales By Seller {{selectedYear}}</p>
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
        <div style="width: 100%; height: 100%" id="salesBySeller"></div>
        <smartstock-data-not-ready style="position: absolute" [width]="100" height="100"
                                   [isLoading]="salesStatusProgress"
                                   *ngIf="salesStatusProgress  || (!salesBySellerStatus)"></smartstock-data-not-ready>
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
export class SalesBySellerComponent implements OnInit {
  salesStatusProgress = false;
  salesBySellerStatus;
  salesBySellerChart: Highcharts.Chart = undefined;
  salesYearFormControl = new FormControl(moment());
  selectedYear = new Date().getFullYear();
  channel = 'retail';
  @Input() salesChannel;

  constructor(private readonly  report: ReportService,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    this.getSalesBySeller();
    this.salesChannel.subscribe(value => {
      this.channel = value;
      this.getSalesBySeller();
    });
  }

  // tslint:disable-next-line:typedef
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.salesYearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.salesYearFormControl.setValue(ctrlValue);
    datepicker.close();
    this.selectedYear = new Date(this.salesYearFormControl.value).getFullYear();
    this.getSalesBySeller();
  }

 capitalizeFirstLetter(data): any {
    return data[0].toUpperCase() + data.slice(1);
}
  // tslint:disable-next-line:typedef
  private getSalesBySeller() {
    this.salesStatusProgress = true;
    this.report.getSellerSales(this.selectedYear + '-01-01', this.selectedYear + '-12-31', this.channel).then(status => {
      this.salesStatusProgress = false;
      this.salesBySellerStatus = status;
      this.initiateGraph(this.salesBySellerStatus);
    }).catch(reason => {
      this.salesStatusProgress = false;
      this.logger.i(reason);
      // this.logger.i(reason, 'StockStatusComponent:26');
    });
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    const sellersData = {};
    const sellerSalesData = {
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
    if (this.selectedYear === new Date().getFullYear()) {
    let sellerSalesDataKeys = Object.keys(sellerSalesData);
    sellerSalesDataKeys = sellerSalesDataKeys.splice((new Date().getMonth()) + 1, 11 - (new Date().getMonth()));
    sellerSalesDataKeys.forEach(value => {
      delete sellerSalesData[value];
    });
    }
    data.forEach(val => {
        const seller = val.seller;

        if (seller){
          const convDate = new Date(val.date).getMonth();
       //   const id = seller;
          const id = this.capitalizeFirstLetter(seller.firstname.toString()) + ' ' + this.capitalizeFirstLetter(seller.lastname.toString());

          if (sellersData[id]){
            const amount = parseFloat(val.amount) + sellersData[id][Object.keys(sellerSalesData)[convDate]];
            sellersData[id][Object.keys(sellerSalesData)[convDate]] = parseFloat(amount);
          } else {
            const amount = val.amount;
            const sellerInfo = {...sellerSalesData};
            sellerInfo[Object.keys(sellerSalesData)[convDate]] = parseFloat(amount);
            sellersData[id] = sellerInfo;
          }
        }

        // const seller = val.seller;
        // if (seller) {
        //   const convDate = new Date(val.date).getMonth();
        //
        //   if (sellersData[seller.firstname + ' ' + seller.lastname]) {
        //     const amount = parseFloat(val.amount) + sellersData[seller.firstname + ' ' +
        //     seller.lastname][Object.keys(sellerSalesData)[convDate]];
        //     sellersData[seller.firstname + ' ' + seller.lastname][Object.keys(sellerSalesData)[convDate]] = parseFloat(amount);
        //   } else {
        //     const amount = val.amount;
        //     const sellerInfo = {...sellerSalesData};
        //     sellerInfo[Object.keys(sellerSalesData)[convDate]] = parseFloat(amount);
        //     const id = seller.firstname + ' ' + seller.lastname;
        //     sellersData[id] = sellerInfo;
        //   }
        // }
      }
    );
    // @ts-ignore
    this.salesBySellerChart = Highcharts.chart('salesBySeller', {
        chart: {
           type: 'areaspline',
          // height: 400,
          // width: 200
        },
        title: {
          text: null
        },
        // @ts-ignore
        xAxis: {
          categories: Object.keys(sellerSalesData),
          title: {
            text: this.selectedYear
          }
        },
        // @ts-ignore
        yAxis: {
          title: {
            text: null
          },
          // lineColor: '#1b5e20',
          labels: {
            // @ts-ignore
            formatter() {
              return this.value;
            }
          }
        },
        tooltip: {
          // pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
          pointFormat: '{series.name}: <br><b> Tzs {point.y:.1f}/=</b>'

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
        series: Object.keys(sellersData).map(key => {
          return {
            name: key,
            data: Object.values(Object.values(sellersData[key]))
          };
        }),
      }
    );
  }

}
