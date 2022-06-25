import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DeviceState } from "smartstock-core";
import { DateRangeModel } from "../models/date-range.model";
import { ReportState } from "../states/report.state";

@Component({
  selector: "app-cash-sales-performance-category-page",
  template: `
    <app-layout-sidenav
      [heading]="'Cash Sales Category Performance'"
      [sidenav]="sidenav"
      [body]="body"
      backLink="/report"
      [hasBackRoute]="true"
      [leftDrawer]="side"
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [showProgress]="false"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-date-range
          view="month"
          (reload)="reload($event)"
          (export)="export()"
        ></app-date-range>
        <app-cash-sales-performance
          [columns]="cColumns"
          *ngIf="(reportState.loadCashPerformanceByCategory | async) === false"
          [data]="reportState.cashPerformanceByCategory | async"
        >
        </app-cash-sales-performance>
        <app-data-not-ready
          *ngIf="(reportState.loadCashPerformanceByCategory | async) === true"
          [isLoading]="
            (reportState.loadCashPerformanceByCategory | async) === true
          "
        >
        </app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/cart.component.scss"]
})
export class CashSalesPerformanceCategoryPage {
  @ViewChild("sidenav") sidenav: MatSidenav;
  cColumns = ["id", "quantity", "amount_sales", "amount_refund", "amount"];

  constructor(
    public readonly deviceState: DeviceState,
    public readonly reportState: ReportState
  ) {
    document.title = "SmartStock - Cash Sales Category Performance Reports";
  }

  reload(date: DateRangeModel): void {
    this.reportState.fetchCashPerformanceByCategory(date);
  }

  export(): void {
    this.reportState.exportCashPerformanceByCategory();
  }
}
