import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {CartDetailsComponent} from './cart-details.component';
import {DeviceState, StorageService, toSqlDate, UserService} from '@smartstocktz/core-libs';
import * as moment from 'moment';
import {PeriodDateRangeState} from '../states/period-date-range.state';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {database, functions} from 'bfast';
import {SocketController} from "bfast/dist/lib/controllers/socket.controller";

@Component({
  selector: 'app-cart-report',
  template: `
    <app-period-date-range [from]="startDate" [to]="endDate" [hidePeriod]="true"></app-period-date-range>
    <div class="col-12" style="margin-top: 1em; padding: 0">
      <div>
        <mat-form-field style="width: 100%">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here ...">
        </mat-form-field>
      </div>
      <div>
        <mat-card class="mat-elevation-z2">
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
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="carts" matSort>
            <ng-container matColumnDef="channel">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Channel</th>
              <td mat-cell *matCellDef="let element">{{element.channel}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>
            <ng-container matColumnDef="total_amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Amount</th>
              <td mat-cell *matCellDef="let element">{{element.amount | currency: 'TZS '}}</td>
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
              <td mat-cell
                  *matCellDef="let element">{{element.date}} {{element.timer !== null ? element.timer.split('T')[1] : ''}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>
            <tr mat-header-row
                *matHeaderRowDef="(deviceState.isSmallScreen | async)===true?cartColumnsMobile:cartColumns"></tr>
            <tr matTooltip="Click for more details" class="table-data-row" mat-row
                *matRowDef="let row; columns: (deviceState.isSmallScreen | async)===true?cartColumnsMobile:cartColumns;"
                (click)="openCartDetails(row)"></tr>
            <tr mat-footer-row style="font-size: 36px"
                *matFooterRowDef="(deviceState.isSmallScreen | async)===true?cartColumnsMobile:cartColumns"></tr>

          </table>
          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>

          <!--          <mat-nav-list *ngIf="(deviceState.isSmallScreen | async) === false">-->
          <!--            <mat-list-item *ngFor="let cart of carts.connect() | async">-->
          <!--              <h1 matLine>{{cart.date}} {{cart.timer !== null ? cart.timer.split('T')[1] : ''}} | {{cart.channel}}</h1>-->
          <!--            </mat-list-item>-->
          <!--          </mat-nav-list>-->
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
export class CartComponent implements OnInit, OnDestroy {
  startDate;
  endDate;
  isLoading = false;
  noDataRetrieved = true;
  carts: MatTableDataSource<any>;
  cartColumns = ['date', 'channel', 'total_amount', 'total_items', 'seller', 'customer'];
  cartColumnsMobile = ['date', 'total_amount', 'customer'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();
  private changes: SocketController;

  constructor(private readonly report: ReportService,
              private readonly snack: MatSnackBar,
              private cartDetails: MatBottomSheet,
              public readonly deviceState: DeviceState,
              private readonly storageService: StorageService,
              private readonly userService: UserService,
              private readonly periodDateRangeService: PeriodDateRangeState
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.startDate = new Date();
    this.endDate = new Date();
    this.getSoldCarts(this.startDate, this.endDate);
    this.periodDateRangeService.dateRange.pipe(takeUntil(this.destroyer)).subscribe((value) => {
      if (value && value.startDate) {
        this.startDate = value.startDate;
        this.endDate = value.endDate;
        this.getSoldCarts(this.startDate, this.endDate);
      }
    });
    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.carts.filter = filterValue.trim().toLowerCase();
    });

    const shop = await this.userService.getCurrentShop();
    this.changes = functions(shop.projectId).event(
      '/daas-changes',
      () => {
        console.log('connected on sales changes');
        this.changes.emit({
          auth: {
            masterKey: shop.masterKey
          },
          body: {
            projectId: shop.projectId,
            applicationId: shop.applicationId,
            pipeline: [],
            domain: 'sales'
          }
        });
      },
      () => console.log('disconnected on sales changes')
    );
    this.changes.listener(async response => {
      console.log(response);
      if (response && response.body && response.body.change) {
        this.getSoldCarts(this.startDate, this.endDate);
      }
    });
  }

  getSoldCarts(from, to: string): void {
    this.isLoading = true;
    this.report.getSoldCarts(from, to).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.carts = new MatTableDataSource(data);
        setTimeout(() => {
          this.carts.paginator = this.paginator;
          this.carts.sort = this.sort;
        });
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(_ => {
      console.log(_);
      this.isLoading = false;
      this.snack.open('Fails to get total sold products', 'Ok', {
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

  async ngOnDestroy(): Promise<void> {
    this.destroyer.next('done');
    this.periodDateRangeService.dateRange.next(null);
    if (this.changes && this.changes.close) {
      this.changes.close();
    }
  }
}
