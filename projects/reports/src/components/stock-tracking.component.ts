import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {Observable, Subject} from 'rxjs';
import {PeriodDateRangeState} from '../states/period-date-range.state';


function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return {invalidAutocompleteObject: {value: control.value}};
    }
    return null;  /* valid option selected */
  };
}

@Component({
  selector: 'app-stock-tracking',
  template: `
<!--    <div class=" mx-auto" style="margin-top: 1em">-->
<!--      <div class="row mx-0 justify-content-between">-->
<!--        <mat-form-field appearance="outline" class="col-md-10 col-lg-5 ">-->
<!--          <mat-label>Product</mat-label>-->
<!--          <input type="text"-->
<!--                 matInput-->
<!--                 [formControl]="productFormControl"-->
<!--                 [matAutocomplete]="auto">-->
<!--          <mat-autocomplete #auto="matAutocomplete">-->
<!--            <mat-option *ngFor="let product of filteredProducts | async" [value]="product.product"-->
<!--                        (onSelectionChange)="updateStockId(product)">-->
<!--              {{product.product}}-->
<!--            </mat-option>-->
<!--          </mat-autocomplete>-->
<!--          <mat-error *ngIf="productFormControl.hasError('invalidAutocompleteObject')">-->
<!--            Product name not recognized. Click one of the autocomplete options.-->
<!--          </mat-error>-->
<!--        </mat-form-field>-->
<!--        <div class="m-5">-->
<!--        </div>-->
<!--        <app-period-date-range [hidePeriod]="true"></app-period-date-range>-->
<!--      </div>-->
<!--      <div class="py-3">-->
<!--        <mat-card class="mat-elevation-z3">-->
<!--          <div class="row pt-3 m-0 justify-content-center align-items-center">-->
<!--            <mat-icon color="primary" class="ml-auto" style="width: 40px;height:40px;font-size: 36px">find_in_page-->
<!--            </mat-icon>-->
<!--            <p class="mr-auto my-0 h6">{{productName  | titlecase}} </p>-->
<!--            <button [mat-menu-trigger-for]="exportMenu" class="mr-1 ml-0" mat-icon-button>-->
<!--              <mat-icon>get_app</mat-icon>-->
<!--            </button>-->
<!--          </div>-->
<!--          <hr class="w-75 mt-0 mx-auto">-->

<!--          <div style="display: flex; flex-flow: row; align-items: center">-->
<!--            <span style="flex-grow: 1"></span>-->
<!--          </div>-->
<!--          <div class="d-flex justify-content-center align-items-center m-0 p-0">-->
<!--            <app-data-not-ready [width]="100" height="100" [isLoading]="isLoading"-->
<!--                                *ngIf="noDataRetrieved || isLoading"></app-data-not-ready>-->
<!--          </div>-->
<!--          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="stockTrackingData" matSort>-->
<!--            <ng-container matColumnDef="date">-->
<!--              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>-->
<!--              <td mat-cell-->
<!--                  *matCellDef="let element">{{element.date | date: 'dd MMM YYYY'}}</td>-->
<!--              <td mat-footer-cell *matFooterCellDef> Total</td>-->
<!--            </ng-container>-->
<!--            <ng-container matColumnDef="in">-->
<!--              <th mat-header-cell *matHeaderCellDef mat-sort-header>IN</th>-->
<!--              <td mat-cell *matCellDef="let element">{{element.op === 'IN' ? element.quantity : ''}}</td>-->
<!--              <td mat-footer-cell *matFooterCellDef> {{totalStockIN}}</td>-->
<!--            </ng-container>-->
<!--            <ng-container matColumnDef="quantity">-->
<!--              <th mat-header-cell *matHeaderCellDef mat-sort-header>OUT</th>-->
<!--              <td mat-cell *matCellDef="let element">{{element.op === 'OUT' ? element.quantity : ''}}</td>-->
<!--              <td mat-footer-cell *matFooterCellDef>{{totalStockOUT}}</td>-->
<!--            </ng-container>-->
<!--            <ng-container matColumnDef="description">-->
<!--              <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>-->
<!--              <td mat-cell-->
<!--                  *matCellDef="let element">{{element.op === 'IN' ? 'Purchased' : element.op === 'OUT' ? 'Sold' : 'Transferred'}}</td>-->
<!--              <td mat-footer-cell *matFooterCellDef> Current Stock =  {{currentStockDisplay}} </td>-->
<!--            </ng-container>-->
<!--            <tr mat-header-row *matHeaderRowDef="stockTrackingColumns"></tr>-->
<!--            <tr class="table-data-row" mat-row-->
<!--                *matRowDef="let row; columns: stockTrackingColumns;"></tr>-->
<!--            <tr class="font-weight-bold" mat-footer-row *matFooterRowDef="stockTrackingColumns"></tr>-->
<!--          </table>-->
<!--          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>-->
<!--        </mat-card>-->
<!--      </div>-->
<!--    </div>-->
<!--    <mat-menu #exportMenu>-->
<!--      <button mat-menu-item (click)="exportReport()">-->
<!--        <mat-icon color="primary">get_app</mat-icon>-->
<!--        CSV-->
<!--      </button>-->
<!--    </mat-menu>-->
  `,
  styleUrls: ['../styles/cart.component.scss'],
  providers: [
    ReportService
  ]
})
export class StockTrackingComponent implements OnInit, OnDestroy {

  constructor(private readonly report: ReportService, private readonly snack: MatSnackBar,
              private periodDateRangeService: PeriodDateRangeState) {
  }

  productFormControl = new FormControl('');
  products: any;
  filteredProducts: Observable<string[]>;
  startDate;
  endDate;
  totalStockIN;
  totalStockOUT;
  stockId = '';
  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  stockTrackingData: MatTableDataSource<any>;
  stockTrackingColumns = ['date', 'in', 'quantity', 'description'];
  currentStock;
  currentStockDisplay;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destroyer = new Subject();
  productName;

  ngOnInit(): void {
    // this.report.getProducts().then(data => {
    //   this.products = data;
    //   this.filteredProducts = this.productFormControl.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filter(value))
    //     );
    // }).catch(err => {
    //   console.log(err);
    // });
    // this.startDate = toSqlDate(new Date());
    // this.endDate = toSqlDate(new Date());
    // this.periodDateRangeService.dateRange.pipe(
    //   takeUntil(this.destroyer)
    // ).subscribe((value) => {
    //   if (value) {
    //     this.startDate = value.startDate;
    //     this.endDate = value.endDate;
    //     if (this.stockId === '' || this.stockId === null) {
    //       this.productFormControl.setValidators([autocompleteObjectValidator(), Validators.required]);
    //       this.productFormControl.updateValueAndValidity();
    //       this.productFormControl.markAllAsTouched();
    //     } else {
    //       this.productFormControl.setValidators([]);
    //       this.productFormControl.updateValueAndValidity();
    //       this.productFormControl.markAllAsTouched();
    //       this.productName = this.productFormControl.value;
    //       this.currentStockDisplay = this.currentStock;
    //       this.getStockTracking(this.stockId, this.startDate, this.endDate);
    //     }
    //   }
    // });
  }

  getStockTracking(stockId: string, from, to: string): void {
  }

  updateStockId(product: any): void {
    this.productFormControl.setValue(product.product);
    this.stockId = product.id;
    this.currentStock = product.quantity;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(option => option.product.toLowerCase().includes(filterValue));
  }

  exportReport(): void {
    const exportedDataStockTrackingDataColumns = ['date', 'in', 'out', 'description'];
    // const exportedDataStockTrackingDataColumns = ['name', 'sold', 'purchased', 'from', 'to'];
    json2csv('stock_tracking_report.csv', exportedDataStockTrackingDataColumns, this.stockTrackingData.filteredData).catch(reason => {
    });
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

}
