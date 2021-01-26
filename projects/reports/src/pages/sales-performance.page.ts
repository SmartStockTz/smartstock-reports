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

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
];

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
          <smartstock-toolbar [heading]="'Sales Reports'" [sidenav]="sidenav" [showProgress]="false"></smartstock-toolbar>

          <div style="min-height: 90vh;display: flex;flex-direction: column; justify-content: space-evenly">
            <div class="row col-lg-11 mx-auto pt-5 align-items-center justify-content-end">
              <mat-form-field class="px-3 col-11 col-md-4 col-lg-3" appearance="outline">
                <mat-label>Sales Type</mat-label>
                <mat-select [formControl]="performanceBy" value="seller">
                  <mat-option value="product">Product</mat-option>
                  <mat-option value="seller">Seller</mat-option>
                  <mat-option value="category">Category</mat-option>
                </mat-select>
              </mat-form-field>
              <smartstock-period-date-range class="col-lg-7"></smartstock-period-date-range>
            </div>
            <smartstock-period-date-range class="col-lg-8 mx-auto"></smartstock-period-date-range>

            <!--            <div class="row col-11 m-0 pt-5 justify-content-end">-->
<!--              <mat-form-field appearance="outline">-->
<!--                <mat-label>Sales Type</mat-label>-->
<!--                <mat-select [formControl]="salesChannel" value="retail">-->
<!--                  <mat-option value="retail">Retail</mat-option>-->
<!--                  <mat-option value="whole">Wholesale</mat-option>-->
<!--                </mat-select>-->
<!--              </mat-form-field>-->
<!--            </div>-->
            <smartstock-product-performance-report [salesChannel]="salesChannel.valueChanges"></smartstock-product-performance-report>
            <smartstock-sales-by-category></smartstock-sales-by-category>
            <smartstock-sales-by-seller ></smartstock-sales-by-seller>
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
  dataSource = ELEMENT_DATA;
  performanceBy = new FormControl('category');
  salesChannel = new FormControl('retail');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit(): void {

  }
}
