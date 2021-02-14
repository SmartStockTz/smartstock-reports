import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ReportService} from '../services/report.service';
import {toSqlDate} from '@smartstocktz/core-libs';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'smartstock-profit',
  template: `
    <div style="height: 100%" class="justify-content-center align-items-center">
      <div class="pb-3">
        <div class="row m-0" style="justify-content: space-evenly">

          <div class="col-md-11 col-lg-5">
            <mat-card class="d-flex  mat-elevation-z3 align-items-center col-md-7 my-3 py-4 profit">
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
              <hr class="profit-hr">
              <div class="">
                <p class=" mb-0 text-center">Gross Profit Vs Prior Year</p>
                <p *ngIf="!todaySalesProgress" class="mb-0 h6">{{todaySales | currency: 'TZS '}}/=</p>
                <smartstock-data-not-ready [width]="100" height="100" [isLoading]="todaySalesProgress"
                                           *ngIf="todaySalesProgress  || (!todaySales && todaySales==null)"></smartstock-data-not-ready>
              </div>
            </mat-card>
              <mat-card class="mat-elevation-z3 my-3 py-4 profit">
              <div class="row m-0 justify-content-center align-items-center">
                <svg class="px-3" width="40" height="36" viewBox="0 0 488 412" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M51.725 316.622C48.025 320.322 43.625 323.322 38.925 325.322V350.822V393.022C38.925 403.122 47.125 411.222 57.125 411.222H98.125C108.225 411.222 116.325 403.022 116.325 393.022V350.822V297.022V254.822C116.325 253.922 116.225 253.022 116.125 252.222L51.725 316.622Z" fill="#1B5E20"/>
                  <path d="M476.325 52.722C475.925 52.722 475.525 52.722 475.025 52.722C447.425 54.022 419.725 55.322 392.125 56.622C387.825 56.822 383.625 57.022 381.225 62.222C378.825 67.322 381.525 70.222 384.525 73.222C393.025 81.722 401.425 90.322 410.025 98.622L400.625 108.022L324.125 184.522L317.325 191.322L300.625 208.022L234.825 273.822L231.025 270.022L152.325 191.322L135.625 174.622L131.125 170.122C127.525 166.522 122.925 164.822 118.225 164.822C113.525 164.822 108.925 166.622 105.325 170.122L100.825 174.622L5.325 270.122C-1.775 277.222 -1.775 288.822 5.325 295.922L9.825 300.422C13.425 304.022 18.025 305.722 22.725 305.722C27.425 305.722 32.025 303.922 35.625 300.422L118.225 217.822L122.025 221.622L200.725 300.322L217.425 317.022L221.925 321.522C225.525 325.122 230.125 326.822 234.825 326.822C239.525 326.822 244.125 325.022 247.725 321.522L252.225 317.022L330.925 238.322L347.625 221.622L354.425 214.822L430.925 138.322L440.225 129.022L465.225 153.822C467.525 156.122 469.825 158.622 473.125 158.622C474.325 158.622 475.725 158.222 477.225 157.422C482.225 154.722 483.325 150.322 483.525 145.422C484.725 118.422 486.025 91.522 487.325 64.522C487.625 56.422 484.225 52.722 476.325 52.722Z" fill="#1B5E20"/>
                  <path d="M201.025 333.422L184.325 316.722L148.325 280.722C146.725 283.422 145.825 286.622 145.825 289.922V297.122V385.922V393.122C145.825 403.222 154.025 411.322 164.025 411.322H205.025C215.125 411.322 223.225 403.122 223.225 393.122V385.922V348.422C216.625 346.522 210.525 342.922 205.525 337.922L201.025 333.422Z" fill="#1B5E20"/>
                  <path d="M268.525 333.422L264.025 337.922C260.725 341.222 256.925 343.922 252.725 345.922V385.922V393.122C252.725 403.222 260.925 411.322 270.925 411.322H311.925C322.025 411.322 330.125 403.122 330.125 393.122V385.922V297.122V289.922C330.125 284.922 328.125 280.422 324.825 277.122L268.525 333.422Z" fill="#1B5E20"/>
                  <path d="M370.725 231.122L363.925 237.922L359.525 242.322V254.822V263.422V297.022V305.622V350.722V392.922C359.525 403.022 367.725 411.122 377.725 411.122H418.725C428.825 411.122 436.925 402.922 436.925 392.922V350.722V305.722V297.122V263.522V254.922V209.722V167.522C436.925 166.722 436.825 165.922 436.725 165.122L370.725 231.122Z" fill="#1B5E20"/>
                </svg>               </div>
              <hr class="w-75 mt-0 mx-auto" color="primary">

                <div class="d-flex justify-content-center align-items-center py-3" style="height: 350px">
                  <div class="w-100 h-100" id="grossProfit"></div>
<!--                  <smartstock-data-not-ready style="position: absolute" [width]="100" height="100"-->
<!--                                             [isLoading]="salesStatusProgress"-->
<!--                                             *ngIf="salesStatusProgress  || (!salesGrowthStatus)"></smartstock-data-not-ready>-->
                </div>
            </mat-card>
          </div>

          <div class="col-md-6 col-lg-5">
            <mat-card class="d-flex  mat-elevation-z3 align-items-center col-md-7 my-3 py-4 profit">
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
              <hr class="profit-hr">
              <div class="">
                <p class=" mb-0 text-center">Net Profit Vs Prior Year</p>
                <p *ngIf="!todaySalesProgress" class="mb-0 h6">{{todaySales | currency: 'TZS '}}/=</p>
                <smartstock-data-not-ready [width]="100" height="100" [isLoading]="todaySalesProgress"
                                           *ngIf="todaySalesProgress  || (!todaySales && todaySales==null)"></smartstock-data-not-ready>
              </div>
              <!--                        <hr class="ml-2 w-75">-->
            </mat-card>
            <mat-card class=" mat-elevation-z3 my-3 box-shadow  py-4 profit">
              <div class="row m-0 justify-content-center align-items-center">
                <svg class="pr-2" width="36" height="40" viewBox="0 0 76 83" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <p class="m-0 h6">Net Profit Vs Prior Year</p>
              </div>
              <hr class="w-75 mt-0 mx-auto" color="primary">

              <div class="d-flex justify-content-center align-items-center py-3" style="height: 350px">
                <div style="width: 100%; height: 100%" id="netProfit"></div>
<!--                <smartstock-data-not-ready style="position: absolute" [width]="100" height="100"-->
<!--                                           [isLoading]="salesStatusProgress"-->
<!--                                           *ngIf="salesStatusProgress  || (!salesGrowthStatus)"></smartstock-data-not-ready>-->
              </div>
            </mat-card>
          </div>
        </div>

      </div>
      <!--      <span style="font-size: 30px">{{totalSale | currency: 'TZS '}}</span>-->
    </div>
  `,
  styleUrls: ['../styles/profit.style.scss'],
})
export class ProfitComponent implements OnInit {
  totalSale = 0;
  todaySalesProgress = false;
  weekSalesProgress = false;
  monthlySalesProgress = false;
  todaySales = 0;
  weekSales = 0;
  monthlySales = 0;
  startDate = new Date();
  endDate = new Date();
  channel = 'retail';
  grossProfitChart: Highcharts.Chart = undefined;
  netProfitChart: Highcharts.Chart = undefined;

  @Input() dateRange: Observable<{ begin: Date, end: Date }>;
  @Input() initialDataRange: { begin: Date, end: Date };
  @Input() salesChannel;

  constructor(private readonly report: ReportService) {
  }

  ngOnInit(): void {
    this.getTodaySales();
    this.getWeekSales();
    this.getMonthSales();
    this.initiateGraph(55);

    this.salesChannel.subscribe(value => {
      this.channel = value;
      this.getTodaySales();
      this.getWeekSales();
      this.getMonthSales();
    });

  }


  // tslint:disable-next-line:typedef
  getTodaySales() {
    this.todaySalesProgress = true;
    this.report.getTotalSale(this.startDate, this.endDate, this.channel).then(data => {
      this.todaySales = data;
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
    this.report.getTotalSale(this.startDate, this.endDate, this.channel).then(data => {
      this.weekSales = data;
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
    this.report.getTotalSale(this.startDate, this.endDate, this.channel).then(data => {
      this.monthlySales = data;
      this.monthlySalesProgress = false;
    }).catch(reason => {
      this.monthlySalesProgress = false;
      // this.snack.open('Fails to get Total Sales', 'Ok', {
      //   duration: 3000
      // });
    });
  }

  // tslint:disable-next-line:typedef
  private initiateGraph(data: any) {
    // @ts-ignore
    this.grossProfitChart = Highcharts.chart('grossProfit',  {
    chart: {
    // renderTo: 'grossProfit',
  //     margin: 0,
        type: 'column',
    },
    title: {
        text: null
    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]
    },
    yAxis: [{
        title: {
            text: 'Employees'
        }
    }],
    tooltip: {
        shared: true
    },
    plotOptions: {
        column: {
            grouping: false,
        }
    },
    series: [{
        name: '2020',
        color: 'rgba(27, 94, 32,.7)',
        data: [150, 73, 50, 40, 4, 10, 40, 14, 40, 4, 10, 30],
        pointPadding: 0.2,
        pointPlacement: -0.3
    }, {
        name: '2021',
        color: 'rgba(27, 94, 32,1)',
        data: [140, 40, 4, 40, 4, 10, 40, 4, 40, 14, 10, 20],
        pointPadding: 0.2,
        pointPlacement: 0
    }]
});

// setTimeout( () => this.hcChart = Highcharts.chart(this.grossProfit.nativeElement, options ) );

    this.grossProfitChart.reflow();
    // @ts-ignore
    this.netProfitChart = Highcharts.chart('netProfit', {
      chart: {
        type: 'column'
      },
      title: {
        text: null
      },
      xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes']
      },
      series: [{
        name: 'John',
        data: [5, 3, -4, 7]
      }, {
        name: 'Joe',
        data: [3, 4, 4, -2]
      }]
    });
  }
}
