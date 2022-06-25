import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DeviceState } from "smartstock-core";
import { ReportState } from "../states/report.state";
import { DateRangeModel } from "../models/date-range.model";

@Component({
  selector: "app-sales-reports",
  template: `
    <app-layout-sidenav
      [heading]="'Daily Cash Sales Overview'"
      [leftDrawer]="side"
      backLink="/report"
      [hasBackRoute]="true"
      [body]="body"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-date-range
          view="month"
          (export)="exportReport()"
          (reload)="getSalesOverview($event)"
        ></app-date-range>
        <app-cash-sales-overview-day
          *ngIf="(reportState.loadDayCashSales | async) === false"
          [sales]="reportState.cashSalesByDay | async"
        ></app-cash-sales-overview-day>
        <app-data-not-ready
          [height]="100"
          *ngIf="(reportState.loadDayCashSales | async) === true"
          [isLoading]="(reportState.loadDayCashSales | async) === true"
        ></app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/sales.style.scss"]
})
export class CashSalesOverviewDayPage implements OnInit, OnDestroy {
  @ViewChild("sidenav") sidenav: MatSidenav;

  constructor(
    public readonly deviceState: DeviceState,
    public readonly reportState: ReportState
  ) {
    document.title = "SmartStock - Cash Sales Overview By Day Reports";
  }

  async ngOnInit(): Promise<void> {}

  getSalesOverview(date: DateRangeModel): void {
    this.reportState.fetchCashSaleByDay(date);
  }

  exportReport(): void {
    this.reportState.exportCashSaleByDay();
  }

  ngOnDestroy(): void {
    this.reportState.dispose();
  }
}
