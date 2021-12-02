import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';
import {ReportNavigationService} from "../services/report-navigation.service";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-report-index',
  template: `
    <app-layout-sidenav
      [heading]="'Reports'"
      [leftDrawerMode]="(deviceState.enoughWidth | async) ===true?'side':'over'"
      [leftDrawerOpened]="(deviceState.enoughWidth | async) ===true"
      [body]="body"
      [leftDrawer]="side">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="padding: 16px 0; margin-bottom: 100px" *ngIf="(deviceState.isSmallScreen | async)===true">
          <mat-nav-list>
            <app-libs-rbac [groups]="['admin']" [pagePath]="page.link" *ngFor="let page of reportPages">
              <ng-template>
                <mat-list-item routerLink="{{page.link}}">
                  <mat-icon color="primary" matListIcon>{{page.icon}}</mat-icon>
                  <h1 matLine>{{page.name}}</h1>
                  <mat-card-subtitle matLine>{{page.detail}}</mat-card-subtitle>
                </mat-list-item>
                <mat-divider></mat-divider>
              </ng-template>
            </app-libs-rbac>
          </mat-nav-list>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})

export class IndexPage implements OnInit, OnDestroy {
  reportPages = [];
  destroyer = new Subject();

  constructor(public readonly deviceState: DeviceState,
              private readonly router: Router,
              private readonly navigation: ReportNavigationService) {
  }

  async ngOnInit(): Promise<void> {
    document.title = 'Smartstock - Reports';
    this.deviceState.isSmallScreen.pipe(takeUntil(this.destroyer)).subscribe(value => {
      if (value === false) {
        this.router.navigateByUrl('/report/sales/overview/cash/day').catch(console.log);
      }
    });
    this.reportPages = this.navigation.getPages();
  }

  ngOnDestroy(): void {
    this.destroyer.next('done');
  }

}
