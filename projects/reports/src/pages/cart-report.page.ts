import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {FormControl} from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-sales-reports',
  template: `
    <div>
      <mat-sidenav-container class="my-drawer-container">

        <mat-sidenav
          [fixedInViewport]="true"
          class="match-parent-side"
          #sidenav [mode]="enoughWidth()?'side':'over'"
          [opened]="enoughWidth()">
          <app-drawer></app-drawer>
        </mat-sidenav>

        <mat-sidenav-content>
          <app-toolbar [heading]="'Sales Reports'" [sidenav]="sidenav" [showProgress]="false"></app-toolbar>

          <div style="min-height: 90vh;display: flex;flex-direction: column; justify-content: space-evenly">
            <div class="row col-11 m-0 pt-5 justify-content-end">
              <mat-form-field appearance="outlinen">
                <mat-label>Sales Type</mat-label>
                <mat-select [formControl]="salesChannel" value="retail">
                  <mat-option value="retail">Retail</mat-option>
                  <mat-option value="whole">Wholesale</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <app-total-sales></app-total-sales>
            <app-profit [salesChannel]="salesChannel.valueChanges"></app-profit>
            <div class="row m-0 py-2" style="justify-content: space-evenly">
              <div class="col-md-11 col-lg-4 py-3">
              </div>
              <div class="col-md-8 col-lg-4 py-3">
                <app-sales-by-category></app-sales-by-category>
              </div>
            </div>
            <div class="row m-0 py-2">
              <div class="col-lg-6 py-3">
              </div>
              <div class="col-lg-6 py-3">
                <app-cart-report></app-cart-report>
              </div>
            </div>
            <div class="row m-0 py-2">
              <div class="col-lg-6 py-3">
                <app-profit-by-category
                  [salesChannel]="salesChannel.valueChanges"></app-profit-by-category>
              </div>
              <div class="col-lg-6 py-3">
                <app-product-performance-report
                  [salesChannel]="salesChannel.valueChanges"></app-product-performance-report>
              </div>
            </div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['../styles/cart.component.scss']
})
export class CartReportPageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = false;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = [];
  salesChannel = new FormControl('retail');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
    document.title = 'Cart Report';
  }

  ngOnInit(): void {
  }
}
