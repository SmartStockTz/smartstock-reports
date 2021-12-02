import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, Validators} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {CartDetailsComponent} from './cart-details.component';
import {DeviceState, UserService} from '@smartstocktz/core-libs';
import {functions} from 'bfast';
import {SocketController} from 'bfast/dist/lib/controllers/socket.controller';
import {CashSalesTrackModel} from '../models/cash-sales-track.model';

@Component({
  selector: 'app-cash-sale-tracking',
  template: `
    <div class="cash-sales-day-container">
      <div class="table-container">
        <input class="table-filter-input" [formControl]="filterFormControl" placeholder="Type to filter ...">
        <table mat-table [dataSource]="carts" matSort>
          <ng-container matColumnDef="channel">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Channel</th>
            <td mat-cell *matCellDef="let element">{{element.channel}}</td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <ng-container matColumnDef="total_amount">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Total Amount</th>
            <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <!--          <ng-container matColumnDef="total_items">-->
          <!--            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Items</th>-->
          <!--            <td mat-cell *matCellDef="let element">{{element.items?.length}}</td>-->
          <!--            <td mat-footer-cell *matFooterCellDef></td>-->
          <!--          </ng-container>-->
          <ng-container matColumnDef="customer">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
            <td mat-cell
                *matCellDef="let element">{{element.customer}} </td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <ng-container matColumnDef="seller">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>
            <td mat-cell
                *matCellDef="let element">{{element.seller}} </td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
            <td mat-cell
                *matCellDef="let element">{{element.time | date: 'YYYY-MM-dd HH:MM' }}</td>
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
        <mat-paginator [pageSizeOptions]="[50, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styleUrls: ['../styles/cart.component.scss', '../styles/cash-sale.style.scss'],
})
export class CashSalesTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: CashSalesTrackModel[] = [];
  carts = new MatTableDataSource<any>();
  cartColumns = ['date', 'channel', 'total_amount', 'seller', 'customer'];
  cartColumnsMobile = ['date', 'total_amount', 'customer'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() reload = new EventEmitter<{ from: Date, to: Date }>();

  private changes: SocketController;

  constructor(private cartDetails: MatBottomSheet,
              public readonly deviceState: DeviceState,
              private readonly userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.carts.filter = filterValue.trim().toLowerCase();
    });
    const shop = await this.userService.getCurrentShop();
    this.changes = functions(shop.projectId).event(
      '/daas-changes',
      () => {
        console.log('connected on sales track changes');
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
      // console.log(response);
      if (response && response.body && response.body.change) {
        this.reload.emit({
          from: new Date(),
          to: new Date()
        });
      }
    });
  }

  openCartDetails(cartDetailsData): any {
    this.cartDetails.open(CartDetailsComponent, {
      data: {
        id: cartDetailsData.id,
        channel: cartDetailsData.channel,
        date: cartDetailsData.date,
        amount: cartDetailsData.amount,
        businessName: cartDetailsData.businessName,
        seller: cartDetailsData.seller,
        customer: cartDetailsData.customer,
        time: cartDetailsData.time,
        region: '',
        items: cartDetailsData.items
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.carts.data = this.data;
      this.carts.paginator = this.paginator;
      this.carts.sort = this.sort;
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.changes && this.changes.close) {
      this.changes.close();
    }
  }
}
