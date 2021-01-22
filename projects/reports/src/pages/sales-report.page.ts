import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'smartstock-sales-reports',
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
                  <smartstock-toolbar [heading]="'Sales Report'" [sidenav]="sidenav" [showProgress]="false"></smartstock-toolbar>

                <div class="pt-5" style="min-height: 90vh;display: flex;flex-direction: column; justify-content: space-evenly">
<!--                  <div class="row col-11 m-0 pt-5 justify-content-end">-->
<!--                    <mat-form-field appearance="outline">-->
<!--                      <mat-label>Sales Type</mat-label>-->
<!--                      <mat-select [formControl]="salesChannel" value="retail">-->
<!--                        <mat-option value="retail">Retail</mat-option>-->
<!--                        <mat-option value="whole">Wholesale</mat-option>-->
<!--                      </mat-select>-->
<!--                    </mat-form-field>-->
<!--                  </div>-->
                  <smartstock-total-sales ></smartstock-total-sales>
                  <smartstock-report-sale-trends></smartstock-report-sale-trends>
                </div>

              </mat-sidenav-content>
          </mat-sidenav-container>
      </div>
  `,
  styleUrls: ['../styles/sales.style.scss']
})
export class SalesReportPageComponent extends DeviceInfoUtil implements OnInit {
  isMobile = false;
  // salesChannel = new FormControl('retail');
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
