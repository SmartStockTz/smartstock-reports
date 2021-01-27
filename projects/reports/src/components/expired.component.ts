import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {json2csv} from '../services/json2csv.service';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';

@Component({
  selector: 'smartstock-expired-products-report',
  template: `
    <div>
      <div style="display: flex; flex-flow: row; align-items: center;">
        <span style="flex-grow: 1"></span>
        <mat-form-field appearance="outline">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="type here...">
        </mat-form-field>
      </div>

      <mat-card class="mat-elevation-z3">
        <div class="row pt-3 m-0 justify-content-center align-items-center">
          <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">delete</mat-icon>
          <p class="mr-auto my-0 h6">Expired Products</p>
          <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
        <hr class="w-75 mt-0 mx-auto" color="primary">
        <smartstock-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved  || isLoading"></smartstock-data-not-ready>

        <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="expiredProducts" matSort>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
            <td mat-cell *matCellDef="let row">{{row.product}}</td>
          </ng-container>

          <ng-container matColumnDef="expire">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Expiry Date</th>
            <td mat-cell *matCellDef="let row">{{row.expire | date}}</td>
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
  styleUrls: ['../styles/expired.style.scss'],
  providers: [
    ReportService
  ]
})
export class ExpiredComponent implements OnInit, AfterViewInit {
  constructor(private readonly report: ReportService,
              private readonly snack: MatSnackBar) {
  }

  isLoading = false;
  noDataRetrieved = true;
  expiredProducts: MatTableDataSource<any>;
  stockColumns = ['product', 'expire'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.report.getExpiredProducts(new Date(), 0, 1000).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.expiredProducts = new MatTableDataSource(data);
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
      console.log(reason);
      this.snack.open('Fails to get total expired products', 'Ok', {
        duration: 3000
      });
    });

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.expiredProducts.filter = filterValue.trim().toLowerCase();
    });
  }

  exportReport(): void {
    json2csv('expired_report.csv', this.stockColumns, this.expiredProducts.filteredData).catch(reason => {
    });
  }

}
