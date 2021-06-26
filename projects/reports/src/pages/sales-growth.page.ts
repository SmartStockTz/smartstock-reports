import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';
import {FormControl} from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
];

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
  isMobile = false;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  salesChannel = new FormControl('retail');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Sales Growth Reports';
  }

  ngOnInit(): void {
  }
}
