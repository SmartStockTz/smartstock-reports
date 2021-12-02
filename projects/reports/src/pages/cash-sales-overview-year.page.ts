import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';
import {ReportState} from '../states/report.state';
import {DateRangeModel} from '../models/date-range.model';

@Component({
  selector: 'app-cash-sales-overview-year-page',
  template: `
    <app-layout-sidenav
      [heading]="'Years Cash Sales Overview'"
      [leftDrawer]="side"
      backLink="/report"
      [hasBackRoute]="true"
      [body]="body"
      [leftDrawerMode]="(deviceState.enoughWidth | async) === true?'side':'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-date-range view="multi-year" (export)="exportReport()" (reload)="getSalesOverview($event)"></app-date-range>
        <app-cash-sales-overview-day
          *ngIf="(reportState.loadYearCashSales | async)===false"
          [sales]="reportState.cashSalesByYear | async"></app-cash-sales-overview-day>
        <app-data-not-ready
          [height]="100"
          *ngIf="(reportState.loadYearCashSales | async)===true"
          [isLoading]="(reportState.loadYearCashSales | async)===true"></app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/sales.style.scss']
})
export class CashSalesOverviewYearPage implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState,
              public readonly reportState: ReportState) {
    document.title = 'SmartStock - Cash Sales Overview By Year Reports';
  }

  async ngOnInit(): Promise<void> {
  }


  getSalesOverview(date: DateRangeModel): void {
    this.reportState.fetchCashSaleByYear(date);
  }


  exportReport(): void {
    this.reportState.exportCashSaleByYear();
  }

  ngOnDestroy(): void {
    this.reportState.dispose();
  }
}
