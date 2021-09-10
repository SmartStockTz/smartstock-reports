import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-sales-order',
  template: `
    <app-layout-sidenav
      [heading]="'Sales Tracking'"
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
        <div class="container pt-3 col-xl-9 col-lg-9 col-sm-12 col-md-10 col-12">
          <app-cart-report></app-cart-report>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class SalesOrderPageComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Sales Tracking Reports';
  }

  ngOnInit(): void {
  }
}
