import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-report-invoices-page',
  template: `
    <smartstock-layout-sidenav [leftDrawerOpened]="enoughWidth()"
                               [leftDrawerMode]="enoughWidth()?'side': 'over'" [leftDrawer]="leftDrawer"
                               [body]="body" [heading]="'Invoices'">
      <ng-template #leftDrawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-xl-9 col-lg-9 col-md-10 col-sm-11 pt-5">
              <app-invoices></app-invoices>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})
export class InvoicesPage extends DeviceInfoUtil implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    document.title = 'Invoices';
  }
}
