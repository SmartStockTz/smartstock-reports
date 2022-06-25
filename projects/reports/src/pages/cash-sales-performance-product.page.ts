import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DeviceState } from "smartstock-core";
import { DateRangeModel } from "../models/date-range.model";
import { ReportState } from "../states/report.state";

@Component({
  selector: "app-cash-sales-performance-product-page",
  template: `
    <app-layout-sidenav
      [heading]="'Cash Sales Products Performance'"
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
          [columns]="pColumns"
          *ngIf="(reportState.loadCashPerformanceByProduct | async) === false"
          [data]="reportState.cashPerformanceByProduct | async"
        >
        </app-cash-sales-performance>
        <app-data-not-ready
          *ngIf="(reportState.loadCashPerformanceByProduct | async) === true"
          [isLoading]="
            (reportState.loadCashPerformanceByProduct | async) === true
          "
        >
        </app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/cart.component.scss"]
})
export class CashSalesPerformanceProductPage implements OnInit {
  @ViewChild("sidenav") sidenav: MatSidenav;
  pColumns = ["id", "quantity", "sales", "purchase", "profit", "margin"];

  constructor(
    public readonly deviceState: DeviceState,
    public readonly reportState: ReportState
  ) {
    document.title = "SmartStock - Cash Sales Product Performance Reports";
  }

  async ngOnInit(): Promise<void> {}

  reload(date: DateRangeModel): void {
    this.reportState.fetchCashPerformanceByProduct(date);
  }

  export(): void {
    this.reportState.exportCashPerformanceByProduct();
  }
}
