import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {FormControl, Validators} from '@angular/forms';
import {json2csv} from '../services/json2csv.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PeriodDateRangeState} from '../states/period-date-range.state';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';



@Component({
  selector: 'app-sales-by-category',
  template: `
    <div>
      <div class="row m-0 py-2" style="justify-content: space-evenly">
        <div class="col-md-8 col-lg-6 py-3">
          <mat-card class="mat-elevation-z3" style="border-radius: 15px; border-left: 5px solid green;">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" style="width: 40px;height:40px;font-size: 36px">category</mat-icon>
              <p class="m-0 h6">Sales By Category</p>
            </div>
            <hr class="w-75 mt-0 mx-auto" color="primary">
            <div class="d-flex justify-content-center align-items-center py-3" style="min-height: 200px">
              <div style="width: 100%; height: 100%" id="salesByCategory"></div>
              <app-data-not-ready style="position: absolute" [width]="100" height="100"
                                         [isLoading]="salesStatusProgress"
                                         *ngIf="salesStatusProgress  || (!salesByCategoryData)"></app-data-not-ready>
            </div>
          </mat-card>
        </div>
        <div class=" col-md-11 col-lg-6 py-3">
          <mat-card class="mat-elevation-z3">
            <div class="row pt-3 m-0 justify-content-center align-items-center">
              <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">category</mat-icon>
              <p class="mr-auto my-0 h6">Sales By Category</p>
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
              <app-data-not-ready [width]="100" height="100"
                                         [isLoading]="salesStatusProgress"
                                         *ngIf="salesStatusProgress  || (!salesByCategoryData)"></app-data-not-ready>
            </div>
            <table *ngIf="!salesStatusProgress  && salesByCategoryData" mat-table [dataSource]="salesByCategoryData" matSort>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
                <td mat-cell *matCellDef="let element">{{element.category}}</td>
                <td mat-footer-cell *matFooterCellDef>Total</td>
              </ng-container>

              <ng-container matColumnDef="quantitySold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity sold</th>
                <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="sales">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Sales</th>
                <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
                <td mat-footer-cell *matFooterCellDef>{{totalSales | currency: ' '}}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell
                    *matCellDef="let element">{{period === 'day' ? (element.date | date: 'dd MMM YYYY') : period === 'month' ? (element.date | date: 'MMM YYYY') : (element.date)}}
                </td>
                <td mat-footer-cell *matFooterCellDef>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="salesByCategoryColumns"></tr>
              <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                  *matRowDef="let row; columns: salesByCategoryColumns;"></tr>
              <tr class="font-weight-bold" mat-footer-row style="font-size: 36px" *matFooterRowDef="salesByCategoryColumns"></tr>

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
export class SalesByCategoryComponent implements OnInit, OnDestroy {
  salesStatusProgress = false;
  salesByCategoryData: MatTableDataSource<any>;
  salesByCategoryChart: Highcharts.Chart = undefined;
  // @Input() salesperiod;
  period = 'day';
  totalSales = 0;
  startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  endDate = toSqlDate(new Date());
  salesByCategoryColumns = ['category', 'quantitySold', 'sales', 'date'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();

  constructor(
    private readonly report: ReportService,
    private readonly logger: LogService,
    private periodDateRangeService: PeriodDateRangeState
  ) {
  }

  ngOnInit(): void {
    this.getSalesByCategory();
    this.periodDateRangeService.period.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.period = value;
        this.getSalesByCategory();
      }
    });
    this.periodDateRangeService.startDate.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.startDate = value;
        this.getSalesByCategory();
      }
    });
    this.periodDateRangeService.endDate.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.endDate = value;
        this.getSalesByCategory();
      }
    });

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.salesByCategoryData.filter = filterValue.trim().toLowerCase();
    });
  }

  // tslint:disable-next-line:typedef
  private getSalesByCategory() {
    this.report.getSalesByCategory(this.period, this.startDate, this.endDate).then(data => {
      this.salesStatusProgress = false;
      this.salesByCategoryData = new MatTableDataSource<any>(data);
      this.totalSales = data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
      setTimeout(() => {
        this.salesByCategoryData.paginator = this.paginator;
        this.salesByCategoryData.sort = this.sort;
      });
      this.initiateGraph(data);
    }).catch(reason => {
      this.salesStatusProgress = false;
      this.logger.i(reason);
    });
  }

  exportReport(): void {
    const exportedDataColumns = ['category', 'sales', 'quantitySold', 'date'];
    json2csv('profit_by_category.csv', exportedDataColumns, this.salesByCategoryData.filteredData).catch();
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    const x = data.map((value) => value.amount);
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
          load(event): any {
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
            return {
              name: val.category,
              y: val.amount,
              sliced: true,
              selected: true,
            };
          }),
        },
      ],
    });
  }
  ngOnDestroy(): void {
    this.destroyer.next('done');
  }
}
