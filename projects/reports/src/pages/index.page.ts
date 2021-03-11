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
                    {{page.name !== 'Sales Growth' ? page.icon : ''}}
                    <svg *ngIf="page.name === 'Sales Growth'" width="60" height="56" viewBox="0 0 488 412" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M51.725 316.622C48.025 320.322 43.625 323.322 38.925 325.322V350.822V393.022C38.925 403.122 47.125 411.222 57.125 411.222H98.125C108.225 411.222 116.325 403.022 116.325 393.022V350.822V297.022V254.822C116.325 253.922 116.225 253.022 116.125 252.222L51.725 316.622Z" fill="#1B5E20"/>
                      <path d="M476.325 52.722C475.925 52.722 475.525 52.722 475.025 52.722C447.425 54.022 419.725 55.322 392.125 56.622C387.825 56.822 383.625 57.022 381.225 62.222C378.825 67.322 381.525 70.222 384.525 73.222C393.025 81.722 401.425 90.322 410.025 98.622L400.625 108.022L324.125 184.522L317.325 191.322L300.625 208.022L234.825 273.822L231.025 270.022L152.325 191.322L135.625 174.622L131.125 170.122C127.525 166.522 122.925 164.822 118.225 164.822C113.525 164.822 108.925 166.622 105.325 170.122L100.825 174.622L5.325 270.122C-1.775 277.222 -1.775 288.822 5.325 295.922L9.825 300.422C13.425 304.022 18.025 305.722 22.725 305.722C27.425 305.722 32.025 303.922 35.625 300.422L118.225 217.822L122.025 221.622L200.725 300.322L217.425 317.022L221.925 321.522C225.525 325.122 230.125 326.822 234.825 326.822C239.525 326.822 244.125 325.022 247.725 321.522L252.225 317.022L330.925 238.322L347.625 221.622L354.425 214.822L430.925 138.322L440.225 129.022L465.225 153.822C467.525 156.122 469.825 158.622 473.125 158.622C474.325 158.622 475.725 158.222 477.225 157.422C482.225 154.722 483.325 150.322 483.525 145.422C484.725 118.422 486.025 91.522 487.325 64.522C487.625 56.422 484.225 52.722 476.325 52.722Z" fill="#1B5E20"/>
                      <path d="M201.025 333.422L184.325 316.722L148.325 280.722C146.725 283.422 145.825 286.622 145.825 289.922V297.122V385.922V393.122C145.825 403.222 154.025 411.322 164.025 411.322H205.025C215.125 411.322 223.225 403.122 223.225 393.122V385.922V348.422C216.625 346.522 210.525 342.922 205.525 337.922L201.025 333.422Z" fill="#1B5E20"/>
                      <path d="M268.525 333.422L264.025 337.922C260.725 341.222 256.925 343.922 252.725 345.922V385.922V393.122C252.725 403.222 260.925 411.322 270.925 411.322H311.925C322.025 411.322 330.125 403.122 330.125 393.122V385.922V297.122V289.922C330.125 284.922 328.125 280.422 324.825 277.122L268.525 333.422Z" fill="#1B5E20"/>
                      <path d="M370.725 231.122L363.925 237.922L359.525 242.322V254.822V263.422V297.022V305.622V350.722V392.922C359.525 403.022 367.725 411.122 377.725 411.122H418.725C428.825 411.122 436.925 402.922 436.925 392.922V350.722V305.722V297.122V263.522V254.922V209.722V167.522C436.925 166.722 436.825 165.922 436.725 165.122L370.725 231.122Z" fill="#1B5E20"/>
                    </svg>
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
      path: '/report/stock/overview',
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
      path: '/report/stock/overview',
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
      name: 'Sales Tracking',
      path: '/report/sales/tracking',
      icon: 'description'
    },
    {
      name: 'Sales Growth',
      path: '/report/sales/growth',
      icon: 'description'
    },
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
