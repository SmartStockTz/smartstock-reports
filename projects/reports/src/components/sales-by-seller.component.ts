import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {FormControl, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {DatePipe} from '@angular/common';

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
    <div>
      <div class="row m-0 py-2" style="justify-content: space-evenly">
        <div class="col-md-11 col-lg-6 py-3">
          <mat-card class="mat-elevation-z3" style="border-radius: 15px; border-left: 5px solid green;">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">people</mat-icon>
              <p class="m-0 h6">Sales By Seller</p>
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
                                         *ngIf="salesStatusProgress  || (!salesBySellerData)"></smartstock-data-not-ready>
            </div>
          </mat-card>
        </div>
        <div class=" col-md-11 col-lg-6 py-3">
          <mat-card class="mat-elevation-z3">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">people</mat-icon>
              <p class=" mr-auto m-0 h6">Sales By Seller </p>
              <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
                <mat-icon>get_app</mat-icon>
              </button>
            </div>
            <hr class="w-75 mt-0 mx-auto" color="primary">
            <mat-card-header>
              <!--              <mat-form-field style="margin: 0 4px;">-->
              <!--                <mat-label>From date</mat-label>-->
              <!--                <input matInput (click)="startDatePicker.open()" [matDatepicker]="startDatePicker"-->
              <!--                       [formControl]="startDateFormControl">-->
              <!--                <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>-->
              <!--                <mat-datepicker #startDatePicker></mat-datepicker>-->
              <!--              </mat-form-field>-->
              <!--              <mat-form-field style="margin: 0 4px;">-->
              <!--                <mat-label>To date</mat-label>-->
              <!--                <input matInput (click)="endDatePicker.open()" [matDatepicker]="endDatePicker"-->
              <!--                       [formControl]="endDateFormControl">-->
              <!--                <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>-->
              <!--                <mat-datepicker #endDatePicker></mat-datepicker>-->
              <!--              </mat-form-field>-->
              <span style="flex-grow: 1;"></span>
              <mat-form-field>
                <mat-label>Filter</mat-label>
                <input matInput [formControl]="filterFormControl" placeholder="Eg. Piriton">
              </mat-form-field>
            </mat-card-header>

            <div style="display: flex; justify-content: center">
<!--              <mat-spinner *ngIf="salesStatusProgress"></mat-spinner>-->

              <smartstock-data-not-ready [width]="100" height="100" [isLoading]="salesStatusProgress"
                                         *ngIf="salesStatusProgress  || (!salesBySellerData)"></smartstock-data-not-ready>
            </div>
            <table *ngIf="!salesStatusProgress  && salesBySellerData" mat-table [dataSource]="salesBySellerData" matSort>

              <!--          <ng-container matColumnDef="product">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>-->
              <!--            <td mat-cell *matCellDef="let element">{{element._id}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->

              <ng-container matColumnDef="seller">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>
                <td mat-cell
                    *matCellDef="let element">{{element.sellerFirstname === null ? element.sellerId : element.sellerFirstname | titlecase}} {{element.sellerLastname | titlecase}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
                <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
                <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell *matCellDef="let element">{{element.date | date}}</td>
                <td mat-footer-cell *matFooterCellDef>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="salesBySellerColumns"></tr>
              <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                  *matRowDef="let row; columns: salesBySellerColumns;"></tr>
              <!--              <tr class="font-weight-bold" mat-footer-row style="font-size: 36px" *matFooterRowDef="salesBySellerColumns"></tr>-->

            </table>
            <mat-paginator [pageSizeOptions]="[5, 10, 20, 100]" showFirstLastButtons></mat-paginator>

          </mat-card>
        </div>
      </div>
      <mat-menu #exportMenu>
        <button mat-menu-item (click)="exportReport()">
          CSV
        </button>
      </mat-menu>
    </div>
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
  salesBySellerData: MatTableDataSource<any>;
  salesBySellerChart: Highcharts.Chart = undefined;
  salesYearFormControl = new FormControl(moment());
  selectedYear = new Date().getFullYear();
  salesBySellerColumns = ['seller', 'quantity', 'amount', 'date'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  period = 'day';

  // @Input() salesperiod;

  constructor(private readonly  report: ReportService,
              private readonly logger: LogService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.getSalesBySeller();
    // this.salesperiod.subscribe(value => {
    //   this.period = value;
    //   this.getSalesBySeller();
    // });

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.salesBySellerData.filter = filterValue.trim().toLowerCase();
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
    this.report.getSellerSales(this.selectedYear + '-01-01', this.selectedYear + '-12-31', this.period).then(data => {
      this.salesStatusProgress = false;
      this.salesBySellerData = new MatTableDataSource<any>(data);
      setTimeout(() => {
        this.salesBySellerData.paginator = this.paginator;
        this.salesBySellerData.sort = this.sort;
      });
      this.initiateGraph(data);
    }).catch(reason => {
      this.salesStatusProgress = false;
      this.logger.i(reason);
      // this.logger.i(reason, 'StockStatusComponent:26');
    });
  }

  exportReport(): void {
    const exportedDataColumns = ['seller', 'quantity', 'amount', 'date'];
    json2csv('profit_by_category.csv', exportedDataColumns, this.salesBySellerData.filteredData).catch();
  }


  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    const sellersData = {};
    const saleDays = [];
    const totalSales = [];
    Object.keys(data).forEach(key => {
      const seller = data[key].sellerId;
      let id;

        if (this.period === 'day') {
          if (!saleDays.includes(this.datePipe.transform(data[key].date, 'dd MMM YYYY'))) {
            saleDays.push(this.datePipe.transform(data[key].date, 'dd MMM YYYY'));
          }
        } else if (this.period === 'month') {
          if (!saleDays.includes(this.datePipe.transform(data[key].date, 'MMM YYYY'))) {
            saleDays.push(this.datePipe.transform(data[key].date, 'MMM YYYY'));
          }
        } else {
          if (!saleDays.push(data[key].date)) {
            saleDays.push(data[key].date);
          }
        }
      if (data[key].sellerFirstname === null) {
        id = seller;
      } else {
        id = this.capitalizeFirstLetter(data[key].sellerFirstname.toString()) + ' '
          + this.capitalizeFirstLetter(data[key].sellerLastname.toString());
      }
      if (sellersData[id]) {
        let tempData = [];
        if (sellersData[id].length > 0) {
          tempData = sellersData[id];
        }
        tempData.push(data[key].amount);
        sellersData[id] = tempData;
      } else {
        const tempData = [];
        tempData.push(data[key].amount);
        sellersData[id] = tempData;
      }
    });

    data.forEach(val => {
        const seller = val.sellerId;
        let id;

        if (val.sellerFirstname === null) {
          id = seller;
        } else {
          id = this.capitalizeFirstLetter(val.sellerFirstname.toString()) + ' '
            + this.capitalizeFirstLetter(val.sellerLastname.toString());
        }
        // sellersData[id] = [].push(val.amount);

        // if (seller) {
        //   if (sellersData[id]) {
        //     sellersData[id] = [].push(val.amount);
        //   } else {
        //   }
        // }
        // const seller = val.seller;

        // if (sellersData[id]) {
        //   // const amount = parseFloat(val.amount) + sellersData[seller.firstname + ' ' +
        //   // seller.lastname][Object.keys(sellerSalesData)[id]];
        //   sellersData[id] = [].map(ser => {
        //    ser = val.amount;
        //   });
        // } else {
        //   const sellerInfo = {...sellersData};
        //   sellerInfo[id] = parseFloat(val.amount);
        //   sellersData[id] = sellerInfo;
        // }
      }
    );
    console.log(totalSales);
    console.log(sellersData);

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
          categories: saleDays,
          // title: {
          //   text: this.selectedYear
          // }
        },
        // @ts-ignore
        yAxis: {
          title: {
            text: null
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
        series: Object.keys(sellersData).map(key => {
          return {
            name: key,
            data: sellersData[key]
          };
        }),
      }
    );
  }

}
