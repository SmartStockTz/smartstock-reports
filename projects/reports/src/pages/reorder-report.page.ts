import { Component, OnInit } from '@angular/core';
import { DeviceInfoUtil } from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stock-reports',
  template: `
    <div>
      <mat-sidenav-container class="my-drawer-container">
        <mat-sidenav
          [fixedInViewport]="true"
          class="match-parent-side"
          #sidenav
          [mode]="enoughWidth() ? 'side' : 'over'"
          [opened]="enoughWidth()"
        >
          <app-drawer></app-drawer>
        </mat-sidenav>

        <mat-sidenav-content>
          <app-toolbar
            [heading]="'Stock Reports'"
            [sidenav]="sidenav"
            [showProgress]="false"
          ></app-toolbar>

          <div class="row m-0">
            <div class="col-lg-6 py-3">
              <app-expired-products-report></app-expired-products-report>
            </div>
            <div class="col-lg-6 py-3">
              <app-products-about-to-expire></app-products-about-to-expire>
            </div>
          </div>
          <div class="row m-0">
            <div class="col-lg-6 py-3">
              <app-stock-reorder-report></app-stock-reorder-report>
            </div>
            <div class="col-lg-6 py-3"></div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['../styles/stock.style.scss'],
})
export class ReorderReportPageComponent
  extends DeviceInfoUtil
  implements OnInit {
  isMobile = false;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
