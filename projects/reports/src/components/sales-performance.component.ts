import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {DeviceState, LogService, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {FormControl, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {DatePipe} from '@angular/common';
import {PeriodDateRangeState} from '../states/period-date-range.state';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-sales-performance-component',
  template: `
    <div>
      <div class="m-0">
        <div *ngIf="performanceBy !== 'product'" class=" py-3 mx-auto">
          <mat-card class="mat-elevation-z3">
            <div class="d-flex pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">
                {{performanceBy === 'seller' ? 'people' : 'category'}}
              </mat-icon>
              <p class="m-0 h6">Performance By {{performanceBy | titlecase}}</p>
            </div>

            <hr class="w-75 mt-0 mx-auto">
            <div class="d-flex justify-content-center align-items-center py-3" style="min-height: 200px">
              <div style="width: 100%; height: 100%" id="salesBySeller"></div>
              <app-data-not-ready style="position: absolute" [width]="100" height="100"
                                  [isLoading]="salesStatusProgress"
                                  *ngIf="salesStatusProgress  || (!salesPerformanceData)">
              </app-data-not-ready>
            </div>
          </mat-card>
        </div>

        <div class="py-3 mx-auto">

          <mat-form-field class="btn-block">
            <mat-label>Filter</mat-label>
            <input matInput [formControl]="filterFormControl" placeholder="Type here...">
          </mat-form-field>

          <mat-card class="mat-elevation-z3">
            <div class="d-flex pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">
                {{performanceBy === 'seller' ? 'people' : 'category'}}
              </mat-icon>
              <p class=" mr-auto m-0 h6">Performance By {{performanceBy | titlecase}} </p>
              <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
                <mat-icon>get_app</mat-icon>
              </button>
            </div>

            <hr class="w-75 mt-0 mx-auto">

            <div class="d-flex justify-content-center">
              <app-data-not-ready [width]="100" height="100" [isLoading]="salesStatusProgress"
                                  *ngIf="salesStatusProgress  || (!salesPerformanceData)">
              </app-data-not-ready>
            </div>

            <table *ngIf="!salesStatusProgress  && salesPerformanceData"
                   mat-table [dataSource]="salesPerformanceData" matSort>

              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
                <td mat-cell *matCellDef="let element">{{element.id}}</td>
              </ng-container>

              <ng-container matColumnDef="seller/category">
                <th mat-header-cell *matHeaderCellDef
                    mat-sort-header>{{performanceBy === 'product' ? 'Category' : performanceBy | titlecase}}</th>
                <div *ngIf="performanceBy === 'seller'">
                  <td mat-cell
                      *matCellDef="let element">{{element.sellerFirstname === null ? element.sellerId : element.sellerFirstname | titlecase}} {{element.sellerLastname | titlecase}}</td>
                </div>
                <div *ngIf="performanceBy != 'seller'">
                  <td mat-cell *matCellDef="let element">{{element.category}}</td>
                </div>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
                <td mat-cell
                    *matCellDef="let element">{{performanceBy === 'product' ? (element.quantitySold | number) : element.quantity | number}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container *ngIf="performanceBy != 'product'" matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
                <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
              </ng-container>

              <ng-container *ngIf="performanceBy != 'product'" matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell
                    *matCellDef="let element">{{period === 'day' ? (element.date | date: 'dd MMM YYYY') : period === 'month' ? (element.date | date: 'MMM YYYY') : (element.date)}}
                </td>
              </ng-container>

              <!--              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="firstSold">-->
              <!--                <th mat-header-cell *matHeaderCellDef mat-sort-header>First sold</th>-->
              <!--                <td mat-cell *matCellDef="let element">{{element.firstSold}}</td>-->
              <!--                <td mat-footer-cell *matFooterCellDef>-->
              <!--                </td>-->
              <!--              </ng-container>-->

              <!--              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="lastSold">-->
              <!--                <th mat-header-cell *matHeaderCellDef mat-sort-header>Last sold</th>-->
              <!--                <td matRipple mat-cell *matCellDef="let element">{{element.lastSold}}</td>-->
              <!--              </ng-container>-->

              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="sales">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Sales</th>
                <td mat-cell
                    *matCellDef="let element">{{element.sales | currency: ' '}}</td>
              </ng-container>

              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="costOfGoodSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost of goods sold</th>
                <td mat-cell
                    *matCellDef="let element">{{element.costOfGoodsSold | currency: ' '}}</td>
              </ng-container>

              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="grossProfit">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Gross profit</th>
                <td mat-cell *matCellDef="let element">{{element.sales - element.costOfGoodsSold | currency: ' '}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container *ngIf="performanceBy === 'product'" matColumnDef="detail_mobile">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Details</th>
                <td mat-cell *matCellDef="let element">
                  <p><b>{{element.id}}</b></p>
                  <p>Quantity : {{element.quantitySold | number}}</p>
                  <p>Sales : {{element.sales | currency: ' '}}</p>
                  <p>Cost : {{element.costOfGoodsSold | currency: ' '}}</p>
                  <p>Gross Profit : {{element.sales - element.costOfGoodsSold | currency: ' '}}</p>
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-template [ngIf]="performanceBy === 'product'">
                <tr mat-header-row *matHeaderRowDef="(deiveState.isSmallScreen | async)?productColumnsMobile:productColumns"></tr>
                <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                    *matRowDef="let row; columns: (deiveState.isSmallScreen | async)?productColumnsMobile:productColumns;"></tr>
              </ng-template>
              <ng-template [ngIf]="performanceBy != 'product'">
                <tr mat-header-row *matHeaderRowDef="performanceByColumns"></tr>
                <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                    *matRowDef="let row; columns: performanceByColumns;"></tr>
              </ng-template>
            </table>
            <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>

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
export class SalesPerformanceComponent implements OnInit, OnDestroy {
  salesStatusProgress = false;
  salesPerformanceData: MatTableDataSource<any>;
  salesBySellerChart: Highcharts.Chart = undefined;
  performanceByColumns = ['seller/category', 'quantity', 'amount', 'date'];
  productColumns = ['product', 'quantity', 'sales', 'costOfGoodSold', 'grossProfit'];
  productColumnsMobile = ['detail_mobile'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  period = 'day';
  startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  endDate = toSqlDate(new Date());
  performanceBy = 'product';
  @Input() performanceByForm;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();


  constructor(private readonly report: ReportService,
              public readonly logger: LogService,
              public datePipe: DatePipe,
              public readonly deiveState: DeviceState,
              public periodDateRangeService: PeriodDateRangeState) {
  }

  ngOnInit(): void {
    this.getSalesPerformance();
    this.performanceByForm.subscribe(value => {
      this.performanceBy = value;
      this.getSalesPerformance();
    });
    this.periodDateRangeService.dateRange.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.period = value.period;
        this.startDate = value.startDate;
        this.endDate = value.endDate;
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

  private getSalesPerformance(): any {
    this.salesStatusProgress = true;
    if (this.performanceBy === 'seller') {
      this.report.getSellerPerformanceReport(this.startDate, this.endDate, this.period).then(sellerData => {
        this.salesStatusProgress = false;
        this.salesPerformanceData = new MatTableDataSource<any>(sellerData);
        setTimeout(() => {
          this.salesPerformanceData.paginator = this.paginator;
          this.salesPerformanceData.sort = this.sort;
        });
        // @ts-ignore
        this.initiateGraph(sellerData, null, null);
      }).catch(reason => {
        this.salesStatusProgress = false;
        this.logger.i(reason);
      });
    } else if (this.performanceBy === 'category') {
      this.report.getCategoryPerformanceReport(this.period, this.startDate, this.endDate).then(categoryData => {
        this.salesStatusProgress = false;
        this.salesPerformanceData = new MatTableDataSource<any>(categoryData);
        setTimeout(() => {
          this.salesPerformanceData.paginator = this.paginator;
          this.salesPerformanceData.sort = this.sort;
        });
        this.initiateGraph(null, categoryData, null);
      }).catch(reason => {
        this.salesStatusProgress = false;
        this.logger.i(reason);
      });
    } else if (this.performanceBy === 'product') {
      this.report.getProductPerformanceReport(this.period, this.startDate, this.endDate).then(productData => {
        this.salesStatusProgress = false;
        this.salesPerformanceData = new MatTableDataSource<any>(productData);
        setTimeout(() => {
          this.salesPerformanceData.paginator = this.paginator;
          this.salesPerformanceData.sort = this.sort;
        });
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

  private initiateGraph(sellerData: [{ sellerFirstname: any, sellerLastname: any, sellerId: any, quantity: any, amount: any, date: any }],
                        categoryData: [{ category: any, quantity: any, amount: any, date: any }],
                        productData: [{ id: any, sales: any, date: any }]): any {
    const days = new Set();
    const sellersIds = new Set();
    const sellersCategoryData = {};
    let data;
    if (this.performanceBy === 'seller') {
      data = sellerData;
    } else if (this.performanceBy === 'category') {
      data = categoryData;
    } else if (this.performanceBy === 'product') {
      data = productData;
    }

    Object.keys(data).forEach(key => {
      if (this.performanceBy === 'product') {
        days.add(data[key].firstSold);
      } else {
        days.add(data[key].date);
      }
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
      } else if (this.performanceBy === 'category') {
        sellersIds.add({name: data[key].category, id: data[key].category});
      } else if (this.performanceBy === 'product') {
        sellersIds.add({name: data[key].id, id: data[key].id});
      }

    });

    sellersIds.forEach((seller: { name, id }) => {
      const tempDataArray = [];
      days.forEach(date => {
        let filterdSales;
        if (this.performanceBy === 'seller') {
          // @ts-ignore
          filterdSales = Object.values(data).filter(value => value.date === date && value.sellerId === seller.id);
        } else if (this.performanceBy === 'category') {
          // @ts-ignore
          filterdSales = Object.values(data).filter(value => value.date === date && value.category === seller.id);
        } else if (this.performanceBy === 'product') {
          // @ts-ignore
          filterdSales = Object.values(data).filter(value => value.firstSold === date && value.id === seller.id);
        }
        if (filterdSales && filterdSales.length === 1) {
          if (this.performanceBy === 'product') {
            tempDataArray.push(filterdSales[0].sales);
          } else {
            const fixedValue = Math.round((filterdSales[0].amount + Number.EPSILON) * 100) / 100;
            tempDataArray.push(fixedValue);
          }
        } else {
          tempDataArray.push(0);
        }
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

    // @ts-ignore
    this.salesBySellerChart = Highcharts.chart('salesBySeller', {
        chart: {
          type: 'spline',
        },
        title: {
          text: null
        },
        // @ts-ignore
        xAxis: {
          categories: days,
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
          // pointFormat: '{series.name}:<b> {point.y:.1f}/=</b><br>',
          shared: true,
          crosshairs: true,
        },

        plotOptions: {
          series: {
            cursor: 'pointer',
          }

        },
        series: Object.keys(sellersCategoryData).map(key => {
          return {
            name: key,
            data: sellersCategoryData[key],
            tooltip: {
              valueSuffix: ' /='
            }
          };
        }),
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

}
