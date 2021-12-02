import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';
import {DateRangeModel} from '../models/date-range.model';
import {ReportState} from '../states/report.state';

@Component({
  selector: 'app-cash-sales-track-page',
  template: `
    <app-layout-sidenav
      [heading]="'Cash Sales Tracking'"
      [leftDrawer]="side"
      [body]="body"
      backLink="/report"
      [hasBackRoute]="true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side': 'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [showProgress]="false">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <app-date-range (export)="export()" view="month" (reload)="reload($event)" [from]="startDate"
                        [to]="startDate"></app-date-range>
        <app-cash-sale-tracking [data]="reportState.cashSalesTracking | async"
                                *ngIf="(reportState.loadCashSalesTracking | async)===false"
                                (reload)="reload($event)"></app-cash-sale-tracking>
        <app-data-not-ready
          *ngIf="(reportState.loadCashSalesTracking | async)===true"
          [isLoading]="(reportState.loadCashSalesTracking | async)===true">
        </app-data-not-ready>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class CashSalesTrackPage implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  startDate = new Date();

  constructor(public readonly deviceState: DeviceState,
              public readonly reportState: ReportState) {
    document.title = 'SmartStock - Cash Sales Tracking Reports';
  }

  ngOnInit(): void {
  }

  reload(date: DateRangeModel): void {
    this.reportState.fetchCashSalesTrack(date);
  }

  export(): void {
    this.reportState.exportCashSalesTrack();
  }
}
