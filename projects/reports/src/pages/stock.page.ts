import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

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

          <div class="container pt-5 col-xl-9 col-lg-9 col-sm-11 col-md-10">
            <app-expired-products-report></app-expired-products-report>
            <div class="pt-5"></div>
            <app-products-about-to-expire></app-products-about-to-expire>
            <div class="pt-5"></div>
            <app-stock-reorder-report></app-stock-reorder-report>
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
