import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-products-about-to-expire',
  template: `
    <div>
      <div>
        <mat-form-field class="btn-block">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here...">
        </mat-form-field>
      </div>
      <mat-card class="mat-elevation-z3">
        <div class="row pt-3 m-0 justify-content-center align-items-center">
          <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">auto_delete</mat-icon>
          <p class="mr-auto my-0 h6">About to Expire</p>
          <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
        <hr class="w-75 mt-0 mx-auto" color="primary">

        <app-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved  || isLoading"></app-data-not-ready>

        <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="expiredProducts" matSort>

          <ng-container matColumnDef="details">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Details</th>
            <td mat-cell *matCellDef="let element">
              <p><b>{{element.product}}</b></p>
              <p>Expire at : {{element.expire | date}}</p>
              <p>Remain : {{element.quantity | number}}</p>
            </td>
          </ng-container>

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

          <tr mat-header-row *matHeaderRowDef="(deviceState.isSmallScreen | async)===true?stockColumnsMobile:stockColumns"></tr>
          <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
              *matRowDef="let row; columns: (deviceState.isSmallScreen | async)===true?stockColumnsMobile:stockColumns;"></tr>

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
export class ExpireNearComponent implements OnInit, AfterViewInit {

  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  expiredProducts: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  stockColumns = ['product', 'expire', 'quantity'];
  stockColumnsMobile = ['details'];
  filterFormControl = new FormControl('', [Validators.nullValidator]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private readonly report: ReportService,
              public readonly deviceState: DeviceState,
              private readonly snack: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    this.expiredProducts.sort = this.sort;
    this.expiredProducts.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.report.getProductsAboutToExpire().then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.expiredProducts.data = data;
        this.stocks = data;
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
