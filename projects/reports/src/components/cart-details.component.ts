import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {MatTableDataSource} from '@angular/material/table';
import {CartModel} from '../models/cart.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'smartstock-cart-details',
  template: `
    <div class="w-100 m-0 p-0">
      <div class="row header text-white align-items-center p-3">
        <div class="col-6 header-icon">
          <mat-icon class="ml-auto p-3">shopping_cart</mat-icon>
          <p>Cart Details</p>
        </div>
        <div class="col-6 text-right">
          <h3 class="mb-0">{{data.businessName}}</h3>
          <p class="mb-0">{{data.region}}</p>
          <p>{{data.date | date}}</p>
        </div>
      </div>
      <div class="row px-3 pt-4 m-0 justify-content-between">
        <div>
          <p class="mb-0">Receipt No.</p>
          <p>{{data.id}}</p>
        </div>
        <div>
          <p class="mb-0">Seller</p>
          <p>{{data.sellerFirstName | titlecase }} {{data.sellerLastName | titlecase}}</p>
        </div>
      </div>
      <hr class="my-0">

      <div class="py-3">
        <table mat-table [dataSource]="cartData" matSort>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let element">{{element.product}}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Quantity</th>
            <td mat-cell *matCellDef="let element">{{element.quantity}}</td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell
                *matCellDef="let element">{{data.channel === 'retail' ? element.retailPrice : element.wholesalePrice}} </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let element">{{element.amount }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cartDataColumns"></tr>
          <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
              *matRowDef="let row; columns: cartDataColumns;"></tr>

        </table>
        <mat-paginator *ngIf="cartData.data.length > 5" [pageSizeOptions]="[5, 10, 20, 100]" showFirstLastButtons></mat-paginator>
        <div class="d-flex pt-4 align-items-center justify-content-between">
          <h3 class="text-center col-4 ">Total</h3>
          <h2 class="text-white py-3 col-7 col-md-5 col-lg-6 text-center" style="background: #1b5e20;">{{data.amount | currency: ' '}}
            /=</h2>
        </div>
      </div>
      <p class="text-center" style="color: #1b5e20">smartstock.co.tz</p>
    </div>
  `,
  styleUrls: ['../styles/cart-details.style.scss'],

})
export class CartDetailsComponent implements OnInit {

  cartData: MatTableDataSource<any>;
  cartDataColumns = ['product', 'quantity', 'price', 'amount'];

  constructor(private cartDetailsSheetRef: MatBottomSheetRef<CartDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    console.log(this.data.items);
    this.cartData = new MatTableDataSource(this.data.items);
    this.cartData.paginator = this.paginator;
    this.cartData.sort = this.sort;
  }

  close(): void {
    this.cartDetailsSheetRef.dismiss();
  }
}
