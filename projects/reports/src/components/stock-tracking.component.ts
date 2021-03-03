import {Component, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CartModel} from '../models/cart.model';
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';
import {toSqlDate} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stock-tracking',
  template: `
    <div class="col-12" style="margin-top: 1em">
      <div>
        <mat-card class="mat-elevation-z3">

          <div style="display: flex; flex-flow: row; align-items: center">
            <h6 class="col-8">Stock Tracking Report</h6>
            <span style="flex-grow: 1"></span>
            <button [mat-menu-trigger-for]="exportMenu" mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
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


          <div style="display: flex; justify-content: center">
            <mat-spinner *ngIf="isLoading"></mat-spinner>
          </div>

          <app-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></app-data-not-ready>
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="stockTrackingData" matSort>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
              <td mat-cell *matCellDef="let element">{{element.name}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="sold">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Sold</th>
              <td mat-cell *matCellDef="let element">{{element.sold}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="purchased">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Purchased</th>
              <td mat-cell *matCellDef="let element">{{element.purchased}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="from">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>From</th>
              <td mat-cell *matCellDef="let element">{{element.from }}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="to">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>To</th>
              <td mat-cell *matCellDef="let element">{{element.to }}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="stockTrackingColumns"></tr>
            <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: stockTrackingColumns;"></tr>
            <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="stockTrackingColumns"></tr>

          </table>
          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      </div>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()">
        <mat-icon color="primary">get_app</mat-icon>
        CSV
      </button>
    </mat-menu>
  `,
  styleUrls: ['../styles/cart.component.scss'],
  providers: [
    ReportService
  ]
})
export class StockTrackingComponent implements OnInit {

  constructor(private readonly report: ReportService, private readonly snack: MatSnackBar) {
  }

  startDate;
  endDate;
  channel = 'stock-tracking';
  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  stockTrackingData: MatTableDataSource<any>;
  stockTrackingColumns = ['name', 'sold', 'purchased', 'from', 'to'];

  startDateFormControl = new FormControl(new Date(), [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  channelFormControl = new FormControl('', [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.channelFormControl.setValue('retail');
    this.startDate = toSqlDate(new Date());
    this.endDate = toSqlDate(new Date());

    this.getStockTracking(this.channel, this.startDate, this.endDate);
    this.dateRangeListener();

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.stockTrackingData.filter = filterValue.trim().toLowerCase();
    });
  }

  getStockTracking(channel: string, from, to: string) {
    this.isLoading = true;
    this.report.getStockTracking(from, to, channel).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.stockTrackingData = new MatTableDataSource(data);
        setTimeout(() => {
          this.stockTrackingData.paginator = this.paginator;
          this.stockTrackingData.sort = this.sort;
        });
        this.stocks = data;
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(reason => {
      this.isLoading = false;
      this.snack.open('Fails to get total expired products', 'Ok', {
        duration: 3000
      });
    });
  }

  exportReport(): void {
    const exportedDataStockTrackingDataColumns = ['name', 'sold', 'purchased', 'from', 'to'];
    json2csv('stock_tracking_report.csv', exportedDataStockTrackingDataColumns, this.stockTrackingData.filteredData).catch(reason => {
    });
  }

  private dateRangeListener(): void {
    this.startDateFormControl.valueChanges.subscribe(value => {
      this.startDate = toSqlDate(value);
      this.getStockTracking(this.channel, this.startDate, this.endDate);
    });
    this.endDateFormControl.valueChanges.subscribe(value => {
      this.endDate = toSqlDate(value);
      this.getStockTracking(this.channel, this.startDate, this.endDate);
    });
    this.channelFormControl.valueChanges.subscribe(value => {
      this.channel = value;
      this.getStockTracking(this.channel, this.startDate, this.endDate);
    });
  }

}
