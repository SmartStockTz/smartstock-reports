import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {DeviceInfoUtil, LogService, StorageService, toSqlDate} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, of} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {ProductPerformanceI} from './product-performance.component';
import {ReportService} from '../services/report.service';
import {json2csv} from '../services/json2csv.service';

@Component({
  selector: 'smartstock-profit-by-category',
  template: `
    <div class="col-12">
      <div>
        <mat-card class="mat-elevation-z3">
          <div class="row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">category</mat-icon>
            <p class="mr-auto my-0 h6">Sales By Category</p>
            <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <hr class="w-75 mt-0 mx-auto" color="primary">
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

          <smartstock-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved || isLoading"></smartstock-data-not-ready>

          <div *ngIf="!noDataRetrieved  && !isLoading">
            <table mat-table [dataSource]="productPerformanceDatasource" matSort>

              <!--          <ng-container matColumnDef="product">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>-->
              <!--            <td mat-cell *matCellDef="let element">{{element._id}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
                <td mat-cell *matCellDef="let element">{{element._id}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="quantitySold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity sold</th>
                <td mat-cell *matCellDef="let element">{{element.quantitySold | number}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="sales">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Sales</th>
                <td mat-cell *matCellDef="let element">{{element.sales | currency: 'TZS '}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="firstSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>First sold</th>
                <td mat-cell *matCellDef="let element">{{element.firstSold | date}}</td>
                <td mat-footer-cell *matFooterCellDef>
                </td>
              </ng-container>

              <ng-container matColumnDef="lastSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Last sold</th>
                <td matRipple mat-cell *matCellDef="let element">{{element.lastSold | date}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <!--          <ng-container matColumnDef="costOfGoodSold">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost of goods sold</th>-->
              <!--            <td mat-cell-->
              <!--                *matCellDef="let element">{{element.costOfGoodsSold | currency: ' TZS'}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->

              <!--          <ng-container matColumnDef="grossProfit">-->
              <!--            <th mat-header-cell *matHeaderCellDef mat-sort-header>Gross profit</th>-->
              <!--            <td mat-cell *matCellDef="let element">{{element.sales - element.costOfGoodsSold | currency: ' TZS'}}</td>-->
              <!--            <td mat-footer-cell *matFooterCellDef></td>-->
              <!--          </ng-container>-->


              <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
              <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                  *matRowDef="let row; columns: stockColumns;"></tr>
              <!--          <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="stockColumns"></tr>-->

            </table>
          </div>

          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      </div>

      <mat-menu #exportMenu>
        <button mat-menu-item (click)="exportReport()">
          <mat-icon color="primary">get_app</mat-icon>
          CSV
        </button>
      </mat-menu>
    </div>
  `,
  styleUrls: ['../styles/profit-by-category.style.scss']
})
export class ProfitByCategoryComponent extends DeviceInfoUtil implements OnInit {
  private productPerformanceFetchProgress = false;
  startDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  endDateFormControl = new FormControl(Date.now().toString(), [Validators.nullValidator]);
  channelFormControl = new FormControl('retail', [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  startDate;
  endDate;
  channel = 'retail';  productPerformanceReport: any;
  isLoading = false;
  noDataRetrieved = true;
  @Input() salesChannel;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private readonly router: Router,
              private readonly storageService: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logService: LogService,
              private readonly reportService: ReportService,
  ) {
    super();
  }

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<any[]>;
  productPerformanceDatasource: MatTableDataSource<ProductPerformanceI> = new MatTableDataSource<ProductPerformanceI>([]);
  stockColumns = ['category', 'sales', 'quantitySold', 'firstSold', 'lastSold'];


  ngOnInit(): void {
    this.channelFormControl.setValue('retail');
    this.startDate = toSqlDate(new Date());
    this.endDate = toSqlDate(new Date());

    this.getProductReport(this.channel, this.startDate, this.endDate);
    this.dateRangeListener();

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.productPerformanceDatasource.filter = filterValue.trim().toLowerCase();
    });
  }


  private getProductReport(channel: string, from: string, to: string): void {
    this.isLoading = true; // begin fetching data
    this.productPerformanceFetchProgress = true;
    // console.log('from: ' + from + ' to: ' + to);
    this.reportService.getSalesByCategory(channel, from, to).then(data => {
      this.isLoading = false;
      this.noDataRetrieved = false; // loading is done and some data is received
      this.productPerformanceReport = data.length > 0 ? data[0].total : 0;
      this.productPerformanceDatasource.data = data;
      setTimeout(() => {
        this.productPerformanceDatasource.paginator = this.paginator;
        this.productPerformanceDatasource.sort = this.sort;
      });
      this.productPerformanceFetchProgress = false;
    }).catch(reason => {
      this.isLoading = false;
      this.noDataRetrieved = true;
      this.productPerformanceReport = 0;
      this.snack.open('Fails to get product performance report', 'Ok', {
        duration: 3000
      });
      this.productPerformanceFetchProgress = false;
    });
  }

  private dateRangeListener(): void {
    this.startDateFormControl.valueChanges.subscribe(value => {
      this.startDate = toSqlDate(value);
      this.getProductReport(this.channel, this.startDate, this.endDate);
    });
    this.endDateFormControl.valueChanges.subscribe(value => {
      this.endDate = toSqlDate(value);
      this.getProductReport(this.channel, this.startDate, this.endDate);
    });
    this.channelFormControl.valueChanges.subscribe(value => {
      this.channel = value;
      this.getProductReport(this.channel, this.startDate, this.endDate);
    });
  }

  exportReport(): void {
    const exportedDataColumns = ['_id', 'sales', 'quantitySold', 'firstSold', 'lastSold'];
    json2csv('profit_by_category.csv', exportedDataColumns, this.productPerformanceDatasource.filteredData).catch();
  }
}
