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

@Component({
  selector: 'app-sales-performance',
  template: `
    <app-layout-sidenav
      [heading]="'Sales Performance'"
      [sidenav]="sidenav"
      [body]="body"
      backLink="/report"
      [hasBackRoute]="true"
      [leftDrawer]="side"
      [leftDrawerOpened]="(deviceState.enoughWidth | async)===true"
      [leftDrawerMode]="(deviceState.enoughWidth | async)===true?'side':'over'"
      [showProgress]="false">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-xl-9 col-lg-9 col-sm-12 col-md-10 col-12" style="min-height: 100vh">
          <div class="pt-3">
            <mat-form-field class="col-12">
              <mat-label>Performance By</mat-label>
              <mat-select [formControl]="performanceBy" value="seller">
                <mat-option value="product">Product</mat-option>
                <mat-option value="seller">Seller</mat-option>
                <mat-option value="category">Category</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <app-period-date-range class=""></app-period-date-range>
          <app-sales-performance-component
            [performanceByForm]="performanceBy.valueChanges"></app-sales-performance-component>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class SalesPerformancePageComponent implements OnInit {
  isMobile = false;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  performanceBy = new FormControl('product');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Sales Performance Reports';
  }

  async ngOnInit(): Promise<void> {
  }
}
