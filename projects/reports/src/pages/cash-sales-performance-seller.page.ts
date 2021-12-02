import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';
import {DateRangeModel} from '../models/date-range.model';
import {ReportState} from '../states/report.state';

@Component({
  selector: 'app-cash-sales-performance-seller-page',
  template: `
    <app-layout-sidenav
      [heading]="'Cash Sales Seller Performance'"
      [sidenav]="sidenav"
      [body]="body"
      backLink="/report"
      [hasBackRoute]="true"
      [leftDrawer]="side"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [showProgress]="false">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-date-range view="month" (reload)="reload($event)" (export)="export()"></app-date-range>
        <app-cash-sales-performance
          [columns]="sColumns"
          *ngIf="(reportState.loadCashPerformanceBySeller | async)===false"
          [data]="reportState.cashPerformanceBySeller | async">
        </app-cash-sales-performance>
        <app-data-not-ready
          *ngIf="(reportState.loadCashPerformanceBySeller | async)===true"
          [isLoading]="(reportState.loadCashPerformanceBySeller | async)===true">
        </app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class CashSalesPerformanceSellerPage {
  @ViewChild('sidenav') sidenav: MatSidenav;
  sColumns = ['id', 'quantity', 'amount_sales', 'amount_refund', 'amount'];
  constructor(public readonly deviceState: DeviceState,
              public readonly reportState: ReportState) {
    document.title = 'SmartStock - Cash Sales Seller Performance Reports';
  }

  reload(date: DateRangeModel): void {
    this.reportState.fetchCashPerformanceBySeller(date);
  }

  export(): void {
    this.reportState.exportCashPerformanceBySeller();
  }
}
