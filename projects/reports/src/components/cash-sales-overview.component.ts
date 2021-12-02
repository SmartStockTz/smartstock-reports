import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {DeviceState, toSqlDate} from '@smartstocktz/core-libs';
import {ReportService} from '../services/report.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {CashSalesOverviewModel} from '../models/cash-sales-overview.model';
import {ReportState} from '../states/report.state';

@Component({
  selector: 'app-cash-sales-overview-day',
  template: `
    <div class="cash-sales-day-container">
      <div class="graph-container">
        <div class="" style="min-height: 200px">
          <div id="salesGrowth" class="w-100"></div>
        </div>
      </div>
      <div class="table-container">
        <table mat-table [dataSource]="salesData" matSort>
          <ng-container matColumnDef="date">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
            <td mat-cell
                *matCellDef="let element">{{element.id}}</td>
          </ng-container>
          <ng-container matColumnDef="amount_retail">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Retail</th>
            <td mat-cell *matCellDef="let element">{{element.amount_retail | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="amount_whole">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Whole</th>
            <td mat-cell *matCellDef="let element">{{element.amount_whole | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
            <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="salesColumns"></tr>
          <tr matTooltip="{{row}}" class="table-data-row" mat-row
              *matRowDef="let row; columns: salesColumns;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[50, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styleUrls: ['../styles/cash-sale.style.scss'],
})
export class CashSalesOverviewComponent implements OnInit, AfterViewInit {
  @Input() sales: CashSalesOverviewModel[] = [];
  trendChart: Highcharts.Chart = undefined;
  salesData = new MatTableDataSource<CashSalesOverviewModel>([]);
  salesColumns = ['date', 'amount_retail', 'amount_whole', 'amount'];
  totalSales = 0;
  startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  endDate = toSqlDate(new Date());
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();

  constructor(
    public readonly reportService: ReportService,
    public readonly datePipe: DatePipe,
    public readonly snack: MatSnackBar,
    public readonly reportState: ReportState,
    public readonly deviceState: DeviceState) {
  }

  ngOnInit(): void {
    this.initiateGraph(this.sales);
    this.salesData.data = this.sales;
  }

  private initiateGraph(data: CashSalesOverviewModel[]): any {
    const saleDays = [];
    const saleRetailDays = [];
    const saleWholeDays = [];
    const totalSales = [];
    Object.keys(data).forEach(key => {
      saleDays.push(data[key].id);
      totalSales.push(data[key].amount);
      saleRetailDays.push(data[key].amount_retail);
      saleWholeDays.push(data[key].amount_whole);
    });
    this.trendChart = Highcharts.chart('salesGrowth', {
      chart: {
        type: 'column'
      },
      title: {
        text: null
      },
      xAxis: {
        // allowDecimals: false,
        visible: this.deviceState.isSmallScreen.value !== true,
        categories: saleDays,
        title: {
          text: 'Daily'
        },
        labels: {
          formatter(): string {
            return this.value.toString();
          }
        }
      },
      yAxis: {
        visible: false,
        title: {
          text: 'Total Sales'
        },
        // lineColor: '#1b5e20',
        labels: {
          formatter(): string {
            return this.value.toString();
          }
        }
      },
      tooltip: {
        valueDecimals: 2,
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 1,
          groupPadding: 0,
          shadow: false,
          stacking: 'overlap'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Sales',
          // color: '#0e3a17',
          data: totalSales
        },
        {
          type: 'line',
          name: 'Retail',
          // color: '#4e7218',
          data: saleRetailDays
        },
        {
          type: 'line',
          name: 'Whole',
          // color: '#18722f',
          data: saleWholeDays
        }
      ]
    }, _89 => {
      // console.log(chart);
    });
  }

  ngAfterViewInit(): void {
    this.salesData.paginator = this.paginator;
    this.salesData.sort = this.sort;
  }
}
