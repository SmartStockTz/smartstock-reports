import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-report-stock-tracking',
  template: `
<!--    <app-layout-sidenav [leftDrawerOpened]="enoughWidth()"-->
<!--                               [leftDrawerMode]="enoughWidth()?'side': 'over'" [leftDrawer]="leftDrawer"-->
<!--                               [body]="body" [heading]="'Stock Tracking'">-->
<!--      <ng-template #leftDrawer>-->
<!--        <app-drawer></app-drawer>-->
<!--      </ng-template>-->
<!--      <ng-template #body>-->
<!--        <div class="container col-xl-9 col-lg-9 col-md-10 col-sm-11 pt-5">-->
<!--              <app-stock-tracking></app-stock-tracking>-->
<!--        </div>-->
<!--      </ng-template>-->
<!--    </app-layout-sidenav>-->
  `
})
export class StockTrackingPage implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
    document.title = 'Stock Tracking';
  }
}
