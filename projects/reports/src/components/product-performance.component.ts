import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { toSqlDate } from "smartstock-core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, of, Subject } from "rxjs";
import { UntypedFormControl, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { ReportService } from "../services/report.service";
import { json2csv } from "../services/json2csv.service";

export interface ProductPerformanceI {
  _id: string;
  quantitySold: number;
  purchase: any;
  firstSold: any;
  lastSold: any;
  sales: number;
  costOfGoodsSold: number;
  grossProfit: number;
}

@Component({
  selector: "app-product-performance-report",
  template: `
    <div class="col-lg-11 mx-auto py-4">
      <div>
        <mat-card class="mat-elevation-z3">
          <div class="row pt-3 m-0 justify-content-center align-items-center">
            <mat-icon
              color="primary"
              class="ml-auto"
              style="width: 40px;height:40px;font-size: 36px"
              >shopping_cart</mat-icon
            >
            <p class="mr-auto my-0 h6">Product Sales Summary</p>
            <button
              [mat-menu-trigger-for]="exportMenu"
              class="mr-1 ml-0"
              mat-icon-button
            >
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <hr class="w-75 mt-0 mx-auto" color="primary" />
          <mat-card-header>
            <mat-form-field style="margin: 0 4px;">
              <mat-label>From date</mat-label>
              <input
                matInput
                (click)="startDatePicker.open()"
                [matDatepicker]="startDatePicker"
                [formControl]="startDateFormControl"
              />
              <mat-datepicker-toggle
                matSuffix
                [for]="startDatePicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #startDatePicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field style="margin: 0 4px;">
              <mat-label>To date</mat-label>
              <input
                matInput
                (click)="endDatePicker.open()"
                [matDatepicker]="endDatePicker"
                [formControl]="endDateFormControl"
              />
              <mat-datepicker-toggle
                matSuffix
                [for]="endDatePicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #endDatePicker></mat-datepicker>
            </mat-form-field>
            <span style="flex-grow: 1;"></span>
            <mat-form-field>
              <mat-label>Filter</mat-label>
              <input
                matInput
                [formControl]="filterFormControl"
                placeholder="Eg. Piriton"
              />
            </mat-form-field>
            <!--<mat-form-field>-->
            <!--<mat-label>Sales type</mat-label>-->
            <!--<mat-select [formControl]="channelFormControl">-->
            <!--<mat-option value="retail">Retail</mat-option>-->
            <!--<mat-option value="whole">Whole sale</mat-option>-->
            <!--</mat-select>-->
            <!--</mat-form-field>-->
          </mat-card-header>

          <app-data-not-ready
            [isLoading]="isLoading"
            *ngIf="noDataRetrieved || isLoading"
          ></app-data-not-ready>

          <div *ngIf="!noDataRetrieved && !isLoading">
            <table
              mat-table
              [dataSource]="productPerformanceDatasource"
              matSort
            >
              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Product
                </th>
                <td mat-cell *matCellDef="let element">{{ element._id }}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Category
                </th>
                <td mat-cell *matCellDef="let element">
                  {{ element.category }}
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="quantitySold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Quantity
                </th>
                <td mat-cell *matCellDef="let element">
                  {{ element.quantitySold | number }}
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="firstSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  First sold
                </th>
                <td mat-cell *matCellDef="let element">
                  {{ element.firstSold }}
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="lastSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Last sold
                </th>
                <td matRipple mat-cell *matCellDef="let element">
                  {{ element.lastSold }}
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="costOfGoodSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Cost of goods sold
                </th>
                <td mat-cell *matCellDef="let element">
                  {{ element.costOfGoodsSold | currency: " TZS" }}
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="grossProfit">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Gross profit
                </th>
                <td mat-cell *matCellDef="let element">
                  {{
                    element.sales - element.costOfGoodsSold | currency: " TZS"
                  }}
                </td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
              <tr
                matTooltip="{{ row.product }}"
                class="table-data-row"
                mat-row
                *matRowDef="let row; columns: stockColumns"
              ></tr>
              <!--          <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="stockColumns"></tr>-->
            </table>
          </div>

          <mat-paginator
            [pageSizeOptions]="[5, 10, 20, 100]"
            showFirstLastButtons
          ></mat-paginator>
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
  styleUrls: ["../styles/product-performance.style.scss"],
  providers: [ReportService]
})
export class ProductPerformanceComponent implements OnInit, OnDestroy {
  private productPerformanceFetchProgress = false;
  startDateFormControl = new UntypedFormControl(new Date(), [
    Validators.nullValidator
  ]);
  endDateFormControl = new UntypedFormControl("", [Validators.nullValidator]);
  channelFormControl = new UntypedFormControl("", [Validators.nullValidator]);
  filterFormControl = new UntypedFormControl("", [Validators.nullValidator]);

  startDate;
  endDate;
  channel = "retail";
  productPerformanceReport: any;
  isLoading = false;
  noDataRetrieved = true;
  @Input() salesChannel;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();

  constructor(
    private readonly snack: MatSnackBar,
    private readonly reportService: ReportService
  ) {}

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<any[]>;
  productPerformanceDatasource: MatTableDataSource<ProductPerformanceI>;
  stockColumns = [
    "product",
    "category",
    "quantitySold",
    "firstSold",
    "lastSold",
    "costOfGoodSold",
    "grossProfit"
  ];

  ngOnInit(): void {
    // this.channelFormControl.setValue('retail');
    // this.startDate = toSqlDate(new Date());
    // this.endDate = toSqlDate(new Date());
    // this.getProductReport(this.startDate, this.endDate);
    // this.filterFormControl.valueChanges.subscribe(filterValue => {
    //   this.productPerformanceDatasource.filter = filterValue.trim().toLowerCase();
    // });
  }

  private getProductReport(from: string, to: string): void {
    // this.isLoading = true; // begin fetching data
    // this.productPerformanceFetchProgress = true;
    // this.reportService.getProductPerformanceReport(from, to).then(data => {
    //   this.isLoading = false;
    //   this.noDataRetrieved = false; // loading is done and some data is received
    //   this.productPerformanceReport = data.length > 0 ? data[0].total : 0;
    //   this.productPerformanceDatasource = new MatTableDataSource(data);
    //   setTimeout(() => {
    //     this.productPerformanceDatasource.paginator = this.paginator;
    //     this.productPerformanceDatasource.sort = this.sort;
    //   });
    //   this.productPerformanceFetchProgress = false;
    // }).catch(reason => {
    //   this.isLoading = false;
    //   this.noDataRetrieved = true;
    //   this.productPerformanceReport = 0;
    //   this.snack.open('Fails to get product performance report', 'Ok', {
    //     duration: 3000
    //   });
    //   this.productPerformanceFetchProgress = false;
    // });
  }

  private dateRangeListener(): void {
    // this.startDateFormControl.valueChanges.subscribe(value => {
    //   this.startDate = toSqlDate(value);
    //   this.getProductReport(this.startDate, this.endDate);
    // });
    // this.endDateFormControl.valueChanges.subscribe(value => {
    //   this.endDate = toSqlDate(value);
    //   this.getProductReport(this.startDate, this.endDate);
    // });
    // this.channelFormControl.valueChanges.subscribe(value => {
    //   this.channel = value;
    //   this.getProductReport(this.startDate, this.endDate);
    // });
  }

  exportReport(): void {
    // const exportedDataColumns = ['_id', 'category', 'quantitySold', 'firstSold', 'lastSold', 'costOfGoodsSold', 'grossProfit'];
    // json2csv('product_performance.csv', exportedDataColumns, this.productPerformanceDatasource.filteredData).catch();
  }

  ngOnDestroy(): void {
    // this.destroyer.next('done');
  }
}
