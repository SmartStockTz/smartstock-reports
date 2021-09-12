import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceState} from '@smartstocktz/core-libs';


@Component({
  selector: 'app-sales-reports',
  template: `
      <div>
          <mat-sidenav-container class="my-drawer-container">

              <mat-sidenav
                      [fixedInViewport]="true"
                      class="match-parent-side"
                      #sidenav [mode]="(deviceState.enoughWidth | async)===true?'side':'over'"
                      [opened]="(deviceState.enoughWidth | async)===true">
                  <app-drawer></app-drawer>
              </mat-sidenav>

              <mat-sidenav-content>
                  <app-toolbar [heading]="'Product Performance Report'" [sidenav]="sidenav" [showProgress]="false"></app-toolbar>


                  <div [ngStyle]="{padding: (deviceState.isSmallScreen | async)===true?'24px 0':'40px 16px'}"
                       [ngClass]="(deviceState.isSmallScreen | async)===true?'container-fluid':'container'">
                      <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-12">
                                  <app-product-performance-report style="margin-bottom: 1em"></app-product-performance-report>
                              </div>
                          </div>
                          <!--<div class="row">-->
                          <!--<div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
                          <!--<app-expired-products-report></app-expired-products-report>-->
                          <!--</div>-->
                          <!--<div style="margin-bottom: 10px" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">-->
                          <!--<app-products-about-to-expire></app-products-about-to-expire>-->
                          <!--</div>-->
                          <!--</div>-->
                      </div>
                  </div>

              </mat-sidenav-content>
          </mat-sidenav-container>
      </div>
  `,
  styleUrls: ['../styles/sales.style.scss']
})
export class PerformanceReportPageComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Performance Reports';
  }

  ngOnInit(): void {
  }

}
