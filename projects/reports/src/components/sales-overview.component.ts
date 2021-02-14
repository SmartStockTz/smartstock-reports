import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CartModel} from '../models/cart.model';
import {json2csv} from '../services/json2csv.service';
import {DatePipe} from '@angular/common';
import {PeriodDateRangeService} from '../services/period-date-range.service';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';
import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'smartstock-report-sale-overview',
  template: `
    <div class=" mx-auto" style="margin-top: 1em">
      <div class="py-3">
          <mat-card class="mat-elevation-z3">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">trending_up</mat-icon>
              <p class="m-0 h6">{{period | titlecase}} sales</p>
            </div>
            <hr class="w-75 mt-0 mx-auto">

            <div class="d-flex justify-content-center align-items-center m-0 p-0" style="min-height: 200px">
              <div id="salesTrendByDay" class="w-100"></div>
              <smartstock-data-not-ready style="position: absolute" [width]="100" height="100" [isLoading]="isLoading"
                                         *ngIf="noDataRetrieved || isLoading"></smartstock-data-not-ready>
            </div>
          </mat-card>
      </div>
        <div class="py-3">
          <mat-card class="mat-elevation-z3">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">trending_up</mat-icon>
              <p class="mr-auto my-0 h6">{{period | titlecase}} sales</p>
              <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
                <mat-icon>get_app</mat-icon>
              </button>
            </div>
            <hr class="w-75 mt-0 mx-auto">

            <div style="display: flex; flex-flow: row; align-items: center">
              <!--            <h6 class="col-8">Cart Report</h6>-->
              <span style="flex-grow: 1"></span>
            </div>
            <div class="d-flex justify-content-center">
              <smartstock-data-not-ready [width]="100" height="100" [isLoading]="isLoading"
                                         *ngIf="noDataRetrieved  && !isLoading"></smartstock-data-not-ready>
            </div>


            <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="salesData" matSort>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell
                    *matCellDef="let element">{{period === 'day' ? (element.id | date: 'dd MMM YYYY') : period === 'month' ? (element.id | date: 'MMM YYYY') : (element.id)}}</td>
                <td mat-footer-cell *matFooterCellDef> Total</td>
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
            <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
          </mat-card>
        </div>
    </div>
    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()">
        CSV
      </button>
    </mat-menu>
  `,
  // styleUrls: ['../styles/sales-trends.style.scss'],
})
export class SalesOverviewComponent implements OnInit, OnDestroy {
  salesByDayTrendProgress = false;
  trendChart: Highcharts.Chart = undefined;
  isLoading = false;
  noDataRetrieved = true;
  salesData: MatTableDataSource<CartModel>;
  salesColumns = ['date', 'amount'];
  totalSales = 0;
  period = 'day';
  startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  endDate = toSqlDate(new Date());


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();

  constructor(
    private readonly reportService: ReportService,
    private readonly datePipe: DatePipe,
    private readonly snack: MatSnackBar,
    private readonly periodDateRangeService: PeriodDateRangeService
  ) {
  }



  ngOnInit(): void {
    this._getSalesTrend();

    this.periodDateRangeService.period.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.period = value;
        this._getSalesTrend();
      }
    });
    this.periodDateRangeService.startDate.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.startDate = value;
        this._getSalesTrend();
      }
    });
    this.periodDateRangeService.endDate.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.endDate = value;
        this._getSalesTrend();
      }
    });


  }

  private _getSalesTrend(): void {
    this.isLoading = true;
    this.salesByDayTrendProgress = true;
    this.reportService.getSalesOverview(this.startDate, this.endDate, this.period).then(value => {
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
    }).catch(_ => {
      console.log(_);
      this.isLoading = false;
      this.noDataRetrieved = true;
      this.salesByDayTrendProgress = false;
    });
  }


  exportReport(): void {
    const exportedDataCartColumns = ['id', 'amount'];
    json2csv(`${this.period}_sales_report.csv`, exportedDataCartColumns, this.salesData.filteredData).catch(_ => {
      this.snack.open('Fails to export reports', 'Ok', {
        duration: 2000
      });
    });
  }

  private initiateGraph(data: any): any {
    const saleDays = [];
    const totalSales = [];
    Object.keys(data).forEach(key => {
      if (this.period === 'day') {
        saleDays.push(this.datePipe.transform(data[key].id, 'dd MMM YYYY'));
      } else if (this.period === 'month') {
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
          text: this.period.charAt(0).toUpperCase() + this.period.substr(1)
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
          valueDecimals: 2,
    pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
      },
      // @ts-ignore
      series: [{
        name: 'Sales',
        color: '#0b2e13',
        data: totalSales
      }]
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }
}
