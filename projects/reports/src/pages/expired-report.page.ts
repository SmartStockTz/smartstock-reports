import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stock-reports',
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
                  <app-toolbar [heading]="'Expired'" [sidenav]="sidenav" [showProgress]="false"></app-toolbar>


                  <div [ngStyle]="{padding: (isMobile || !enoughWidth())?'24px 0':'24px 16px'}"
                       [ngClass]="(isMobile || !enoughWidth())?'container-fluid':'container'">
                      <div class="col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0">
                          <div class="row">
                              <div style="margin-bottom: 10px" class="col-12">
                                  <app-expired-products-report></app-expired-products-report>
                              </div>
                          </div>
                      </div>
                  </div>

              </mat-sidenav-content>
          </mat-sidenav-container>
      </div>
  `,
  styleUrls: ['../styles/stock.style.scss']
})
export class ExpiredReportPageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = false;

  constructor() {
    super();
    document.title = 'SmartStock - Expired Stocks Report';
  }

  ngOnInit(): void {
  }

}
