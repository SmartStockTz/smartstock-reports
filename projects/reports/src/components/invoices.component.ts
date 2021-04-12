import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DeviceInfoUtil, toSqlDate} from '@smartstocktz/core-libs';
import * as moment from 'moment';
import {PeriodDateRangeService} from '../services/period-date-range.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {InvoiceDetailsComponent} from './invoice-details.component';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-invoices',
  template: `
    <div class="col-12 m-3">
      <app-period-date-range [hidePeriod]="true"></app-period-date-range>
      <div class="row m-0">
        <span style="flex-grow: 1;"></span>
        <mat-form-field appearance="outline" class="mx-4">
          <mat-select [formControl]="invoicesStatusFormControl">
            <mat-option value="">All Invoices</mat-option>
            <mat-option value="paid">Paid Invoices</mat-option>
            <mat-option value="due">Unpaid Invoices</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="my-0 ml-auto mr-1">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here ...">
        </mat-form-field>
      </div>

      <div>
        <mat-card class="mat-elevation-z3">
          <div class="d-flex flex-row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto report-header-icon">receipt</mat-icon>
            <p class="mr-auto my-0 h6">Invoices</p>
          </div>

          <hr class="w-75 mt-0 mx-auto">
          <div class="row justify-content-center align-items-center">
            <mat-spinner diameter="30" *ngIf="isLoading" class="position-absolute"></mat-spinner>
            <app-data-not-ready *ngIf="noDataRetrieved  && !isLoading" class="position-absolute"></app-data-not-ready>

            <table mat-table *ngIf="!noDataRetrieved  && !isLoading && invoicesStatusFormControl.value !== 'paid'" [dataSource]="invoiceSummaryData" class="col-12 col-lg-7">
              <ng-container matColumnDef="daysLate">
                <td mat-cell *matCellDef="let element" class=" border-bottom-0"> {{element.daysLate}}</td>
              </ng-container>
              <ng-container matColumnDef="quantity">
                <td mat-cell *matCellDef="let element;let i = index" class="text-center text-white px-2 border-bottom-0"
                    [ngClass]="i === 4 ? 'text-dark' : ''"
                    [style.background-color]="i === 0 ? 'green' : i === 1 ? '#ffc107' : i === 2 ? 'coral' : i === 3 ? '#dc3545' : ''"> {{element.quantity}}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <td mat-cell *matCellDef="let element"
                    class="text-right pr-1 border-bottom-0 border-right"> {{element.amount | currency: 'TZS '}} </td>
              </ng-container>
              <ng-container matColumnDef="percent">
                <td mat-cell *matCellDef="let element"
                    class="text-right border-bottom-0">{{(element.amount * 100) / invoiceSummaryData[4].amount | number : '1.0-1'}}%
                </td>
              </ng-container>

              <tr mat-row *matRowDef="let row; columns: displayedColumns;" [hidden]="!row.displarRow"></tr>
            </table>

            <div class="col-12 col-lg-5">
              <div class="row" style="height: 200px;" id="invoicesChart"></div>
              <h3 class="text-center" *ngIf="!noDataRetrieved  && !isLoading"> Total Invoices: {{invoicesBackup.data.length | number}}</h3>
            </div>
          </div>

        </mat-card>
        <mat-card class="mat-elevation-z3 my-4">
          <div class="d-flex flex-row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto report-header-icon">receipt</mat-icon>
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

          <app-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></app-data-not-ready>
          <!--          <table mat-table *ngIf="!noDataRetrieved  && !isLoading && enoughWidth()" [dataSource]="invoices" matSort>-->
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="invoices" matSort>

            <ng-container matColumnDef="batchId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
              <td mat-cell *matCellDef="let row; let i = index"> {{i + 1}} </td>
<!--              <td mat-cell *matCellDef="let row"> {{row.batchId}} </td>-->
            </ng-container>
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Customer</th>
              <td mat-cell *matCellDef="let row">  {{row.customerName | titlecase}} </td>
            </ng-container>
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount Due</th>
              <td mat-cell *matCellDef="let row"> {{row.amount}} </td>
            </ng-container>
            <ng-container matColumnDef="amountPaid">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount Paid</th>
              <td mat-cell *matCellDef="let row"> {{row.amountPaid}} </td>
            </ng-container>
            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Due Date</th>
              <td mat-cell *matCellDef="let row"> {{row.dueDate | date: 'MMM d, y, H:mm'}} </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Date of Sale</th>
              <td mat-cell *matCellDef="let row"> {{row.date | date: 'MMM d, y, H:mm'}}</td>
            </ng-container>
            <ng-container matColumnDef="seller">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Seller</th>
              <td mat-cell
                  *matCellDef="let row"> {{row.seller | titlecase}} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="invoicesColumns"></tr>
            <tr matTooltip="Click for more details" class="table-data-row" mat-row
                *matRowDef="let row; columns: invoicesColumns;" (click)="openInvoiceDetails(row)"></tr>
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

  startDate;
  endDate;
  channel = 'retail';
  isLoading = false;
  noDataRetrieved = true;
  invoices: MatTableDataSource<any>;
  invoicesBackup: MatTableDataSource<any>;
  displayedColumns: string[] = ['daysLate', 'quantity', 'amount', 'percent'];
  invoiceSummaryData = [
    {daysLate: 'Current Invoices', quantity: 0, amount: 0, displarRow: true},
    {daysLate: '1 - 30 Days Late', quantity: 0, amount: 0, displarRow: false},
    {daysLate: '30 - 60 Days Late', quantity: 0, amount: 0, displarRow: false},
    {daysLate: '61+ Days Late', quantity: 0, amount: 0, displarRow: false},
    {daysLate: 'Total', quantity: 0, amount: 0, totalReturns: 0, displarRow: true}
  ];
  invoicesColumns = ['batchId', 'customer', 'amount', 'amountPaid', 'dueDate', 'date', 'seller'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  invoicesStatusFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() salesChannel;
  destroyer = new Subject();

  constructor(private readonly report: ReportService,
              private readonly snack: MatSnackBar,
              private cartDetails: MatBottomSheet,
              private readonly periodDateRangeService: PeriodDateRangeService,
              private invoiceDetails: MatBottomSheet
  ) {
    super();
  }


  ngOnInit(): void {
    this.startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    this.endDate = toSqlDate(new Date());

    this.getInvoices();
    this.periodDateRangeService.dateRange.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value.startDate) {
        this.startDate = value.startDate;
        this.endDate = value.endDate;
        this.getInvoices();
      }
    });

    this.applyMultipleFiltering();
  }

  getInvoices(): void {
    this.isLoading = true;
    this.report.getInvoices(this.startDate, this.endDate).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.invoices = new MatTableDataSource(this.addComplexObjectRow(data));
        this.invoicesBackup = new MatTableDataSource(this.addComplexObjectRow(data));
        setTimeout(() => {
          this.invoices.paginator = this.paginator;
          this.invoices.sort = this.sort;
        });
        this.calculateLateInvoices(data);
        this.initiateGraph(this.invoiceSummaryData[4]);
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(_ => {
      this.isLoading = false;
      this.snack.open('Fails to get Invoices', 'Ok', {
        duration: 3000
      });
    });
  }

  applyMultipleFiltering(): void {
    let filterVal: any;
    this.invoicesStatusFormControl.valueChanges.subscribe(filterValue => {
      this.invoices.data = this.invoicesBackup.data;
      this.invoices.filter = filterValue.trim().toLowerCase();
      filterVal = this.invoices.filteredData;
      this.filterFormControl.setValue('');
      console.log(this.invoicesBackup.data);
      console.log(filterVal);
    });
    this.filterFormControl.valueChanges.subscribe(filterValue => {
      console.log(filterVal);
      this.invoices.data = filterVal === undefined ? this.invoicesBackup.data : filterVal;
      this.invoices.filter = filterValue.trim().toLowerCase();
    });
  }

  addComplexObjectRow(data: any): any {
    return data.map((row: any) =>
      ({
        ...row,
        customerName: row.customer.firstName + ' ' + row.customer.secondName,
        seller: row.sellerObject.firstname + ' ' + row.sellerObject.lastname,
        amountPaid: this.calculateTotalReturns(row.returns),
        status: (row.amount - this.calculateTotalReturns(row.returns) > 0 ? 'due' : 'paid'),
      })
    );
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

    let selctedDateDiff = Math.abs(new Date(this.endDate).getTime() - new Date(this.startDate).getTime());
    selctedDateDiff = Math.ceil(selctedDateDiff / (1000 * 3600 * 24));

    invoices.forEach(value => {
      let dateDiff = Math.abs(new Date().getTime() - new Date(value.dueDate).getTime());
      dateDiff = Math.ceil(dateDiff / (1000 * 3600 * 24));
      this.invoiceSummaryData[4].totalReturns += this.calculateTotalReturns(value.returns);
      const amountDue = value.amount - this.calculateTotalReturns(value.returns);
      if (dateDiff <= 0 && amountDue > 0) {
        this.invoiceSummaryData[0].quantity++;
        this.invoiceSummaryData[0].amount += amountDue;
      } else if (dateDiff <= 30 && amountDue > 0) {
        this.invoiceSummaryData[1].quantity++;
        this.invoiceSummaryData[1].amount += amountDue;
        this.invoiceSummaryData[1].displarRow = selctedDateDiff > 0;
      } else if (dateDiff > 30 && dateDiff <= 60 && amountDue > 0) {
        this.invoiceSummaryData[2].quantity++;
        this.invoiceSummaryData[2].amount += amountDue;
        this.invoiceSummaryData[2].displarRow = selctedDateDiff > 30;
      } else if (dateDiff > 60 && amountDue > 0) {
        this.invoiceSummaryData[3].quantity++;
        this.invoiceSummaryData[3].amount += amountDue;
        this.invoiceSummaryData[3].displarRow = selctedDateDiff > 60;
      }
    });

    this.invoiceSummaryData[4].quantity = this.invoiceSummaryData.map(a => a.quantity).reduce((a, b, i = 4) => {
      return a + b;
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

  openInvoiceDetails(invoiceDetailsData): any {
    console.log(invoiceDetailsData);
    this.invoiceDetails.open(InvoiceDetailsComponent, {
      data: {
        id: invoiceDetailsData.id,
        date: invoiceDetailsData.date,
        amount: invoiceDetailsData.amount,
        businessName: invoiceDetailsData.sellerObject.businessName,
        seller: invoiceDetailsData.seller,
        region: invoiceDetailsData.sellerObject.region,
        items: invoiceDetailsData.items,
        returns: invoiceDetailsData.returns,
        customer: invoiceDetailsData.customerName,
        customerCompany: invoiceDetailsData.customer.company
      }
    });
  }
  // toLocalTime(date: any, time): string {
  //   // return moment(date).local().format('YYYY-MM-DD');
  //   return `${date} ${time}`
  // }
  private initiateGraph(invoiceTotalSummaryData: any): void {
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
