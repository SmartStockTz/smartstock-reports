import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CartModel} from '../models/cart.model';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {CartDetailsComponent} from './cart-details.component';
import {DeviceInfoUtil, toSqlDate} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-cart-report',
  template: `
    <div class="col-12" style="margin-top: 1em">
      <div>
        <mat-card class="mat-elevation-z3">
          <div class="row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">shopping_cart</mat-icon>
            <p class="mr-auto my-0 h6">Cart Report</p>
            <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <hr class="w-75 mt-0 mx-auto" color="primary">

          <div style="display: flex; flex-flow: row; align-items: center">
            <!--            <h6 class="col-8">Cart Report</h6>-->
            <span style="flex-grow: 1"></span>
          </div>
          <mat-card-header>
            <mat-form-field style="margin: 0 4px;">
              <mat-label>From date</mat-label>
              <input matInput (click)="startDatePicker.open()" [matDatepicker]="startDatePicker"
                     [formControl]="startDateFormControl">
              <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #startDatePicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field style="margin: 0 4px;">
              <mat-label>To date</mat-label>
              <input matInput (click)="endDatePicker.open()" [matDatepicker]="endDatePicker"
                     [formControl]="endDateFormControl">
              <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #endDatePicker></mat-datepicker>
            </mat-form-field>
            <span style="flex-grow: 1;"></span>
            <mat-form-field>
              <mat-label>Filter</mat-label>
              <input matInput [formControl]="filterFormControl" placeholder="Eg. Piriton">
            </mat-form-field>
            <!--<mat-form-field>-->
            <!--<mat-label>Sales type</mat-label>-->
            <!--<mat-select [formControl]="channelFormControl">-->
            <!--<mat-option value="retail">Retail</mat-option>-->
            <!--<mat-option value="whole">Whole sale</mat-option>-->
            <!--</mat-select>-->
            <!--</mat-form-field>-->
          </mat-card-header>


          <div style="display: flex; justify-content: center">
            <mat-spinner diameter="30" *ngIf="isLoading"></mat-spinner>
          </div>

          <smartstock-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></smartstock-data-not-ready>
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading && enoughWidth()" [dataSource]="carts" matSort>

            <ng-container matColumnDef="receipt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Cart Receipt</th>
              <td mat-cell *matCellDef="let element">{{element._id}}</td>
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

            <ng-container matColumnDef="seller">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>
              <td mat-cell
                  *matCellDef="let element">{{element.sellerObject != null ? ((element.sellerObject.firstname | titlecase) + " " + element.sellerObject.lastname | titlecase) : element.seller}} </td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let element">{{element.date }}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cartColumns"></tr>
            <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: cartColumns;" (click)="openCartDetails(row)"></tr>
            <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="cartColumns"></tr>

          </table>

          <table mat-table *ngIf="!noDataRetrieved  && !isLoading && !enoughWidth()" [dataSource]="carts" matSort>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date Sold</th>
              <td mat-cell *matCellDef="let element">{{element.date }}</td>
            </ng-container>

            <ng-container matColumnDef="total_items">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
              <td mat-cell *matCellDef="let element" class="text-center">{{element.quantity}}</td>
            </ng-container>

            <ng-container matColumnDef="total_amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
              <td mat-cell *matCellDef="let element">{{element.amount}}</td>
            </ng-container>


            <!--            <ng-container matColumnDef="seller">-->
            <!--&lt;!&ndash;              <th mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>&ndash;&gt;-->
            <!--              <td mat-cell-->
            <!--                  *matCellDef="let element">{{element.sellerObject != null ? ((element.sellerObject.firstname | titlecase) + " " + element.sellerObject.lastname | titlecase) : element.seller}} </td>-->
            <!--            </ng-container>-->

            <!--            <ng-container matColumnDef="date">-->
            <!--&lt;!&ndash;              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date Sold</th>&ndash;&gt;-->
            <!--              <td mat-cell *matCellDef="let element">{{element.date }}</td>-->
            <!--              <td mat-footer-cell *matFooterCellDef></td>-->
            <!--            </ng-container>-->

            <tr mat-header-row *matHeaderRowDef="cartColumnsMobile"></tr>
            <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: cartColumnsMobile;" (click)="openCartDetails(row)"></tr>

          </table>
          <mat-paginator [pageSizeOptions]="[5, 10, 20, 100]" showFirstLastButtons></mat-paginator>
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
export class CartComponent extends DeviceInfoUtil implements OnInit {

  constructor(private readonly report: ReportService, private readonly snack: MatSnackBar, private _cartDetails: MatBottomSheet) {
    super();
  }

  startDate;
  endDate;
  channel = 'retail';
  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  carts: MatTableDataSource<CartModel>;
  cartColumns = ['receipt', 'total_amount', 'total_items', 'seller', 'date'];
  cartColumnsMobile = ['date', 'total_items', 'total_amount'];

  startDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  channelFormControl = new FormControl('', [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() salesChannel;

  ngOnInit(): void {
    this.channelFormControl.setValue('retail');
    this.startDate = toSqlDate(new Date());
    this.endDate = toSqlDate(new Date());

    this.getSoldCarts(this.channel, this.startDate, this.endDate);
    this.salesChannel.subscribe(value => {
      this.channel = value;
      this.getSoldCarts(value, this.startDate, this.endDate);
    });
    this.dateRangeListener();

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.carts.filter = filterValue.trim().toLowerCase();
    });
  }

  getSoldCarts(channel: string, from, to: string) {
    this.isLoading = true;
    this.report.getSoldCarts(from, to, channel).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.carts = new MatTableDataSource(data);
        setTimeout(() => {
          this.carts.paginator = this.paginator;
          this.carts.sort = this.sort;
        });
        this.stocks = data;
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(reason => {
      this.isLoading = false;
      this.snack.open('Fails to get total expired products', 'Ok', {
        duration: 3000
      });
    });
  }

  exportReport(): void {
    const exportedDataCartColumns = ['_id', 'amount', 'quantity', 'seller', 'date'];
    json2csv('cart_report.csv', exportedDataCartColumns, this.carts.filteredData).catch(reason => {
    });
  }

  private dateRangeListener(): void {
    this.startDateFormControl.valueChanges.subscribe(value => {
      this.startDate = toSqlDate(new Date(value));
      this.getSoldCarts(this.channel, this.startDate, this.endDate);
    });
    this.endDateFormControl.valueChanges.subscribe(value => {
      this.endDate = toSqlDate(new Date(value));
      this.getSoldCarts(this.channel, this.startDate, this.endDate);
    });
    this.channelFormControl.valueChanges.subscribe(value => {
      this.channel = value;
      this.getSoldCarts(this.channel, this.startDate, this.endDate);
    });
  }

  openCartDetails(cartDetailsData): any {
    this._cartDetails.open(CartDetailsComponent, {
      data: {
        id: cartDetailsData._id,
        channel: cartDetailsData.channel,
        date: cartDetailsData.date,
        amount: cartDetailsData.amount,
        businessName: cartDetailsData.sellerObject.businessName,
        sellerFirstName: cartDetailsData.sellerObject.firstname,
        sellerLastName: cartDetailsData.sellerObject.lastname,
        region: cartDetailsData.sellerObject.region,
        items: cartDetailsData.items
      }
    });
  }
}
