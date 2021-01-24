import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {LogService, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {FormControl, Validators} from '@angular/forms';
import {json2csv} from '../services/json2csv.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

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
    <div>
      <div class="row m-0 py-2" style="justify-content: space-evenly">
        <div class="col-md-8 col-lg-6 py-3">
          <mat-card class="mat-elevation-z3" style="border-radius: 15px; border-left: 5px solid green;">
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
                                         *ngIf="salesStatusProgress  || (!salesByCategoryData)"></smartstock-data-not-ready>
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
              <!--<mat-form-field>-->
              <!--<mat-label>Sales type</mat-label>-->
              <!--<mat-select [formControl]="periodFormControl">-->
              <!--<mat-option value="retail">Retail</mat-option>-->
              <!--<mat-option value="whole">Whole sale</mat-option>-->
              <!--</mat-select>-->
              <!--</mat-form-field>-->
            </mat-card-header>

            <div style="display: flex; justify-content: center">
<!--              <mat-spinner *ngIf="salesStatusProgress"></mat-spinner>-->
              <smartstock-data-not-ready [width]="100" height="100"
                                         [isLoading]="salesStatusProgress"
                                         *ngIf="salesStatusProgress  || (!salesByCategoryData)"></smartstock-data-not-ready>
            </div>
            <table *ngIf="!salesStatusProgress  && salesByCategoryData" mat-table [dataSource]="salesByCategoryData" matSort>

              <!--          <ng-container matColumnDef="product">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>-->
              <!--            <td mat-cell *matCellDef="let element">{{element._id}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->

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
                <td mat-cell *matCellDef="let element">{{element.date | date}}</td>
                <td mat-footer-cell *matFooterCellDef>
                </td>
              </ng-container>

<!--              <ng-container matColumnDef="lastSold">-->
<!--                <th mat-header-cell *matHeaderCellDef mat-sort-header>Last sold</th>-->
<!--                <td matRipple mat-cell *matCellDef="let element">{{element.lastSold | date}}</td>-->
<!--                <td mat-footer-cell *matFooterCellDef></td>-->
<!--              </ng-container>-->

              <!--          <ng-container matColumnDef="costOfGoodSold">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost of goods sold</th>-->
              <!--            <td mat-cell-->
              <!--                *matCellDef="let element">{{element.costOfGoodsSold | currency: ' TZS'}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->

              <!--          <ng-container matColumnDef="grossProfit">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Gross profit</th>-->
              <!--            <td mat-cell *matCellDef="let element">{{element.sales - element.costOfGoodsSold | currency: ' TZS'}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->


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
  salesByCategoryData: MatTableDataSource<any>;
  // salesByCategoryData: { x: string; y: number }[];
  salesByCategoryChart: Highcharts.Chart = undefined;
  // @Input() salesperiod;
  period = 'day';
  salesYearFormControl = new FormControl(moment());
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  totalSales = 0;
  month;
  salesByCategoryColumns = ['category', 'quantitySold', 'sales', 'date'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
  ) {
  }

  ngOnInit(): void {
    this.month = Object.keys(this.sellerSalesData)[this.selectedMonth];
    this.getSalesByCategory();
    // this.salesperiod.subscribe((value) => {
    //   this.period = value;
    //   this.getSalesByCategory();
    // });

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.salesByCategoryData.filter = filterValue.trim().toLowerCase();
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
    let monthFormat;
    this.salesStatusProgress = true;
    this.selectedMonth += 1;
    if (this.selectedMonth < 10) {
      monthFormat = '0' + this.selectedMonth.toString();
    }
    this.report.getSalesByCategory(this.period, this.selectedYear + '-' + monthFormat + '-01',
      this.selectedYear + '-' + monthFormat + '-31').then(data => {
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
      // this.logger.i(reason, 'StockStatusComponent:26');
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
      // legend: {
      //   layout: 'horizontal',
      //   align: 'center',
      //   verticalAlign: 'top',
      // },
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
            // if (val.period === this.period) {
              return {
                name: val.category,
                y: val.amount,
                sliced: true,
                selected: true,
              };
            // } else {
            //   return {
            //     name: val._id,
            //     y: 0,
            //     sliced: true,
            //     selected: true,
            //   };
            // }
          }),
        },
      ],
    });
  }
}
