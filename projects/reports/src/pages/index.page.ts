import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-report-index',
  template: `
    <mat-sidenav-container>
      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side': 'over'" [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="min-height: 100vh">
        <app-toolbar searchPlaceholder="Filter product" [heading]="'Reports'"
                            [sidenav]="sidenav"></app-toolbar>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10" style="padding: 16px 0">
          <h1>Go To</h1>
          <div>
            <h2>Sales Reports</h2>
            <div class="row">
              <div *ngFor="let page of salesPages" routerLink="{{page.path}}" style="margin: 8px; cursor: pointer">
                <mat-card matRipple
                          style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                  <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                    {{page.icon}}
                  </mat-icon>
                </mat-card>
                <p class="py-2 ">{{page.name}}</p>
              </div>
            </div>
          </div>
<!--          <div>-->
<!--            <h2>Purchase Reports</h2>-->
<!--          <div class="row">-->
<!--            <div *ngFor="let page of purchasePages" routerLink="{{page.path}}" style="margin: 8px; cursor: pointer">-->
<!--              <mat-card matRipple-->
<!--                        style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column">-->
<!--                <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">-->
<!--                  {{page.icon}}-->
<!--                </mat-icon>-->
<!--              </mat-card>-->
<!--              <p class="py-2 ">{{page.name}}</p>-->
<!--            </div>-->
<!--          </div>-->
<!--          </div>-->
          <div>
            <h2>Stock Reports</h2>
          <div class="row">
            <div *ngFor="let page of stockPages" routerLink="{{page.path}}" style="margin: 8px; cursor: pointer">
              <mat-card matRipple
                        style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                  {{page.icon}}
                </mat-icon>
              </mat-card>
              <p class="py-2 ">{{page.name}}</p>
            </div>
          </div>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})

export class IndexPage extends DeviceInfoUtil implements OnInit {
  stockPages = [
    {
      name: 'Stock',
      path: '/report//stock/overview',
      icon: 'description'
    }
  ];
  purchasePages = [
    {
      name: 'Sales Report',
      path: '/report/sales/overview',
      icon: 'trending_up'
    },
    {
      name: 'Stock Report',
      path: '/report//stock/overview',
      icon: 'description'
    }
  ];
  salesPages = [
    {
      name: 'Sales Overview',
      path: '/report/sales/overview',
      icon: 'trending_up'
    },
    {
      name: 'Order Report',
      path: '/report/sales/order',
      icon: 'description'
    },
    // {
    //   name: 'Sales Growth',
    //   path: '/report/sales-growth',
    //   icon: 'description'
    // },
    {
      name: 'Sales Performance',
      path: '/report/sales/performance',
      icon: 'description'
    }
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
