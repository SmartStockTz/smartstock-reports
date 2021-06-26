import {Component, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stock-reports',
  template: `
    <app-layout-sidenav
      [heading]="'Stock Reports'"
      [leftDrawer]="side"
      [body]="body"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      backLink="/report"
      [hasBackRoute]="true"
      [showProgress]="false">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container pt-3 col-xl-9 col-lg-9 col-sm-11 col-md-10 col-12" style="min-height: 100vh">
          <app-expired-products-report></app-expired-products-report>
          <div class="pt-3"></div>
          <app-products-about-to-expire></app-products-about-to-expire>
          <div class="pt-3"></div>
          <app-stock-reorder-report></app-stock-reorder-report>
          <div class="pt-3"></div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/stock.style.scss'],
})
export class StockPageComponent implements OnInit {

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Stock Overview Reports';
  }

  async ngOnInit(): Promise<void> {
  }
}
