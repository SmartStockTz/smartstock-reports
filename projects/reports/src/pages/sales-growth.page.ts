import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sales-growth-page',
  template: `
    <app-layout-sidenav
      [heading]="'Growth Reports'"
      [leftDrawer]="side"
      [body]="body"
      backLink="/report"
      [hasBackRoute]="true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [showProgress]="false">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="pt-3 container col-xl-9 col-lg-9 col-sm-12 col-md-10 col-12" style="min-height: 100vh;">
          <app-report-sales-growth></app-report-sales-growth>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class SalesGrowthPageComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = [];
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Sales Growth Reports';
  }

  ngOnInit(): void {
  }
}
