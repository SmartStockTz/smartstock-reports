import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DeviceState, LogService, StorageService} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, of} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {ReportService} from '../services/report.service';


@Component({
  selector: 'app-stock-reorder-report',
  template: `
    <div>
      <div>
        <mat-form-field class="btn-block">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterFormControl" placeholder="Type here...">
        </mat-form-field>
      </div>
      <mat-card class="mat-elevation-z3">
        <div class="row pt-3 m-0 justify-content-center align-items-center">
          <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">import_export</mat-icon>
          <p class="mr-auto my-0 h6">Products To Reorder</p>
          <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
        <hr class="w-75 mt-0 mx-auto" color="primary">

        <app-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved || isLoading"></app-data-not-ready>

        <div *ngIf="!noDataRetrieved  && !isLoading">
          <table mat-table [dataSource]="stockReorderDatasource" matSort>

            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Details</th>
              <td mat-cell *matCellDef="let element">
                <p><b>{{element.product}}</b></p>
                <p>Reorder Level : {{element.reorder}}</p>
                <p>Remain : {{element.quantity | number}}</p>
                <p>Supplier : {{element.supplier}}</p>
              </td>
            </ng-container>

            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
              <td mat-cell *matCellDef="let element">{{element.product}}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
              <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
            </ng-container>

            <ng-container matColumnDef="reorder">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Reorder level</th>
              <td mat-cell *matCellDef="let element">{{element.reorder | number}}</td>
            </ng-container>

            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Supplier</th>
              <td matRipple mat-cell *matCellDef="let element">{{element.supplier}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="(deviceState.isSmallScreen | async)===true?stockColumnsMobile:stockColumns"></tr>
            <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: (deviceState.isSmallScreen | async)===true?stockColumnsMobile:stockColumns;"></tr>
          </table>
        </div>
        <mat-paginator [pageSizeOptions]="[5, 10, 50, 100]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()">
        <mat-icon color="primary">get_app</mat-icon>
        CSV
      </button>
    </mat-menu>
  `,
  styleUrls: ['../styles/reorder.style.scss'],
})
export class ReorderComponent implements OnInit, AfterViewInit {

  filterFormControl = new FormControl('', [Validators.nullValidator]);

  startDate;
  endDate;
  stockReportGetProgress = false;
  stockReport;
  isLoading = false;
  noDataRetrieved = true;
  totalPurchase: Observable<number> = of(0);
  units: Observable<any[]>;
  stockReorderDatasource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  stockColumns = ['product', 'quantity', 'reorder', 'supplier'];
  stockColumnsMobile = ['details'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              public readonly deviceState: DeviceState,
              private readonly reportService: ReportService) {
  }

  ngAfterViewInit(): void {
    this.stockReorderDatasource.paginator = this.paginator;
    this.stockReorderDatasource.sort = this.sort;
  }

  ngOnInit(): void {
    this._getStockReport();
    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.stockReorderDatasource.filter = filterValue.trim().toLowerCase();
    });
  }

  private _getStockReport(): void {
    this.isLoading = true;
    this.stockReportGetProgress = true;
    this.reportService.getStockReorderReportReport(0, 10000000000).then(data => {
      this.stockReport = data.length > 0 ? data[0].total : 0;
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.stockReorderDatasource.data = data;
        this.stockReportGetProgress = false;
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(_ => {
      this.isLoading = false;
      this.stockReport = 0;
      this.snack.open('Fails to get total sales', 'Ok', {
        duration: 3000
      });
      this.stockReportGetProgress = false;
    });
  }

  exportReport(): void {
    json2csv('reorder.csv', this.stockColumns, this.stockReorderDatasource.filteredData).catch(reason => {
    });
  }

}
