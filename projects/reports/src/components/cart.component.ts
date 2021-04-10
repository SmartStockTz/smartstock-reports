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
import {DeviceInfoUtil, StorageService, toSqlDate} from '@smartstocktz/core-libs';
import * as moment from 'moment';
import {PeriodDateRangeService} from '../services/period-date-range.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import bfast from 'bfastjs';

@Component({
  selector: 'app-cart-report',
  template: `
    <div class="col-12" style="margin-top: 1em">

      <div class="row m-0">
        <app-period-date-range [hidePeriod]="true"></app-period-date-range>
        <span style="flex-grow: 1;"></span>
        <mat-form-field appearance="outline">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here ...">
        </mat-form-field>
      </div>

      <div>
        <mat-card class="mat-elevation-z3">
          <div class="d-flex flex-row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto report-header-icon">shopping_cart</mat-icon>
            <p class="mr-auto my-0 h6">Cart Report</p>
            <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
              <mat-icon>get_app</mat-icon>
            </button>
          </div>

          <hr class="w-75 mt-0 mx-auto">

          <div style="display: flex; flex-flow: row; align-items: center">
            <span style="flex-grow: 1"></span>
          </div>

          <div style="display: flex; justify-content: center">
            <mat-spinner diameter="30" *ngIf="isLoading"></mat-spinner>
          </div>

          <app-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></app-data-not-ready>
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading && enoughWidth()" [dataSource]="carts" matSort>

            <ng-container matColumnDef="channel">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Channel</th>
              <td mat-cell *matCellDef="let element">{{element.channel}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="total_amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Amount</th>
              <td mat-cell *matCellDef="let element">{{element.amount}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="total_items">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Items</th>
              <td mat-cell *matCellDef="let element">{{element.quantity}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
              <td mat-cell
                  *matCellDef="let element">{{element.customer !== null ? element.customer : 'N/A'}} </td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="seller">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>
              <td mat-cell
                  *matCellDef="let element">{{element.sellerObject != null ? ((element.sellerObject.firstname | titlecase) + " " + element.sellerObject.lastname | titlecase) : element.seller}} </td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let element">{{element.date}} {{element.timer !== null ? element.timer.split('T')[1] : ''}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cartColumns"></tr>
            <tr matTooltip="Click for more details" class="table-data-row" mat-row
                *matRowDef="let row; columns: cartColumns;" (click)="openCartDetails(row)"></tr>
            <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="cartColumns"></tr>

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
  styleUrls: ['../styles/cart.component.scss'],
})
export class CartComponent extends DeviceInfoUtil implements OnInit, OnDestroy {

  startDate;
  endDate;
  channel = 'retail';
  isLoading = false;
  noDataRetrieved = true;
  // stocks = [];
  carts: MatTableDataSource<any>;
  cartColumns = ['date', 'channel', 'total_amount', 'total_items', 'seller', 'customer'];
  cartColumnsMobile = ['date', 'total_amount', 'total_items'];

  startDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  endDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() salesChannel;
  destroyer = new Subject();

  constructor(private readonly report: ReportService, private readonly snack: MatSnackBar,
              private cartDetails: MatBottomSheet, private readonly storageService: StorageService,
              private readonly periodDateRangeService: PeriodDateRangeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.startDate = toSqlDate(new Date(new Date().setDate(new Date().getDate() - 7)));

    this.endDate = toSqlDate(new Date());
    this.getSoldCarts(this.channel, this.startDate, this.endDate);
    // this.salesChannel.subscribe(value => {
    //   this.channel = value;
    //   this.getSoldCarts(value, this.startDate, this.endDate);
    // });
    this.periodDateRangeService.dateRange.pipe(
      takeUntil(this.destroyer)
    ).subscribe((value) => {
      if (value.startDate) {
        this.startDate = value.startDate;
        this.endDate = value.endDate;
        this.getSoldCarts(this.channel, this.startDate, this.endDate);
      }
    });
    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.carts.filter = filterValue.trim().toLowerCase();
    });

    const salesChange = bfast.database().table('sales').query().changes(() => {
      console.log('conncted');
    }, () => {
      console.log('your disconnected');
    });
    salesChange.addListener(response => {
      console.log(response);
    });

    let alreadyExc = false;
    this.storageService.getActiveUser().then(value => {
      const salesChanges = bfast.database(value.projectId).table('sales').query().changes(() => {
        console.log('sales track connected');
        if (alreadyExc){
          this.getSoldCarts('', this.startDate, this.endDate);
        }
        alreadyExc = true;
      }, () => {
        console.log('sales track disconnected');
      });
      salesChanges.addListener(response => {
        if (response && response.body && response.body.change){
          this.getSoldCarts('', this.startDate, this.endDate);
        }
      });
    }).catch(_ => {});
  }

  getSoldCarts(channel: string, from, to: string): void {
    this.isLoading = true;
    this.report.getSoldCarts(from, to, channel).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.carts = new MatTableDataSource(data);
        setTimeout(() => {
          this.carts.paginator = this.paginator;
          this.carts.sort = this.sort;
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

  exportReport(): void {
    const exportedDataCartColumns = ['date', 'amount', 'quantity', 'seller', 'channel', 'items'];
    json2csv('cart_report.csv', exportedDataCartColumns, this.carts.filteredData.map(x => {
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

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }
}
