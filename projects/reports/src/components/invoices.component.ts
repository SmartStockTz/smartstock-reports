import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {CartDetailsComponent} from './cart-details.component';
import {DeviceInfoUtil, toSqlDate} from '@smartstocktz/core-libs';
import * as moment from 'moment';
import {PeriodDateRangeService} from '../services/period-date-range.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-invoices',
  template: `
    <div class="col-12 m-3">

      <div class="row m-0">
        <app-period-date-range [hidePeriod]="true"></app-period-date-range>
        <span style="flex-grow: 1;"></span>
        <mat-form-field appearance="outline" class="my-0 ml-auto mr-1">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here ...">
        </mat-form-field>
      </div>

      <div>
        <mat-card class="mat-elevation-z3">
          <div class="d-flex flex-row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto report-header-icon">task</mat-icon>
            <p class="mr-auto my-0 h6">Invoices</p>
          </div>

          <hr class="w-75 mt-0 mx-auto">
          <div class="d-flex justify-content-center align-items-center">
            <mat-spinner diameter="30" *ngIf="isLoading" class="position-absolute"></mat-spinner>
            <smartstock-data-not-ready *ngIf="noDataRetrieved  && !isLoading" class="position-absolute"></smartstock-data-not-ready>

            <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="invoiceSummaryData" class="col-7">
              <ng-container matColumnDef="daysLate">
                <td mat-cell *matCellDef="let element" class=" border-bottom-0"> {{element.daysLate}} </td>
              </ng-container>
              <ng-container matColumnDef="quantity">
                <td mat-cell *matCellDef="let element;let i = index" class="text-center text-white px-2 border-bottom-0" [ngClass]="i === 4 ? 'text-dark' : ''" [style.background-color]="i === 0 ? 'green' : i === 1 ? '#ffc107' : i === 2 ? 'coral' : i === 3 ? '#dc3545' : ''"> {{element.quantity}}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <td mat-cell *matCellDef="let element" class="text-right pr-1 border-bottom-0 border-right"> {{element.amount | currency: 'TZS '}} </td>
              </ng-container>
              <ng-container matColumnDef="percent">
                <td mat-cell *matCellDef="let element" class="text-right border-bottom-0">{{(element.amount * 100) / invoiceSummaryData[4].amount | number : '1.0-1'}}%</td>
              </ng-container>

              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="col-lg-5">
              <div style="height: 200px" id="invoicesChart"></div>
            </div>
          </div>

        </mat-card>
        <mat-card class="mat-elevation-z3 my-4">
          <div class="d-flex flex-row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto report-header-icon">task</mat-icon>
            <p class="mr-auto my-0 h6 ">Invoices</p>
            <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
              <mat-icon>get_app</mat-icon>
            </button>
          </div>

          <hr class="w-75 mt-0 mx-auto">

          <!--          <div class="d-flex align-items-center ">-->
          <!--            <span class="flex-grow-1"></span>-->
          <!--          </div>-->

          <div class="d-flex justify-content-center">
            <mat-spinner diameter="30" *ngIf="isLoading"></mat-spinner>
          </div>

          <smartstock-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></smartstock-data-not-ready>
          <!--          <table mat-table *ngIf="!noDataRetrieved  && !isLoading && enoughWidth()" [dataSource]="invoices" matSort>-->
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="invoices" matSort>

            <ng-container matColumnDef="Invoice Id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Invoice Id</th>
              <td mat-cell *matCellDef="let row"> {{row.batchId}} </td>
            </ng-container>
            <ng-container matColumnDef="Customer">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Customer</th>
              <td mat-cell *matCellDef="let row">  {{row.customer.firstName | titlecase}} {{row.customer.secondName | titlecase}} </td>
            </ng-container>
            <ng-container matColumnDef="Amount Due">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount Due</th>
              <td mat-cell *matCellDef="let row"> {{row.amount}} </td>
            </ng-container>
            <ng-container matColumnDef="Amount Paid">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount Paid</th>
              <td mat-cell *matCellDef="let row"> {{calculateTotalReturns(row.returns)}} </td>
            </ng-container>
            <ng-container matColumnDef="Due Date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Due Date</th>
              <td mat-cell *matCellDef="let row"> {{row.dueDate}} </td>
            </ng-container>
            <ng-container matColumnDef="Date of Sale">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Date of Sale</th>
              <td mat-cell *matCellDef="let row"> {{row.date}} </td>
            </ng-container>
            <ng-container matColumnDef="Seller">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Seller</th>
              <td mat-cell
                  *matCellDef="let row"> {{row.sellerObject.firstname | titlecase}} {{row.sellerObject.lastname | titlecase}}  </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="invoicesColumns"></tr>
            <tr matTooltip="Click for more details" class="table-data-row" mat-row
                *matRowDef="let row; columns: invoicesColumns;" (click)="openCartDetails(row)"></tr>
            <!--            <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="invoicesColumns"></tr>-->

          </table>

          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      </div>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()">
        <mat-icon color="primary">get_app</mat-icon>
        CSV
      </button>
    </mat-menu>
  `,
  styleUrls: [],
})
export class InvoicesComponent extends DeviceInfoUtil implements OnInit, OnDestroy {

  constructor(private readonly report: ReportService,
              private readonly snack: MatSnackBar,
              private cartDetails: MatBottomSheet,
              private readonly periodDateRangeService: PeriodDateRangeService
  ) {
    super();
  }

  startDate;
  endDate;
  channel = 'retail';
  isLoading = false;
  noDataRetrieved = true;
  // stocks = [];
  invoices: MatTableDataSource<any>;
  displayedColumns: string[] = ['daysLate', 'quantity', 'amount', 'percent'];
  invoiceSummaryData = [
    {daysLate: 'Current Invoices', quantity: 0, amount: 0},
    {daysLate: '1 - 30 Days Late', quantity: 0, amount: 0},
    {daysLate: '30 - 60 Days Late', quantity: 0, amount: 0},
    {daysLate: '61+ Days Late', quantity: 0, amount: 0},
    {daysLate: 'Total', quantity: 0, amount: 0, totalReturns: 0}
  ];
  invoicesColumns = ['Invoice Id', 'Customer', 'Amount Due', 'Amount Paid', 'Due Date', 'Date of Sale', 'Seller'];
  startDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  endDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() salesChannel;
  destroyer = new Subject();

  ngOnInit(): void {
    this.startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));

    this.endDate = toSqlDate(new Date());

    this.getInvoices(this.startDate, this.endDate);
    this.periodDateRangeService.dateRange.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value.startDate) {
        this.startDate = value.startDate;
        this.endDate = value.endDate;
        this.getInvoices(this.startDate, this.endDate);
      }
    });
    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.invoices.filter = filterValue.trim().toLowerCase();
    });
  }

  getInvoices(from, to: string): void {
    this.isLoading = true;
    this.report.getInvoices(from, to).then(data => {
      this.calculateLateInvoices(data);
      this.initiateGraph(data, this.invoiceSummaryData[4]);
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.invoices = new MatTableDataSource(data);
        console.log(this.invoices);
        setTimeout(() => {
          this.invoices.paginator = this.paginator;
          this.invoices.sort = this.sort;
        });
        // this.stocks = data;
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(_ => {
      this.isLoading = false;
      this.snack.open('Fails to get total expired products', 'Ok', {
        duration: 3000
      });
    });
  }

  calculateTotalReturns(returns: [any]): any {
    if (returns && Array.isArray(returns)) {
      return returns.map(a => a.amount).reduce((a, b, i) => {
        return a + b;
      });
    } else {
      return 0.0;
    }
  }

  calculateLateInvoices(invoices): any {
    this.invoiceSummaryData[4].quantity = invoices.length;

    invoices.forEach(value => {
      let dateDiff = Math.abs(new Date().getTime() - new Date(value.dueDate).getTime());
      dateDiff = Math.ceil(dateDiff / (1000 * 3600 * 24));
      this.invoiceSummaryData[4].totalReturns += this.calculateTotalReturns(value.returns);
      if (dateDiff <= 0) {
        this.invoiceSummaryData[0].quantity++;
        this.invoiceSummaryData[0].amount += (value.amount - this.calculateTotalReturns(value.returns));
      } else if (dateDiff <= 30) {
        this.invoiceSummaryData[1].quantity++;
        this.invoiceSummaryData[1].amount += (value.amount - this.calculateTotalReturns(value.returns));
      } else if (dateDiff <= 60) {
        this.invoiceSummaryData[2].quantity++;
        this.invoiceSummaryData[2].amount += (value.amount - this.calculateTotalReturns(value.returns));
      } else if (dateDiff > 60) {
        this.invoiceSummaryData[3].quantity++;
        this.invoiceSummaryData[3].amount += (value.amount - this.calculateTotalReturns(value.returns));
      }
    });

    this.invoiceSummaryData[4].amount = this.invoiceSummaryData.map(a => a.amount).reduce((a, b, i = 4) => {
      return a + b;
    });
  }

  exportReport(): void {
    const exportedDatainvoicesColumns = ['date', 'amount', 'quantity', 'seller', 'channel', 'items'];
    json2csv('cart_report.csv', exportedDatainvoicesColumns, this.invoices.filteredData.map(x => {
      x.items = x.items.map(y => y.product).join('; ');
      x.date = moment(x.date).local().format('YYYY-MM-DD HH:MM');
      return x;
    })).catch(_ => {
    });
  }

  openCartDetails(cartDetailsData): any {
    this.cartDetails.open(CartDetailsComponent, {
      data: {
        id: cartDetailsData.id,
        channel: cartDetailsData.channel,
        date: cartDetailsData.date,
        amount: cartDetailsData.amount,
        businessName: cartDetailsData.businessName, // cartDetailsData.sellerObject.businessName,
        // sellerFirstName: cartDetailsData.sellerObject.firstname,
        // sellerLastName: cartDetailsData.sellerObject.lastname,
        seller: cartDetailsData.seller,
        customer: cartDetailsData.customer,
        time: cartDetailsData.time,
        region: '', // cartDetailsData.sellerObject.region,
        items: cartDetailsData.items
      }
    });
  }

  // toLocalTime(date: any, time): string {
  //   // return moment(date).local().format('YYYY-MM-DD');
  //   return `${date} ${time}`
  // }
  private initiateGraph(data: any, invoiceTotalSummaryData: any): void {
    // @ts-ignore
    this.InvoicesChart = Highcharts.chart('invoicesChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: null,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      legend: {
        enabled: true,
        // tslint:disable-next-line:typedef
        labelFormatter() {
          // @ts-ignore
          return this.name + ': ' + ((this.y * 100) / (invoiceTotalSummaryData.totalReturns + invoiceTotalSummaryData.amount)).toFixed(1) + '%';
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true,
        }
      },
      series: [{
        name: 'Invoices',
        data: [{
          name: 'Paid',
          color: 'rgba(27, 94, 32,1)',
          y: invoiceTotalSummaryData.totalReturns
        }, {
          name: 'Due',
          y: invoiceTotalSummaryData.amount
        }]
      }]
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }
}
