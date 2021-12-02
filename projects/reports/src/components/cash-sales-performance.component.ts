import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CashSalesPerformanceProductModel} from '../models/cash-sales-performance-product.model';

@Component({
  selector: 'app-cash-sales-performance',
  template: `
    <div class="cash-sales-day-container">
      <div class="table-container">
        <div class="btn-block">
          <input class="table-filter-input" [formControl]="filterFormControl" placeholder="Type here...">
        </div>
        <table mat-table [dataSource]="salesPerformanceData" matSort>
          <ng-container matColumnDef="id">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Id</th>
            <td mat-cell *matCellDef="let element">{{element.id}}</td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
            <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
          </ng-container>
          <ng-container matColumnDef="amount_sales">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Sales</th>
            <td mat-cell *matCellDef="let element">{{element.amount_sales | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="amount_refund">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Refund</th>
            <td mat-cell *matCellDef="let element">{{element.amount_refund | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Total</th>
            <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="sales">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Sales</th>
            <td mat-cell *matCellDef="let element">{{element.amount | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="purchase">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Cost</th>
            <td mat-cell
                *matCellDef="let element">{{element.purchase | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="profit">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Profit</th>
            <td mat-cell *matCellDef="let element">{{element.profit | currency: ' '}}</td>
          </ng-container>
          <ng-container matColumnDef="margin">
            <th class="column-head" mat-header-cell *matHeaderCellDef mat-sort-header>Margin</th>
            <td mat-cell *matCellDef="let element">{{element.margin | number}}%</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr class="table-data-row" mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[50, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styleUrls: ['../styles/sales-by-category.style.scss', '../styles/index.style.scss'],
})
export class CashSalesPerformanceComponent implements AfterViewInit {
  salesPerformanceData = new MatTableDataSource<CashSalesPerformanceProductModel>([]);
  @Input() columns = [];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  @Input() data: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }

  capitalizeFirstLetter(data): any {
    return data[0].toUpperCase() + data.slice(1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.salesPerformanceData.data = this.data;
      this.salesPerformanceData.paginator = this.paginator;
      this.salesPerformanceData.sort = this.sort;
    }, 10);
  }

}
