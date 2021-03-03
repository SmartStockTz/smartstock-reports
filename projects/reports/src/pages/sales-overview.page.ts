import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {FormControl} from '@angular/forms';

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
          <app-toolbar [heading]="'Sales Overview'" [sidenav]="sidenav" [showProgress]="false"></app-toolbar>

          <div class="pt-5 container col-xl-9 col-lg-9 col-sm-12 col-md-10" style="min-height: 90vh;">
            <!--                  <div class="row col-11 m-0 pt-5 justify-content-end">-->
            <!--                    <mat-form-field appearance="outline">-->
            <!--                      <mat-label>Sales Type</mat-label>-->
            <!--                      <mat-select [formControl]="salesChannel" value="retail">-->
            <!--                        <mat-option value="retail">Retail</mat-option>-->
            <!--                        <mat-option value="whole">Wholesale</mat-option>-->
            <!--                      </mat-select>-->
            <!--                    </mat-form-field>-->
            <!--                  </div>-->
            <!--                  <app-total-sales ></app-total-sales>-->
            <app-period-date-range></app-period-date-range>
            <app-report-sale-overview></app-report-sale-overview>
          </div>

        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['../styles/sales.style.scss']
})
export class SalesOverviewPage extends DeviceInfoUtil implements OnInit {
  isMobile = false;
  // salesChannel = new FormControl('retail');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
