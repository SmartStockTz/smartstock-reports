import { Component, OnInit } from '@angular/core';
import { DeviceInfoUtil } from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stock-reports',
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
          <smartstock-drawer></smartstock-drawer>
        </mat-sidenav>

        <mat-sidenav-content>
          <smartstock-toolbar
            [heading]="'Stock Reports'"
            [sidenav]="sidenav"
            [showProgress]="false"
          ></smartstock-toolbar>

          <div class="row m-0">
            <div class="col-lg-6 py-3">
              <smartstock-expired-products-report></smartstock-expired-products-report>
            </div>
            <div class="col-lg-6 py-3">
              <smartstock-products-about-to-expire></smartstock-products-about-to-expire>
            </div>
          </div>
          <div class="row m-0">
            <div class="col-lg-6 py-3">
              <smartstock-stock-reorder-report></smartstock-stock-reorder-report>
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
