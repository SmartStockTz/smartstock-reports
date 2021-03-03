import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ReportService} from '../services/report.service';
import {toSqlDate} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-total-sales',
  template: `
    <div style="height: 100%" class="justify-content-center align-items-center">

      <div class="pb-3">
        <div class="row m-0" style="justify-content: space-evenly">
          <div class="col-md-6 col-lg-4">
            <mat-card class="d-flex mx-auto mat-elevation-z3 align-items-center my-3 box-shadow  py-4 total-sales">
              <svg width="36" height="40" viewBox="0 0 76 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M54.4601 52.4682C52.3767 52.4682 50.3629 52.3394 48.4572 52.0999V46.2398C50.3632 46.4794 52.3761 46.6099 54.4601 46.6099C64.8441 46.6099 73.511 43.4199 75.5468 39.1744C75.8433 39.7928 75.9998 40.4331 75.9998 41.0895V43.1174C75.9998 48.2818 66.3561 52.4682 54.4601 52.4682Z"
                  fill="green"/>
                <path
                  d="M48.4574 57.841V57.3855C50.3634 57.6251 52.3763 57.7557 54.4603 57.7557C64.8442 57.7557 73.5112 54.5657 75.547 50.3201C75.8435 50.9384 76 51.5787 76 52.2351V54.263C76 59.4276 66.3563 63.6139 54.4603 63.6139C52.0813 63.6139 49.7932 63.4461 47.6534 63.1369C48.1838 62.0984 48.4574 61.0033 48.4574 59.8688V57.841Z"
                  fill="green"/>
                <path
                  d="M48.4574 67.1964V66.7409C50.3634 66.9805 52.3763 67.111 54.4603 67.111C64.8442 67.111 73.5112 63.921 75.547 59.6755C75.8435 60.2937 76 60.9341 76 61.5905V63.6184C76 68.7829 66.3563 72.9693 54.4603 72.9693C52.0813 72.9693 49.7932 72.8014 47.6534 72.4922C48.1838 71.4538 48.4574 70.3586 48.4574 69.2241V67.1964Z"
                  fill="green"/>
                <path
                  d="M54.1798 0.364716C42.2838 0.364716 32.6401 4.55108 32.6401 9.71544V11.7433C32.6401 16.9077 42.2838 21.0941 54.1798 21.0941C66.0757 21.0941 75.7195 16.9077 75.7195 11.7433V9.71544C75.7195 4.55108 66.0757 0.364716 54.1798 0.364716Z"
                  fill="green"/>
                <path
                  d="M54.1798 25.6753C43.7959 25.6753 35.129 22.4855 33.0932 18.2398C32.7967 18.858 32.6401 19.4984 32.6401 20.1549V22.1828C32.6401 27.3472 42.2838 31.5336 54.1798 31.5336C66.0757 31.5336 75.7195 27.3472 75.7195 22.1828V20.1549C75.7195 19.4984 75.563 18.858 75.2665 18.2398C73.2307 22.4855 64.5638 25.6753 54.1798 25.6753Z"
                  fill="green"/>
                <path
                  d="M54.1798 36.115C43.7959 36.115 35.129 32.925 33.0932 28.6794C32.7967 29.2977 32.6401 29.938 32.6401 30.5946V32.6225C32.6401 37.787 42.2838 41.9734 54.1798 41.9734C66.0757 41.9734 75.7195 37.787 75.7195 32.6225V30.5946C75.7195 29.938 75.563 29.2977 75.2665 28.6794C73.2307 32.9252 64.5638 36.115 54.1798 36.115Z"
                  fill="green"/>
                <path
                  d="M22.2231 40.4339C10.3271 40.4339 0.683411 44.6203 0.683411 49.7847V51.8126C0.683411 56.9769 10.3271 61.1633 22.2231 61.1633C34.1189 61.1633 43.7628 56.9769 43.7628 51.8126V49.7847C43.7628 44.6203 34.1189 40.4339 22.2231 40.4339Z"
                  fill="green"/>
                <path
                  d="M22.3996 66.0054C12.0157 66.0054 3.34875 62.8154 1.31294 58.5699C1.01647 59.1883 0.859926 59.8284 0.859926 60.4848V62.5129C0.859926 67.6773 10.5036 71.8636 22.3996 71.8636C34.2955 71.8636 43.9393 67.6773 43.9393 62.5129V60.4848C43.9393 59.8284 43.7828 59.1879 43.4863 58.5699C41.4505 62.8152 32.7836 66.0054 22.3996 66.0054Z"
                  fill="green"/>
                <path
                  d="M22.2231 76.9745C11.8392 76.9745 3.17223 73.7846 1.13643 69.5391C0.839953 70.1575 0.683411 70.798 0.683411 71.4541V73.482C0.683411 78.6463 10.3271 82.8327 22.2231 82.8327C34.1189 82.8327 43.7628 78.6463 43.7628 73.482V71.4539C43.7628 70.7975 43.6063 70.157 43.3098 69.5389C41.274 73.7845 32.607 76.9745 22.2231 76.9745Z"
                  fill="green"/>
              </svg>
              <hr>
              <div class="">
                <p class=" mb-0 text-center">Today Sales so far</p>
                <p *ngIf="!todaySalesProgress" class="mb-0 h6">{{todaySales | currency: 'TZS '}}/=</p>
                <app-data-not-ready [width]="100" height="100" [isLoading]="todaySalesProgress"
                                           *ngIf="todaySalesProgress  || (!todaySales && todaySales==null)"></app-data-not-ready>
              </div>
              <!--                        <hr class="ml-2 w-75">-->
            </mat-card>
          </div>

<div class="row m-0 col-lg-8">
          <div class=" col-md-6 col-lg-6 px-0">
            <mat-card class="d-flex mx-auto mat-elevation-z3 align-items-center my-3 box-shadow  py-4 total-sales">
              <svg width="36" height="40" viewBox="0 0 76 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M54.4601 52.4682C52.3767 52.4682 50.3629 52.3394 48.4572 52.0999V46.2398C50.3632 46.4794 52.3761 46.6099 54.4601 46.6099C64.8441 46.6099 73.511 43.4199 75.5468 39.1744C75.8433 39.7928 75.9998 40.4331 75.9998 41.0895V43.1174C75.9998 48.2818 66.3561 52.4682 54.4601 52.4682Z"
                  fill="green"/>
                <path
                  d="M48.4574 57.841V57.3855C50.3634 57.6251 52.3763 57.7557 54.4603 57.7557C64.8442 57.7557 73.5112 54.5657 75.547 50.3201C75.8435 50.9384 76 51.5787 76 52.2351V54.263C76 59.4276 66.3563 63.6139 54.4603 63.6139C52.0813 63.6139 49.7932 63.4461 47.6534 63.1369C48.1838 62.0984 48.4574 61.0033 48.4574 59.8688V57.841Z"
                  fill="green"/>
                <path
                  d="M48.4574 67.1964V66.7409C50.3634 66.9805 52.3763 67.111 54.4603 67.111C64.8442 67.111 73.5112 63.921 75.547 59.6755C75.8435 60.2937 76 60.9341 76 61.5905V63.6184C76 68.7829 66.3563 72.9693 54.4603 72.9693C52.0813 72.9693 49.7932 72.8014 47.6534 72.4922C48.1838 71.4538 48.4574 70.3586 48.4574 69.2241V67.1964Z"
                  fill="green"/>
                <path
                  d="M54.1798 0.364716C42.2838 0.364716 32.6401 4.55108 32.6401 9.71544V11.7433C32.6401 16.9077 42.2838 21.0941 54.1798 21.0941C66.0757 21.0941 75.7195 16.9077 75.7195 11.7433V9.71544C75.7195 4.55108 66.0757 0.364716 54.1798 0.364716Z"
                  fill="green"/>
                <path
                  d="M54.1798 25.6753C43.7959 25.6753 35.129 22.4855 33.0932 18.2398C32.7967 18.858 32.6401 19.4984 32.6401 20.1549V22.1828C32.6401 27.3472 42.2838 31.5336 54.1798 31.5336C66.0757 31.5336 75.7195 27.3472 75.7195 22.1828V20.1549C75.7195 19.4984 75.563 18.858 75.2665 18.2398C73.2307 22.4855 64.5638 25.6753 54.1798 25.6753Z"
                  fill="green"/>
                <path
                  d="M54.1798 36.115C43.7959 36.115 35.129 32.925 33.0932 28.6794C32.7967 29.2977 32.6401 29.938 32.6401 30.5946V32.6225C32.6401 37.787 42.2838 41.9734 54.1798 41.9734C66.0757 41.9734 75.7195 37.787 75.7195 32.6225V30.5946C75.7195 29.938 75.563 29.2977 75.2665 28.6794C73.2307 32.9252 64.5638 36.115 54.1798 36.115Z"
                  fill="green"/>
                <path
                  d="M22.2231 40.4339C10.3271 40.4339 0.683411 44.6203 0.683411 49.7847V51.8126C0.683411 56.9769 10.3271 61.1633 22.2231 61.1633C34.1189 61.1633 43.7628 56.9769 43.7628 51.8126V49.7847C43.7628 44.6203 34.1189 40.4339 22.2231 40.4339Z"
                  fill="green"/>
                <path
                  d="M22.3996 66.0054C12.0157 66.0054 3.34875 62.8154 1.31294 58.5699C1.01647 59.1883 0.859926 59.8284 0.859926 60.4848V62.5129C0.859926 67.6773 10.5036 71.8636 22.3996 71.8636C34.2955 71.8636 43.9393 67.6773 43.9393 62.5129V60.4848C43.9393 59.8284 43.7828 59.1879 43.4863 58.5699C41.4505 62.8152 32.7836 66.0054 22.3996 66.0054Z"
                  fill="green"/>
                <path
                  d="M22.2231 76.9745C11.8392 76.9745 3.17223 73.7846 1.13643 69.5391C0.839953 70.1575 0.683411 70.798 0.683411 71.4541V73.482C0.683411 78.6463 10.3271 82.8327 22.2231 82.8327C34.1189 82.8327 43.7628 78.6463 43.7628 73.482V71.4539C43.7628 70.7975 43.6063 70.157 43.3098 69.5389C41.274 73.7845 32.607 76.9745 22.2231 76.9745Z"
                  fill="green"/>
              </svg>
              <hr>
              <div class="">
                <p class=" mb-0 text-center">This Week Sales so far</p>
                <p *ngIf="!weekSalesProgress" class="mb-0 h6">{{weekSales | currency: 'TZS '}}/=</p>
                <app-data-not-ready [width]="100" height="100" [isLoading]="weekSalesProgress"
                                           *ngIf="weekSalesProgress  || (!weekSales && weekSales!==0)"></app-data-not-ready>
              </div>
              <!--                        <hr class="ml-2 w-75">-->
            </mat-card>
          </div>

          <div class="col-md-6 col-lg-6 px-0">
            <mat-card class="d-flex mx-auto mat-elevation-z3 align-items-center my-3 box-shadow  py-4 total-sales">
              <svg width="36" height="40" viewBox="0 0 76 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M54.4601 52.4682C52.3767 52.4682 50.3629 52.3394 48.4572 52.0999V46.2398C50.3632 46.4794 52.3761 46.6099 54.4601 46.6099C64.8441 46.6099 73.511 43.4199 75.5468 39.1744C75.8433 39.7928 75.9998 40.4331 75.9998 41.0895V43.1174C75.9998 48.2818 66.3561 52.4682 54.4601 52.4682Z"
                  fill="green"/>
                <path
                  d="M48.4574 57.841V57.3855C50.3634 57.6251 52.3763 57.7557 54.4603 57.7557C64.8442 57.7557 73.5112 54.5657 75.547 50.3201C75.8435 50.9384 76 51.5787 76 52.2351V54.263C76 59.4276 66.3563 63.6139 54.4603 63.6139C52.0813 63.6139 49.7932 63.4461 47.6534 63.1369C48.1838 62.0984 48.4574 61.0033 48.4574 59.8688V57.841Z"
                  fill="green"/>
                <path
                  d="M48.4574 67.1964V66.7409C50.3634 66.9805 52.3763 67.111 54.4603 67.111C64.8442 67.111 73.5112 63.921 75.547 59.6755C75.8435 60.2937 76 60.9341 76 61.5905V63.6184C76 68.7829 66.3563 72.9693 54.4603 72.9693C52.0813 72.9693 49.7932 72.8014 47.6534 72.4922C48.1838 71.4538 48.4574 70.3586 48.4574 69.2241V67.1964Z"
                  fill="green"/>
                <path
                  d="M54.1798 0.364716C42.2838 0.364716 32.6401 4.55108 32.6401 9.71544V11.7433C32.6401 16.9077 42.2838 21.0941 54.1798 21.0941C66.0757 21.0941 75.7195 16.9077 75.7195 11.7433V9.71544C75.7195 4.55108 66.0757 0.364716 54.1798 0.364716Z"
                  fill="green"/>
                <path
                  d="M54.1798 25.6753C43.7959 25.6753 35.129 22.4855 33.0932 18.2398C32.7967 18.858 32.6401 19.4984 32.6401 20.1549V22.1828C32.6401 27.3472 42.2838 31.5336 54.1798 31.5336C66.0757 31.5336 75.7195 27.3472 75.7195 22.1828V20.1549C75.7195 19.4984 75.563 18.858 75.2665 18.2398C73.2307 22.4855 64.5638 25.6753 54.1798 25.6753Z"
                  fill="green"/>
                <path
                  d="M54.1798 36.115C43.7959 36.115 35.129 32.925 33.0932 28.6794C32.7967 29.2977 32.6401 29.938 32.6401 30.5946V32.6225C32.6401 37.787 42.2838 41.9734 54.1798 41.9734C66.0757 41.9734 75.7195 37.787 75.7195 32.6225V30.5946C75.7195 29.938 75.563 29.2977 75.2665 28.6794C73.2307 32.9252 64.5638 36.115 54.1798 36.115Z"
                  fill="green"/>
                <path
                  d="M22.2231 40.4339C10.3271 40.4339 0.683411 44.6203 0.683411 49.7847V51.8126C0.683411 56.9769 10.3271 61.1633 22.2231 61.1633C34.1189 61.1633 43.7628 56.9769 43.7628 51.8126V49.7847C43.7628 44.6203 34.1189 40.4339 22.2231 40.4339Z"
                  fill="green"/>
                <path
                  d="M22.3996 66.0054C12.0157 66.0054 3.34875 62.8154 1.31294 58.5699C1.01647 59.1883 0.859926 59.8284 0.859926 60.4848V62.5129C0.859926 67.6773 10.5036 71.8636 22.3996 71.8636C34.2955 71.8636 43.9393 67.6773 43.9393 62.5129V60.4848C43.9393 59.8284 43.7828 59.1879 43.4863 58.5699C41.4505 62.8152 32.7836 66.0054 22.3996 66.0054Z"
                  fill="green"/>
                <path
                  d="M22.2231 76.9745C11.8392 76.9745 3.17223 73.7846 1.13643 69.5391C0.839953 70.1575 0.683411 70.798 0.683411 71.4541V73.482C0.683411 78.6463 10.3271 82.8327 22.2231 82.8327C34.1189 82.8327 43.7628 78.6463 43.7628 73.482V71.4539C43.7628 70.7975 43.6063 70.157 43.3098 69.5389C41.274 73.7845 32.607 76.9745 22.2231 76.9745Z"
                  fill="green"/>
              </svg>
              <hr>
              <div class="">
                <p class=" mb-0 text-center">This Month Sales so far</p>
                <p *ngIf="!monthlySalesProgress" class="mb-0 h6">{{monthlySales | currency: 'TZS '}}/=</p>
                <app-data-not-ready [width]="100" height="100" [isLoading]="monthlySalesProgress"
                                           *ngIf="monthlySalesProgress  || (!monthlySales && monthlySales!==0)"></app-data-not-ready>
              </div>
              <!--                        <hr class="ml-2 w-75">-->
            </mat-card>
          </div>
</div>
        </div>

      </div>
      <!--      <span style="font-size: 30px">{{totalSale | currency: 'TZS '}}</span>-->
    </div>
  `,
  styleUrls: ['../styles/total-sales.style.scss'],
})
export class TotalSalesComponent implements OnInit {
  totalSale = 0;
  todaySalesProgress = false;
  weekSalesProgress = false;
  monthlySalesProgress = false;
  todaySales = 0;
  weekSales = 0;
  monthlySales = 0;
  startDate = new Date();
  endDate = new Date();

  @Input() dateRange: Observable<{ begin: Date, end: Date }>;
  @Input() initialDataRange: { begin: Date, end: Date };

  constructor(private readonly report: ReportService) {
  }

  ngOnInit(): void {
    this.getTodaySales();
    this.getWeekSales();
    this.getMonthSales();
  }


  // tslint:disable-next-line:typedef
  getTodaySales() {
    this.todaySalesProgress = true;
    this.report.getSalesOverview(toSqlDate(this.startDate), toSqlDate(this.endDate), 'day').then(data => {
      this.todaySales = data[0].amount;
      this.todaySalesProgress = false;
    }).catch(reason => {
      this.todaySalesProgress = false;
      // this.snack.open('Fails to get Total Sales', 'Ok', {
      //   duration: 3000
      // });
    });
  }

  // tslint:disable-next-line:typedef
  getWeekSales() {
    this.weekSalesProgress = true;
    this.startDate = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
    this.report.getSalesOverview(toSqlDate(this.startDate), toSqlDate(this.endDate), 'month').then(data => {
      this.weekSales = data[0].amount;
      this.weekSalesProgress = false;
    }).catch(reason => {
      this.weekSalesProgress = false;
      // this.snack.open('Fails to get Total Sales', 'Ok', {
      //   duration: 3000
      // });
    });
  }

  // tslint:disable-next-line:typedef
  getMonthSales(){
    this.monthlySalesProgress = true;
    this.startDate = new Date(new Date().setDate(new Date().getDate() - (new Date().getDate() - 1)));
    this.report.getSalesOverview(toSqlDate(this.startDate), toSqlDate(this.endDate), 'month').then(data => {
      this.monthlySales = data[0].amount;
      this.monthlySalesProgress = false;
    }).catch(reason => {
      this.monthlySalesProgress = false;
      // this.snack.open('Fails to get Total Sales', 'Ok', {
      //   duration: 3000
      // });
    });
  }


}
