import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {FormControl} from '@angular/forms';
import {PeriodDateRangeComponent} from '../components/period-date-range.component';
import {PeriodDateRangeService} from '../services/period-date-range.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'smartstock-sales-performance',
  template: `
    <div>
      <mat-sidenav-container class="my-drawer-container">

        <mat-sidenav
          [fixedInViewport]="true"
          class="match-parent-side"
          #sidenav [mode]="enoughWidth()?'side':'over'"
          [opened]="enoughWidth()">
          <smartstock-drawer></smartstock-drawer>
        </mat-sidenav>

        <mat-sidenav-content>
          <smartstock-toolbar [heading]="'Sales Performance'" [sidenav]="sidenav" [showProgress]="false"></smartstock-toolbar>

          <div class="container col-xl-9 col-lg-9 col-sm-12 col-md-10">
            <div class="d-flex flex-row flex-wrap mx-auto pt-5">
              <mat-form-field class="px-3 col-11 col-md-4 col-lg-3" appearance="outline">
                <mat-label>Sales Type</mat-label>
                <mat-select [formControl]="performanceBy" value="seller">
                  <mat-option value="product">Product</mat-option>
                  <mat-option value="seller">Seller</mat-option>
                  <mat-option value="category">Category</mat-option>
                </mat-select>
              </mat-form-field>
              <smartstock-period-date-range class=""></smartstock-period-date-range>
            </div>
            <smartstock-sales-performance-component
              [performanceByForm]="performanceBy.valueChanges"></smartstock-sales-performance-component>
          </div>

        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class SalesPerformancePageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = false;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  performanceBy = new FormControl('product');
  salesChannel = new FormControl('retail');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit(): void {

  }
}