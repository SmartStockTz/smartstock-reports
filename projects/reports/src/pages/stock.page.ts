import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

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

          <div class="container pt-5 col-xl-9 col-lg-9 col-sm-11 col-md-10">
            <smartstock-expired-products-report></smartstock-expired-products-report>
            <div class="pt-5"></div>
            <smartstock-products-about-to-expire></smartstock-products-about-to-expire>
            <div class="pt-5"></div>
            <smartstock-stock-reorder-report></smartstock-stock-reorder-report>
            <div class="pt-5"></div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['../styles/stock.style.scss'],
})
export class StockPageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
