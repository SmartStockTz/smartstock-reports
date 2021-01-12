import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-report-stock-tracking',
  template: `
    <smartstock-layout-sidenav [leftDrawerOpened]="enoughWidth()"
                               [leftDrawerMode]="enoughWidth()?'side': 'over'" [leftDrawer]="leftDrawer"
                               [body]="body" [heading]="'Stock Tracking'">
      <ng-template #leftDrawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-xl-9 col-lg-9 col-md-10 col-sm-11">
          <div class="row">
            <div style="margin-bottom: 10px" class="col-12">
              <smartstock-stock-tracking></smartstock-stock-tracking>
            </div>
          </div>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})
export class StockTrackingPage extends DeviceInfoUtil implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
