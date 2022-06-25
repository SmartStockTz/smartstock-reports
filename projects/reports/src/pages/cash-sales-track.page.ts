import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DeviceState, UserService } from "smartstock-core";
import { DateRangeModel } from "../models/date-range.model";
import { ReportState } from "../states/report.state";
import { functions } from "bfast";
import { SocketController } from "bfast/dist/lib/controllers/socket.controller";

@Component({
  selector: "app-cash-sales-track-page",
  template: `
    <app-layout-sidenav
      [heading]="'Cash Sales Tracking'"
      [leftDrawer]="side"
      [body]="body"
      backLink="/report"
      [hasBackRoute]="true"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [showProgress]="false"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-date-range
          (export)="export()"
          view="month"
          (reload)="reload($event)"
          [from]="startDate"
          [to]="startDate"
        ></app-date-range>
        <app-cash-sale-tracking
          [data]="reportState.cashSalesTracking | async"
          *ngIf="(reportState.loadCashSalesTracking | async) === false"
          (reload)="reload($event)"
        ></app-cash-sale-tracking>
        <app-data-not-ready
          *ngIf="(reportState.loadCashSalesTracking | async) === true"
          [isLoading]="(reportState.loadCashSalesTracking | async) === true"
        >
        </app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/cart.component.scss"]
})
export class CashSalesTrackPage implements OnInit, OnDestroy {
  @ViewChild("sidenav") sidenav: MatSidenav;
  startDate = new Date();
  private changes: SocketController;

  constructor(
    public readonly deviceState: DeviceState,
    private readonly userService: UserService,
    public readonly reportState: ReportState
  ) {
    document.title = "SmartStock - Cash Sales Tracking Reports";
  }

  async ngOnInit(): Promise<void> {
    const shop = await this.userService.getCurrentShop();
    this.changes = functions(shop.projectId).event(
      "/daas-changes",
      () => {
        console.log("connected on sales track changes");
        this.changes.emit({
          auth: {
            masterKey: shop.masterKey
          },
          body: {
            projectId: shop.projectId,
            applicationId: shop.applicationId,
            pipeline: [],
            domain: "sales"
          }
        });
      },
      () => console.log("disconnected on sales changes")
    );
    this.changes.listener(async (response) => {
      // console.log(response);
      if (response && response.body && response.body.change) {
        this.reload({
          from: new Date(),
          to: new Date()
        });
      }
    });
  }

  reload(date: DateRangeModel): void {
    this.reportState.fetchCashSalesTrack(date);
  }

  export(): void {
    this.reportState.exportCashSalesTrack();
  }

  ngOnDestroy(): void {
    if (this.changes && this.changes.close) {
      this.changes.close();
    }
  }
}
