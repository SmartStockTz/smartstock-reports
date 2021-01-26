import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {MatDatepicker} from '@angular/material/datepicker';
import {FormControl, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {DatePipe} from '@angular/common';
import {PeriodDateRangeService} from '../services/period-date-range.service';

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
              <span style="flex-grow: 1;"></span>
              <mat-form-field>
                <mat-label>Filter</mat-label>
                <input matInput [formControl]="filterFormControl" placeholder="Eg. Piriton">
              </mat-form-field>
            </mat-card-header>

            <div style="display: flex; justify-content: center">

              <smartstock-data-not-ready [width]="100" height="100" [isLoading]="salesStatusProgress"
                                         *ngIf="salesStatusProgress  || (!salesBySellerData)"></smartstock-data-not-ready>
            </div>
            <table *ngIf="!salesStatusProgress  && salesBySellerData" mat-table [dataSource]="salesBySellerData" matSort>

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
                <td mat-cell
                    *matCellDef="let element">{{period === 'day' ? (element.date | date: 'dd MMM YYYY') : period === 'month' ? (element.date | date: 'MMM YYYY') : (element.date)}}
                </td>
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

})
export class SalesBySellerComponent implements OnInit {
  salesStatusProgress = false;
  salesBySellerData: MatTableDataSource<any>;
  salesBySellerChart: Highcharts.Chart = undefined;
  selectedYear = new Date().getFullYear();
  salesBySellerColumns = ['seller', 'quantity', 'amount', 'date'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  period = 'day';
  startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  endDate = toSqlDate(new Date());

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private readonly  report: ReportService,
              private readonly logger: LogService,
              private datePipe: DatePipe,
              private periodDateRangeService: PeriodDateRangeService) {
  }

  ngOnInit(): void {
    this.getSalesBySeller();
    this.periodDateRangeService.castPeriod.subscribe((value) => {
      if (value) {
        this.period = value;
        this.getSalesBySeller();
      }
    });
    this.periodDateRangeService.castStartDate.subscribe((value) => {
      if (value) {
        this.startDate = value;
        this.getSalesBySeller();
      }
    });
    this.periodDateRangeService.castEndDate.subscribe((value) => {
      if (value) {
        this.endDate = value;
        this.getSalesBySeller();
      }
    });


    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.salesBySellerData.filter = filterValue.trim().toLowerCase();
    });
  }

  capitalizeFirstLetter(data): any {
    return data[0].toUpperCase() + data.slice(1);
  }

  // tslint:disable-next-line:typedef
  private getSalesBySeller() {
    this.salesStatusProgress = true;
    this.report.getSellerSales(this.startDate, this.endDate, this.period).then(data => {
      this.salesStatusProgress = false;
      this.salesBySellerData = new MatTableDataSource<any>(data);
      setTimeout(() => {
        this.salesBySellerData.paginator = this.paginator;
        this.salesBySellerData.sort = this.sort;
      });

      // @ts-ignore
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
  private initiateGraph(data: [{ sellerFirstname: any, sellerLastname: any, sellerId: any, quantity: any, amount: any, date: any }]) {
    const days = new Set();
    const sellersIds = new Set();
    const sellersData = {};

    Object.keys(data).forEach(key => {
      days.add(data[key].date);
      let id;
      // @ts-ignore
      if (data[key].sellerFirstname === null) {
        id = data[key].sellerId;
      } else {
        id = this.capitalizeFirstLetter(data[key].sellerFirstname.toString()) + ' '
          + this.capitalizeFirstLetter(data[key].sellerLastname.toString());
      }
      sellersIds.add({name: id, id: data[key].sellerId});
    });

    sellersIds.forEach((seller: { name, id }) => {
      const tempDataArray = [];
      days.forEach(date => {
        const filterdSales = Object.values(data).filter(value => value.date === date && value.sellerId === seller.id);
        if (filterdSales && filterdSales.length === 1) {
          // const tempData = new Map();
          tempDataArray.push(filterdSales[0].amount);
        } else {
          // const tempData = new Map();
          tempDataArray.push(0);
        }
        // Object.values(data).forEach(value => {
        //   if (value.sellerFirstname === null) {
        //     id = value.sellerId;
        //   } else {
        //     id = this.capitalizeFirstLetter(value.sellerFirstname.toString()) + ' '
        //       + this.capitalizeFirstLetter(value.sellerLastname.toString());
        //   }
        //   if (value.date === date) {
        //     if (sellersData[id]) {
        //       const tempData = new Map();
        //       let tempDataArray = [];
        //       if (sellersData[id].length > 0) {
        //         tempDataArray = sellersData[id];
        //       }
        //       tempData.set(date, value.amount);
        //       tempDataArray.push(tempData);
        //       sellersData[id] = tempDataArray;
        //     } else {
        //       const tempData = new Map();
        //       const tempDataArray = [];
        //       tempData.set(date, value.amount);
        //       tempDataArray.push(tempData);
        //       sellersData[id] = tempDataArray;
        //     }
        //   } else {
        //     if (sellersData[id]) {
        //       const tempData = new Map();
        //       let tempDataArray = [];
        //       if (sellersData[id].length > 0) {
        //         tempDataArray = sellersData[id];
        //       }
        //       tempData.set(date, 0);
        //       tempDataArray.push(tempData);
        //       sellersData[id] = tempDataArray;
        //     } else {
        //       const tempData = new Map();
        //       const tempDataArray = [];
        //       tempData.set(date, 0);
        //       tempDataArray.push(tempData);
        //       sellersData[id] = tempDataArray;
        //     }
        //   }
        // });
        // sellersData[id] =
      });
      sellersData[seller.name as string] = tempDataArray;
    });
    let index = 0;
    const saleDays = [];
    days.forEach(date => {
        if (this.period === 'day') {
          days[index] = this.datePipe.transform(date.toString(), 'dd MMM YYYY');
        } else if (this.period === 'month') {
          days[index] = this.datePipe.transform(date + '/21', 'MMM YYYY');
        } else {
          days[index] = date;
        }
        index++;
      }
    );

    console.log(days);
    console.log(sellersData);
    const totalSales = [];
    //
    // // console.log(data);
    // let sellerDateAmountObj = {};
    // Object.values(data).forEach(element => {
    //   console.log(element);
    //   let id;
    //   // @ts-ignore
    //   if (element.sellerFirstname === null) {
    //     id = element.sellerId;
    //   } else {
    //     id = this.capitalizeFirstLetter(element.sellerFirstname.toString()) + ' '
    //       + this.capitalizeFirstLetter(element.sellerLastname.toString());
    //   }
    //   if (this.period === 'day') {
    //     if (!saleDays.includes(this.datePipe.transform(element.date, 'dd MMM YYYY'))) {
    //       saleDays.push(this.datePipe.transform(element.date, 'dd MMM YYYY'));
    //     }
    //   } else if (this.period === 'month') {
    //     if (!saleDays.includes(this.datePipe.transform(element.date, 'MMM YYYY'))) {
    //       saleDays.push(this.datePipe.transform(element.date, 'MMM YYYY'));
    //     }
    //   } else {
    //     if (!saleDays.push(element.date)) {
    //       saleDays.push(element.date);
    //     }
    //   }
    //
    //   if (sellersData[id]) {
    //     let tempData = [];
    //     if (sellersData[id].length > 0) {
    //       tempData = sellersData[id];
    //     }
    //     tempData.push(element.amount);
    //     sellersData[id] = tempData;
    //   } else {
    //     const tempData = [];
    //     tempData.push(element.amount);
    //     sellersData[id] = tempData;
    //   }
    //
    //
    // });

    // Object.keys(data).forEach(key => {
    //   const seller = data[key].sellerId;
    //   let id;
    //
    //   if (this.period === 'day') {
    //     if (!saleDays.includes(this.datePipe.transform(data[key].date, 'dd MMM YYYY'))) {
    //       saleDays.push(this.datePipe.transform(data[key].date, 'dd MMM YYYY'));
    //     }
    //   } else if (this.period === 'month') {
    //     if (!saleDays.includes(this.datePipe.transform(data[key].date, 'MMM YYYY'))) {
    //       saleDays.push(this.datePipe.transform(data[key].date, 'MMM YYYY'));
    //     }
    //   } else {
    //     if (!saleDays.push(data[key].date)) {
    //       saleDays.push(data[key].date);
    //     }
    //   }
    //   if (data[key].sellerFirstname === null) {
    //     id = seller;
    //   } else {
    //     id = this.capitalizeFirstLetter(data[key].sellerFirstname.toString()) + ' '
    //       + this.capitalizeFirstLetter(data[key].sellerLastname.toString());
    //   }
    //
    //
    //   // if (sellersData[id]) {
    //   //   let tempData = [];
    //   //   if (sellersData[id].length > 0) {
    //   //     tempData = sellersData[id];
    //   //   }
    //   //   tempData.push(data[key].amount);
    //   //   sellersData[id] = tempData;
    //   // } else {
    //   //   const tempData = [];
    //   //   tempData.push(data[key].amount);
    //   //   sellersData[id] = tempData;
    //   // }
    // });

    data.forEach(val => {
        const seller = val.sellerId;
        let id;

        if (val.sellerFirstname === null) {
          id = seller;
        } else {
          id = this.capitalizeFirstLetter(val.sellerFirstname.toString()) + ' '
            + this.capitalizeFirstLetter(val.sellerLastname.toString());
        }
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
          categories: days,
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
