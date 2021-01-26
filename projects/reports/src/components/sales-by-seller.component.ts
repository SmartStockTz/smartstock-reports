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
                                         *ngIf="salesStatusProgress  || (!salesPerformanceData)"></smartstock-data-not-ready>
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
                                         *ngIf="salesStatusProgress  || (!salesPerformanceData)"></smartstock-data-not-ready>
            </div>
            <table *ngIf="!salesStatusProgress  && salesPerformanceData" mat-table [dataSource]="salesPerformanceData" matSort>

              <ng-container matColumnDef="seller/category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>
                <div *ngIf="performanceBy === 'seller'" >
                  <td mat-cell
                      *matCellDef="let element">{{element.sellerFirstname === null ? element.sellerId : element.sellerFirstname | titlecase}} {{element.sellerLastname | titlecase}}</td>
                </div>
                <div  *ngIf="performanceBy === 'category'">
                <td mat-cell  *matCellDef="let element">{{element.category}}</td>
                </div>
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
  salesPerformanceData: MatTableDataSource<any>;
  salesBySellerChart: Highcharts.Chart = undefined;
  selectedYear = new Date().getFullYear();
  salesBySellerColumns = ['seller/category', 'quantity', 'amount', 'date'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  period = 'day';
  startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  endDate = toSqlDate(new Date());
  performanceBy = 'category';
  @Input() performanceByForm;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private readonly  report: ReportService,
              private readonly logger: LogService,
              private datePipe: DatePipe,
              private periodDateRangeService: PeriodDateRangeService) {
  }

  ngOnInit(): void {
    this.getSalesPerformance();
    this.performanceByForm.subscribe(value => {
      this.performanceBy = value;
      this.getSalesPerformance();
    });
    console.log(this.performanceBy);
    this.periodDateRangeService.castPeriod.subscribe((value) => {
      if (value) {
        this.period = value;
        this.getSalesPerformance();
      }
    });
    this.periodDateRangeService.castStartDate.subscribe((value) => {
      if (value) {
        this.startDate = value;
        this.getSalesPerformance();
      }
    });
    this.periodDateRangeService.castEndDate.subscribe((value) => {
      if (value) {
        this.endDate = value;
        this.getSalesPerformance();
      }
    });


    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.salesPerformanceData.filter = filterValue.trim().toLowerCase();
    });
  }

  capitalizeFirstLetter(data): any {
    return data[0].toUpperCase() + data.slice(1);
  }

  // tslint:disable-next-line:typedef
  private getSalesPerformance() {
    this.salesStatusProgress = true;
    if (this.performanceBy === 'seller') {
      this.report.getSellerSales(this.startDate, this.endDate, this.period).then(sellerData => {
        this.salesStatusProgress = false;
        this.salesPerformanceData = new MatTableDataSource<any>(sellerData);
        setTimeout(() => {
          this.salesPerformanceData.paginator = this.paginator;
          this.salesPerformanceData.sort = this.sort;
        });
        // @ts-ignore
        this.initiateGraph(sellerData, null);
      }).catch(reason => {
        this.salesStatusProgress = false;
        this.logger.i(reason);
      });
    }
    else if (this.performanceBy === 'category') {
      this.report.getSalesByCategory(this.period, this.startDate, this.endDate).then(categoryData => {
        this.salesStatusProgress = false;
        this.salesPerformanceData = new MatTableDataSource<any>(categoryData);
        setTimeout(() => {
          this.salesPerformanceData.paginator = this.paginator;
          this.salesPerformanceData.sort = this.sort;
        });
        this.initiateGraph(null, categoryData);
      }).catch(reason => {
        this.salesStatusProgress = false;
        this.logger.i(reason);
      });
    }
  }

  exportReport(): void {
    const exportedDataColumns = ['seller/category', 'quantity', 'amount', 'date'];
    json2csv('profit_by_category.csv', exportedDataColumns, this.salesPerformanceData.filteredData).catch();
  }


  // tslint:disable-next-line:typedef
  private initiateGraph(sellerData: [{ sellerFirstname: any, sellerLastname: any, sellerId: any, quantity: any, amount: any, date: any }],
                        categoryData: [{ category: any, quantity: any, amount: any, date: any }]) {
    const days = new Set();
    const sellersIds = new Set();
    const sellersCategoryData = {};
    let data;
    if (this.performanceBy === 'seller') {
      data = sellerData;
    } else if (this.performanceBy === 'seller') {
      data = categoryData;
    }


    Object.keys(data).forEach(key => {
      days.add(data[key].date);
      let id;
      // @ts-ignore
      if (this.performanceBy === 'seller') {
        if (data[key].sellerFirstname === null) {
          id = data[key].sellerId;
        } else {
          id = this.capitalizeFirstLetter(data[key].sellerFirstname.toString()) + ' '
            + this.capitalizeFirstLetter(data[key].sellerLastname.toString());
        }
        sellersIds.add({name: id, id: data[key].sellerId});
      } else if (this.performanceBy === 'seller') {
        sellersIds.add({name: data[key].category, id: data[key].category});
      }

      });

    sellersIds.forEach((seller: { name, id }) => {
      const tempDataArray = [];
      days.forEach(date => {
        const filterdSales = Object.values(data).filter(value => value.date === date && value.sellerId === seller.id);
        if (filterdSales && filterdSales.length === 1) {
          tempDataArray.push(filterdSales[0].amount);
        } else {
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
        //     if (sellersCategoryData[id]) {
        //       const tempData = new Map();
        //       let tempDataArray = [];
        //       if (sellersCategoryData[id].length > 0) {
        //         tempDataArray = sellersCategoryData[id];
        //       }
        //       tempData.set(date, value.amount);
        //       tempDataArray.push(tempData);
        //       sellersCategoryData[id] = tempDataArray;
        //     } else {
        //       const tempData = new Map();
        //       const tempDataArray = [];
        //       tempData.set(date, value.amount);
        //       tempDataArray.push(tempData);
        //       sellersCategoryData[id] = tempDataArray;
        //     }
        //   } else {
        //     if (sellersCategoryData[id]) {
        //       const tempData = new Map();
        //       let tempDataArray = [];
        //       if (sellersCategoryData[id].length > 0) {
        //         tempDataArray = sellersCategoryData[id];
        //       }
        //       tempData.set(date, 0);
        //       tempDataArray.push(tempData);
        //       sellersCategoryData[id] = tempDataArray;
        //     } else {
        //       const tempData = new Map();
        //       const tempDataArray = [];
        //       tempData.set(date, 0);
        //       tempDataArray.push(tempData);
        //       sellersCategoryData[id] = tempDataArray;
        //     }
        //   }
        // });
        // sellersCategoryData[id] =
      });
      sellersCategoryData[seller.name as string] = tempDataArray;
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
    console.log(sellersCategoryData);
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
    //   if (sellersCategoryData[id]) {
    //     let tempData = [];
    //     if (sellersCategoryData[id].length > 0) {
    //       tempData = sellersCategoryData[id];
    //     }
    //     tempData.push(element.amount);
    //     sellersCategoryData[id] = tempData;
    //   } else {
    //     const tempData = [];
    //     tempData.push(element.amount);
    //     sellersCategoryData[id] = tempData;
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
    //   // if (sellersCategoryData[id]) {
    //   //   let tempData = [];
    //   //   if (sellersCategoryData[id].length > 0) {
    //   //     tempData = sellersCategoryData[id];
    //   //   }
    //   //   tempData.push(data[key].amount);
    //   //   sellersCategoryData[id] = tempData;
    //   // } else {
    //   //   const tempData = [];
    //   //   tempData.push(data[key].amount);
    //   //   sellersCategoryData[id] = tempData;
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
    console.log(sellersCategoryData);

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
        series: Object.keys(sellersCategoryData).map(key => {
          return {
            name: key,
            data: sellersCategoryData[key]
          };
        }),
      }
    );
  }

}
