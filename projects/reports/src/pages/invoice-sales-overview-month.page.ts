import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DeviceState } from "smartstock-core";
import { ReportState } from "../states/report.state";
import { DateRangeModel } from "../models/date-range.model";

@Component({
  selector: "app-invoice-sales-month-page",
  template: `
    <app-layout-sidenav
      [heading]="'Months Invoice Sales Overview'"
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
          view="year"
          (export)="exportReport()"
          (reload)="getSalesOverview($event)"
        ></app-date-range>
        <app-invoice-sales-overview
          *ngIf="(reportState.loadMonthInvoiceSales | async) === false"
          [sales]="reportState.invoiceSalesByMonth | async"
        ></app-invoice-sales-overview>
        <app-data-not-ready
          [height]="100"
          *ngIf="(reportState.loadMonthInvoiceSales | async) === true"
          [isLoading]="(reportState.loadMonthInvoiceSales | async) === true"
        ></app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/sales.style.scss"]
})
export class InvoiceSalesOverviewMonthPage implements OnInit, OnDestroy {
  @ViewChild("sidenav") sidenav: MatSidenav;

  constructor(
    public readonly deviceState: DeviceState,
    public readonly reportState: ReportState
  ) {
    document.title = "SmartStock - Invoice Sales Overview By Month Reports";
  }

  async ngOnInit(): Promise<void> {}

  getSalesOverview(date: DateRangeModel): void {
    this.reportState.fetchInvoiceSaleByMonth(date);
  }

  exportReport(): void {
    this.reportState.exportInvoiceSaleByMonth();
  }

  ngOnDestroy(): void {
    this.reportState.dispose();
  }
}
