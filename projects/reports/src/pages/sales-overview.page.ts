import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-sales-reports',
  template: `
    <app-layout-sidenav
      [heading]="'Sales Overview'"
      [leftDrawer]="side"
      backLink="/report"
      [hasBackRoute]="true"
      [body]="body"
      [leftDrawerMode]="(deviceState.enoughWidth | async) === true?'side':'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="pt-3 container col-xl-9 col-lg-9 col-sm-12 col-md-10" style="min-height: 90vh;">
          <app-period-date-range></app-period-date-range>
          <app-report-sale-overview></app-report-sale-overview>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/sales.style.scss']
})
export class SalesOverviewPage implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Sales Overview Reports';
  }

  async ngOnInit(): Promise<void> {
  }

}
