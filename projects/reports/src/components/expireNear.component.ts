import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';

@Component({
  selector: 'smartstock-products-about-to-expire',
  template: `
    <div>
      <div style="display: flex; flex-wrap: wrap; flex-flow: row; align-items: center;">
        <span class="flex-grow-1"></span>
        <mat-form-field appearance="outline">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here...">
        </mat-form-field>
      </div>
      <mat-card class="mat-elevation-z3">
        <div class="row pt-3 m-0 justify-content-center align-items-center">
          <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">auto_delete</mat-icon>
          <p class="mr-auto my-0 h6">Products About to Expire</p>
          <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
        <hr class="w-75 mt-0 mx-auto" color="primary">

        <smartstock-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved  || isLoading"></smartstock-data-not-ready>

        <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="expiredProducts" matSort>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
            <td mat-cell *matCellDef="let element">{{element.product}}</td>
          </ng-container>

          <ng-container matColumnDef="expire">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Expiry Date</th>
            <td mat-cell *matCellDef="let element">{{element.expire | date}}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity Remaining</th>
            <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
          <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
              *matRowDef="let row; columns: stockColumns;"></tr>

        </table>

        <mat-paginator [pageSizeOptions]="[5, 20, 100]" showFirstLastButtons></mat-paginator>

      </mat-card>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()">
        <mat-icon color="primary">get_app</mat-icon>
        CSV
      </button>
    </mat-menu>
  `,
  styleUrls: ['../styles/expireNear.style.scss'],
  providers: [
    ReportService
  ]
})
export class ExpireNearComponent implements OnInit {

  constructor(private readonly report: ReportService,
              private readonly snack: MatSnackBar) {
  }

  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  expiredProducts: MatTableDataSource<any>;
  stockColumns = ['product', 'expire', 'quantity'];

  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.isLoading = true;
    this.report.getProductsAboutToExpire().then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.expiredProducts = new MatTableDataSource(data);
        this.stocks = data;
        setTimeout(() => {
          this.expiredProducts.sort = this.sort;
          this.expiredProducts.paginator = this.paginator;
        });
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(reason => {
      this.isLoading = false;
      // console.log(reason);
      this.snack.open('Fails to get total expired products', 'Ok', {
        duration: 3000
      });
    });

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.expiredProducts.filter = filterValue.trim().toLowerCase();
    });
  }

  exportReport(): void {
    json2csv('expire_near_report.csv', this.stockColumns, this.expiredProducts.filteredData).catch(reason => {
    });
  }

}
