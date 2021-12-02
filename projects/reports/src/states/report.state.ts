import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DateRangeModel} from '../models/date-range.model';
import {ReportService} from '../services/report.service';
import {CashSalesOverviewModel} from '../models/cash-sales-overview.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {json2csv} from '../services/json2csv.service';
import {InvoiceSalesOverviewModel} from '../models/invoice-sales-overview.model';
import {CashSalesTrackModel} from "../models/cash-sales-track.model";

@Injectable({
  providedIn: 'root'
})
export class ReportState {
  loadDayCashSales = new BehaviorSubject(false);
  loadDayInvoiceSales = new BehaviorSubject(false);
  loadMonthCashSales = new BehaviorSubject(false);
  loadMonthInvoiceSales = new BehaviorSubject(false);
  loadYearInvoiceSales = new BehaviorSubject(false);
  cashSalesByDay = new BehaviorSubject<CashSalesOverviewModel[]>([]);
  invoiceSalesByDay = new BehaviorSubject<InvoiceSalesOverviewModel[]>([]);
  cashSalesByMonth = new BehaviorSubject<CashSalesOverviewModel[]>([]);
  cashSalesByYear = new BehaviorSubject<CashSalesOverviewModel[]>([]);
  invoiceSalesByMonth = new BehaviorSubject<InvoiceSalesOverviewModel[]>([]);
  invoiceSalesByYear = new BehaviorSubject<InvoiceSalesOverviewModel[]>([]);
  cashSalesTracking = new BehaviorSubject<CashSalesTrackModel[]>([]);
  loadYearCashSales = new BehaviorSubject(false);
  loadCashSalesTracking = new BehaviorSubject(false);

  constructor(private readonly reportService: ReportService,
              private readonly snack: MatSnackBar) {
  }

  private message(e: string): void {
    this.snack.open(e, 'Ok', {
      duration: 2000
    });
  }

  fetchCashSaleByDay(date: DateRangeModel): void {
    this.loadDayCashSales.next(true);
    this.reportService.getSalesOverview(date.from, date.to, 'day').then(value => {
      this.cashSalesByDay.next(value);
    }).catch(e => {
      this.message(e ? e.message : 'Fail to get report');
    }).finally(() => {
      this.loadDayCashSales.next(false);
    });
  }

  fetchInvoiceSaleByDay(date: DateRangeModel): void {
    this.loadDayInvoiceSales.next(true);
    this.reportService.getInvoiceSalesOverview(date.from, date.to, 'day').then(value => {
      this.invoiceSalesByDay.next(value);
    }).catch(e => {
      this.message(e ? e.message : 'Fail to get report');
    }).finally(() => {
      this.loadDayInvoiceSales.next(false);
    });
  }

  exportCashSaleByDay(): void {
    const exportedDataCartColumns = ['id', 'amount', 'amount_retail', 'amount_whole'];
    json2csv(`cash_sales_report_by_day.csv`, exportedDataCartColumns,
      this.cashSalesByDay.value).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      this.message('Fails to export reports');
    });
  }

  exportInvoiceSaleByDay(): void {
    const exportedDataCartColumns = ['id', 'amount', 'amount_credit', 'amount_online'];
    json2csv(`invoice_sales_report_by_day.csv`, exportedDataCartColumns,
      this.invoiceSalesByDay.value).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      this.message('Fails to export reports');
    });
  }

  dispose(): void {
    this.loadDayCashSales.next(false);
    this.loadMonthCashSales.next(false);
    this.loadYearCashSales.next(false);
    this.loadDayInvoiceSales.next(false);
    this.loadMonthInvoiceSales.next(false);
    this.loadYearInvoiceSales.next(false);
    this.loadCashSalesTracking.next(false);
    this.cashSalesByDay.next([]);
    this.invoiceSalesByDay.next([]);
    this.cashSalesByMonth.next([]);
    this.cashSalesByYear.next([]);
    this.invoiceSalesByMonth.next([]);
    this.invoiceSalesByYear.next([]);
  }

  fetchCashSaleByMonth(date: DateRangeModel): void {
    this.loadMonthCashSales.next(true);
    this.reportService.getSalesOverview(date.from, date.to, 'month').then(value => {
      this.cashSalesByMonth.next(value);
    }).catch(e => {
      this.message(e ? e.message : 'Fail to get report');
    }).finally(() => {
      this.loadMonthCashSales.next(false);
    });
  }

  fetchInvoiceSaleByMonth(date: DateRangeModel): void {
    this.loadMonthInvoiceSales.next(true);
    this.reportService.getInvoiceSalesOverview(date.from, date.to, 'month').then(value => {
      this.invoiceSalesByMonth.next(value);
    }).catch(e => {
      this.message(e ? e.message : 'Fail to get report');
    }).finally(() => {
      this.loadMonthInvoiceSales.next(false);
    });
  }

  exportCashSaleByMonth(): void {
    const exportedDataCartColumns = ['id', 'amount', 'amount_retail', 'amount_whole'];
    json2csv(`cash_sales_report_by_month.csv`, exportedDataCartColumns,
      this.cashSalesByMonth.value).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      this.message('Fails to export reports');
    });
  }

  exportInvoiceSaleByMonth(): void {
    const exportedDataCartColumns = ['id', 'amount', 'amount_credit', 'amount_online'];
    json2csv(`invoice_sales_report_by_month.csv`, exportedDataCartColumns,
      this.invoiceSalesByMonth.value).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      this.message('Fails to export reports');
    });
  }

  fetchCashSaleByYear(date: DateRangeModel): void {
    this.loadYearCashSales.next(true);
    this.reportService.getSalesOverview(date.from, date.to, 'year').then(value => {
      this.cashSalesByYear.next(value);
    }).catch(e => {
      this.message(e ? e.message : 'Fail to get report');
    }).finally(() => {
      this.loadYearCashSales.next(false);
    });
  }

  exportCashSaleByYear(): void {
    const exportedDataCartColumns = ['id', 'amount', 'amount_retail', 'amount_whole'];
    json2csv(`cash_sales_report_by_year.csv`, exportedDataCartColumns,
      this.cashSalesByYear.value).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      this.message('Fails to export reports');
    });
  }

  fetchInvoiceSaleByYear(date: DateRangeModel): void {
    this.loadYearInvoiceSales.next(true);
    this.reportService.getInvoiceSalesOverview(date.from, date.to, 'year').then(value => {
      this.invoiceSalesByYear.next(value);
    }).catch(e => {
      this.message(e ? e.message : 'Fail to get report');
    }).finally(() => {
      this.loadYearInvoiceSales.next(false);
    });
  }

  exportInvoiceSaleByYear(): void {
    const exportedDataCartColumns = ['id', 'amount', 'amount_credit', 'amount_online'];
    json2csv(`invoice_sales_report_by_year.csv`, exportedDataCartColumns,
      this.invoiceSalesByYear.value).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      this.message('Fails to export reports');
    });
  }

  exportCashSalesTrack(): void {
    const exportedDataCartColumns = ['time', 'amount', 'seller', 'channel', 'items'];
    const data = JSON.parse(JSON.stringify(this.cashSalesTracking.value));
    json2csv('cash_sales_track_report.csv', exportedDataCartColumns,
      data.map(x => {
        // @ts-ignore
        x.items = x.items.map(y => y.product).join('; ');
        return x;
      })).then(_23 => {
      this.message('Report exported');
    }).catch(_ => {
      console.log(_);
      this.message('Fails to export reports');
    });
  }

  fetchCashSalesTrack(date: DateRangeModel): void {
    this.loadCashSalesTracking.next(true);
    this.reportService.getSoldCarts(date.from, date.to).then(value => {
      this.cashSalesTracking.next(value);
    }).catch(reason => {
      this.message(reason ? reason.message : 'Fail to get sold items');
    }).finally(() => {
      this.loadCashSalesTracking.next(false);
    });
  }
}
