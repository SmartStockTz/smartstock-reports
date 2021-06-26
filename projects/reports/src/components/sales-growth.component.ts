import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {DeviceState, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {json2csv} from '../services/json2csv.service';
import {DatePipe} from '@angular/common';
import {PeriodDateRangeState} from '../states/period-date-range.state';
import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-report-sales-growth',
  template: `
    <div>
      <mat-form-field class="px-3 btn-block">
        <mat-label>Growth By</mat-label>
        <mat-select [formControl]="periodFormControl">
          <mat-option value="week">Weeks</mat-option>
          <mat-option value="month">Month</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <app-period-date-range [hidePeriod]="true" setPeriod="year"></app-period-date-range>
    <div class=" mx-auto" style="margin-top: 1em">
      <div class="py-3">
        <mat-card class="mat-elevation-z3">
          <div class="row pt-3 m-0 justify-content-center align-items-end">
            <svg width="40" height="36" viewBox="0 0 488 412" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M51.725 316.622C48.025 320.322 43.625 323.322 38.925 325.322V350.822V393.022C38.925 403.122 47.125 411.222 57.125 411.222H98.125C108.225 411.222 116.325 403.022 116.325 393.022V350.822V297.022V254.822C116.325 253.922 116.225 253.022 116.125 252.222L51.725 316.622Z"
                fill="#1B5E20"/>
              <path
                d="M476.325 52.722C475.925 52.722 475.525 52.722 475.025 52.722C447.425 54.022 419.725 55.322 392.125 56.622C387.825 56.822 383.625 57.022 381.225 62.222C378.825 67.322 381.525 70.222 384.525 73.222C393.025 81.722 401.425 90.322 410.025 98.622L400.625 108.022L324.125 184.522L317.325 191.322L300.625 208.022L234.825 273.822L231.025 270.022L152.325 191.322L135.625 174.622L131.125 170.122C127.525 166.522 122.925 164.822 118.225 164.822C113.525 164.822 108.925 166.622 105.325 170.122L100.825 174.622L5.325 270.122C-1.775 277.222 -1.775 288.822 5.325 295.922L9.825 300.422C13.425 304.022 18.025 305.722 22.725 305.722C27.425 305.722 32.025 303.922 35.625 300.422L118.225 217.822L122.025 221.622L200.725 300.322L217.425 317.022L221.925 321.522C225.525 325.122 230.125 326.822 234.825 326.822C239.525 326.822 244.125 325.022 247.725 321.522L252.225 317.022L330.925 238.322L347.625 221.622L354.425 214.822L430.925 138.322L440.225 129.022L465.225 153.822C467.525 156.122 469.825 158.622 473.125 158.622C474.325 158.622 475.725 158.222 477.225 157.422C482.225 154.722 483.325 150.322 483.525 145.422C484.725 118.422 486.025 91.522 487.325 64.522C487.625 56.422 484.225 52.722 476.325 52.722Z"
                fill="#1B5E20"/>
              <path
                d="M201.025 333.422L184.325 316.722L148.325 280.722C146.725 283.422 145.825 286.622 145.825 289.922V297.122V385.922V393.122C145.825 403.222 154.025 411.322 164.025 411.322H205.025C215.125 411.322 223.225 403.122 223.225 393.122V385.922V348.422C216.625 346.522 210.525 342.922 205.525 337.922L201.025 333.422Z"
                fill="#1B5E20"/>
              <path
                d="M268.525 333.422L264.025 337.922C260.725 341.222 256.925 343.922 252.725 345.922V385.922V393.122C252.725 403.222 260.925 411.322 270.925 411.322H311.925C322.025 411.322 330.125 403.122 330.125 393.122V385.922V297.122V289.922C330.125 284.922 328.125 280.422 324.825 277.122L268.525 333.422Z"
                fill="#1B5E20"/>
              <path
                d="M370.725 231.122L363.925 237.922L359.525 242.322V254.822V263.422V297.022V305.622V350.722V392.922C359.525 403.022 367.725 411.122 377.725 411.122H418.725C428.825 411.122 436.925 402.922 436.925 392.922V350.722V305.722V297.122V263.522V254.922V209.722V167.522C436.925 166.722 436.825 165.922 436.725 165.122L370.725 231.122Z"
                fill="#1B5E20"/>
            </svg>
            <p class="m-0 px-3 h6">Sales Growth</p>
          </div>
          <hr class="w-75 mt-0 mx-auto">

          <div class="d-flex justify-content-center align-items-center m-0 p-0" style="min-height: 200px">
            <div id="salesGrowth" class="w-100"></div>
            <app-data-not-ready style="position: absolute" [width]="100" height="100" [isLoading]="isLoading"
                                *ngIf="noDataRetrieved || isLoading">
            </app-data-not-ready>
          </div>
        </mat-card>
      </div>
      <div class="py-3">
        <mat-card class="mat-elevation-z3">
          <div class="row pt-3 m-0 justify-content-center align-items-end">
            <svg class="ml-auto" width="40" height="36" viewBox="0 0 488 412" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M51.725 316.622C48.025 320.322 43.625 323.322 38.925 325.322V350.822V393.022C38.925 403.122 47.125 411.222 57.125 411.222H98.125C108.225 411.222 116.325 403.022 116.325 393.022V350.822V297.022V254.822C116.325 253.922 116.225 253.022 116.125 252.222L51.725 316.622Z"
                fill="#1B5E20"/>
              <path
                d="M476.325 52.722C475.925 52.722 475.525 52.722 475.025 52.722C447.425 54.022 419.725 55.322 392.125 56.622C387.825 56.822 383.625 57.022 381.225 62.222C378.825 67.322 381.525 70.222 384.525 73.222C393.025 81.722 401.425 90.322 410.025 98.622L400.625 108.022L324.125 184.522L317.325 191.322L300.625 208.022L234.825 273.822L231.025 270.022L152.325 191.322L135.625 174.622L131.125 170.122C127.525 166.522 122.925 164.822 118.225 164.822C113.525 164.822 108.925 166.622 105.325 170.122L100.825 174.622L5.325 270.122C-1.775 277.222 -1.775 288.822 5.325 295.922L9.825 300.422C13.425 304.022 18.025 305.722 22.725 305.722C27.425 305.722 32.025 303.922 35.625 300.422L118.225 217.822L122.025 221.622L200.725 300.322L217.425 317.022L221.925 321.522C225.525 325.122 230.125 326.822 234.825 326.822C239.525 326.822 244.125 325.022 247.725 321.522L252.225 317.022L330.925 238.322L347.625 221.622L354.425 214.822L430.925 138.322L440.225 129.022L465.225 153.822C467.525 156.122 469.825 158.622 473.125 158.622C474.325 158.622 475.725 158.222 477.225 157.422C482.225 154.722 483.325 150.322 483.525 145.422C484.725 118.422 486.025 91.522 487.325 64.522C487.625 56.422 484.225 52.722 476.325 52.722Z"
                fill="#1B5E20"/>
              <path
                d="M201.025 333.422L184.325 316.722L148.325 280.722C146.725 283.422 145.825 286.622 145.825 289.922V297.122V385.922V393.122C145.825 403.222 154.025 411.322 164.025 411.322H205.025C215.125 411.322 223.225 403.122 223.225 393.122V385.922V348.422C216.625 346.522 210.525 342.922 205.525 337.922L201.025 333.422Z"
                fill="#1B5E20"/>
              <path
                d="M268.525 333.422L264.025 337.922C260.725 341.222 256.925 343.922 252.725 345.922V385.922V393.122C252.725 403.222 260.925 411.322 270.925 411.322H311.925C322.025 411.322 330.125 403.122 330.125 393.122V385.922V297.122V289.922C330.125 284.922 328.125 280.422 324.825 277.122L268.525 333.422Z"
                fill="#1B5E20"/>
              <path
                d="M370.725 231.122L363.925 237.922L359.525 242.322V254.822V263.422V297.022V305.622V350.722V392.922C359.525 403.022 367.725 411.122 377.725 411.122H418.725C428.825 411.122 436.925 402.922 436.925 392.922V350.722V305.722V297.122V263.522V254.922V209.722V167.522C436.925 166.722 436.825 165.922 436.725 165.122L370.725 231.122Z"
                fill="#1B5E20"/>
            </svg>
            <p class="mr-auto px-3 my-0 h6">Sales Growth</p>
            <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
              <mat-icon color="primary">get_app</mat-icon>
            </button>
          </div>
          <hr class="w-75 mt-0 mx-auto">

          <div style="display: flex; flex-flow: row; align-items: center">
            <!--            <h6 class="col-8">Cart Report</h6>-->
            <span style="flex-grow: 1"></span>
          </div>
          <div class="d-flex justify-content-center">
            <app-data-not-ready [width]="100" height="100" [isLoading]="isLoading"
                                *ngIf="noDataRetrieved  || isLoading">
            </app-data-not-ready>
          </div>


          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="salesData" matSort>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>{{period | titlecase}}</th>
              <td mat-cell
                  *matCellDef="let element">{{element.date}}</td>
            </ng-container>

            <ng-container matColumnDef="originAmount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>{{startDate | date: 'YYYY'}}</th>
              <td mat-cell *matCellDef="let element">{{element.origin | currency: ' '}}</td>
            </ng-container>

            <ng-container matColumnDef="comparedAmount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>{{endDate | date: 'YYYY'}}</th>
              <td mat-cell *matCellDef="let element">{{element.compared | currency: ' '}}</td>
            </ng-container>

            <ng-container matColumnDef="growth">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Growth</th>
              <td mat-cell *matCellDef="let element">
                <p *ngIf="element.growth < 0">
                  <span style="color: red;padding-left: 8px;font-size: 16px">  ▼</span>
                  <span style="color: red"> {{element.growth}}  %</span>
                </p>
                <p *ngIf="element.growth >= 0">
                  <span style="color: green;padding-left: 8px;font-size: 16px"> ▲</span>
                  <span style="color: #1b5e20">+{{element.growth}} %</span>
                </p>
              </td>
            </ng-container>

            <ng-container matColumnDef="growth_mobile">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Growth</th>
              <td mat-cell *matCellDef="let element">
                <p>
                  {{startDate | date: 'YYYY'}} : {{element.origin | currency: ' '}}
                </p>
                <p>
                  {{endDate | date: 'YYYY'}} : {{element.compared | currency: ' '}}
                </p>
                <p *ngIf="element.growth < 0">
                  <span style="color: red;padding-left: 8px;font-size: 16px">  ▼</span>
                  <span style="color: red"> {{element.growth}}  %</span>
                </p>
                <p *ngIf="element.growth >= 0">
                  <span style="color: green;padding-left: 8px;font-size: 16px"> ▲</span>
                  <span style="color: #1b5e20">+{{element.growth}} %</span>
                </p>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="(deviceState.isSmallScreen | async)===true?salesColumnsMobile:salesColumns"></tr>
            <tr matTooltip="{{row}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: (deviceState.isSmallScreen | async)===true?salesColumnsMobile:salesColumns;"></tr>


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
export class SalesGrowthComponent implements OnInit, OnDestroy {
  salesByDayTrendProgress = false;
  trendChart: Highcharts.Chart = undefined;
  isLoading = false;
  noDataRetrieved = true;
  salesData: MatTableDataSource<any>;
  salesColumns = ['date', 'originAmount', 'comparedAmount', 'growth'];
  salesColumnsMobile = ['date', 'growth_mobile'];
  totalSales = 0;
  period = 'week';
  startDate = (new Date().getFullYear() - 1).toString() + '-01-01';
  endDate = toSqlDate(new Date());
  days = new Set();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();
  periodFormControl = new FormControl(this.period);

  constructor(
    private readonly reportService: ReportService,
    private readonly datePipe: DatePipe,
    private readonly snack: MatSnackBar,
    public readonly deviceState: DeviceState,
    private readonly periodDateRangeService: PeriodDateRangeState
  ) {
  }


  ngOnInit(): void {
    // this.startDate = new Date(new Date(this.startDate).setMonth(0));
    // this.startDate = toSqlDate(new Date(new Date(this.startDate).setFullYear(new Date().getFullYear() - 1)));
    this._getSalesGrowth();
    this.periodFormControl.valueChanges.subscribe((value) => {
      if (value) {
        this.period = value;
      }
    });
    this.periodDateRangeService.dateRange.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value) {
        this.startDate = value.startDate;
        this.endDate = value.endDate;
        this._getSalesGrowth();
      }
    });

  }

  private _getSalesGrowth(): void {
    this.isLoading = true;
    this.salesByDayTrendProgress = true;
    this.reportService.getSalesGrowth(this.startDate, new Date(this.startDate).getFullYear() + '-12-30', this.period).then(dataOrigin => {
      const data = [];
      data.push(dataOrigin[0]);

      this.reportService.getSalesGrowth(new Date(this.endDate).getFullYear() + '-01-01', this.endDate, this.period).then(dataCompared => {
        this.isLoading = false;
        this.noDataRetrieved = false;
        const salesGrowthData = {origin: [], compared: []};
        const salesGrowthTableData = [];
        this.days = new Set();
        data.push(dataCompared[0]);
        Object.values(data).forEach(key => {
          key.values.forEach(value => {
            this.days.add(value.date);
          });
        });

        // Calculate Weeks
        const oneJan = new Date(new Date(this.endDate).getFullYear(), 0, 1);
        // @ts-ignore
        const numberOfDays = Math.floor((new Date(this.endDate) - oneJan) / (24 * 60 * 60 * 1000));
        const lastWeek = Math.ceil((new Date(this.endDate).getDay() + 1 + numberOfDays) / 7);

        // @ts-ignore
        this.days = Array.from(this.days).sort((a, b) => a - b);
        Object.values(data).forEach(value => {
          const tempDataArray = [];
          this.days.forEach(date => {
            let filterdSales;

            // @ts-ignore
            filterdSales = value.values.filter(filter => filter.date === date);
            if (filterdSales && filterdSales.length === 1) {
              tempDataArray.push(filterdSales[0].amount);
            } else {
              // if (date <= lastWeek && this.period === 'week'){
              //   tempDataArray.push(0);
              // } else if (date <= new Date(this.endDate).getMonth()) {
              //   tempDataArray.push(0);
              // }
              tempDataArray.push(0);
            }
          });

          let objectId = 'origin';
          if (value.id === '2021') {
            objectId = 'compared';
          }
          salesGrowthData[objectId] = tempDataArray;
        });
        let i = 0;
        const growthDays = [];
        this.days.forEach(value => {
          let increase = salesGrowthData.compared[i] - salesGrowthData.origin[i];
          if (salesGrowthData.origin[i] === 0) {
            increase = increase / salesGrowthData.compared[i] * 100;
          } else {
            increase = increase / salesGrowthData.origin[i] * 100;
          }
          salesGrowthTableData.push({
            date: value,
            origin: salesGrowthData.origin[i],
            compared: salesGrowthData.compared[i],
            growth: increase.toFixed(1)
          });
          growthDays.push(value);
          i++;
        });

        this.initiateGraph(growthDays, salesGrowthData);
        this.salesData = new MatTableDataSource(salesGrowthTableData);
        // this.totalSales = data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
        setTimeout(() => {
          this.salesData.paginator = this.paginator;
          this.salesData.sort = this.sort;
        });
        this.salesByDayTrendProgress = false;
      }).catch(_ => {
        // console.log(_);
        this.isLoading = false;
        this.noDataRetrieved = true;
        this.salesByDayTrendProgress = false;
      });
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

  private initiateGraph(date: any, data: any): any {
    // @ts-ignore
    this.trendChart = Highcharts.chart('salesGrowth', {
      chart: {
        type: 'column'
      },
      title: {
        text: null
      },
      // @ts-ignore
      xAxis: {
        visible: this.deviceState.isSmallScreen.value !== true,
        categories: date,
        crosshair: true
      },
      // @ts-ignore
      yAxis: {
        visible: this.deviceState.isSmallScreen.value !== true,
        title: {
          text: 'Total Sales'
        },
        // labels: {
        //   // tslint:disable-next-line:typedef
        //   formatter() {
        //     return this.value;
        //   }
        // }
      },
      plotOptions: {
        // column: {
        //   grouping: false,
        // }
      },
      tooltip: {
        valueDecimals: 2,
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x} ▲',
        formatter(): any {
          const pointsLabel = ' <span style="color: rgba(124, 181, 236, 1)"> \u25CF</span>  ' + this.points[0].series.name + '<b>: ' +
            this.points[0].y.toFixed(2) + '</b> <br>' + ' <span style="color: rgba(27, 94, 32,.7)"> \u25CF</span>  ' +
            this.points[1].series.name + '<b>: ' + this.points[1].y.toFixed(2) + '</b>';
          let percentLabel;
          let increase = this.points[1].y - this.points[0].y;
          if (this.points[0].y === 0) {
            increase = increase / this.points[1].y * 100;
          } else {
            increase = increase / this.points[0].y * 100;
          }
          if (increase < 0) {
            percentLabel = '<p>' + this.points[0].x + '<span style="margin-left: auto; color: red;padding-left: 8px;font-size: 16px">' +
              '   ▼</span><span style="color: red">' + increase.toFixed(1) + '%</span></p>';
          } else {
            percentLabel = '<p>' + this.points[0].x + '<span style="margin-left: auto; color: green;padding-left: 8px;font-size: 16px">' +
              '   ▲</span><span style="color: #1b5e20">+' + increase.toFixed(1) + '%</span></p>';
          }
          return percentLabel + pointsLabel;
        },
        shared: true,
        useHTML: true,
      },
      // @ts-ignore
      series: [
        {
          name: new Date(this.startDate).getFullYear(),
          color: 'rgba(124, 181, 236, 1)',
          data: data.origin,
          pointPadding: 0,
          // pointPlacement: -0.3
        }, {
          name: new Date(this.endDate).getFullYear(),
          color: 'rgba(27, 94, 32,1)',
          data: data.compared,
          pointPadding: 0,
          pointPlacement: 0
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }
}
