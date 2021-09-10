import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService, StorageService} from '@smartstocktz/core-libs';
import {database, functions} from 'bfast';
import {CartModel} from '../models/cart.model';
import {SalesModel} from '../models/sale.model';
import * as moment from 'moment';
import {FaasUtil} from '../utils/faas.util';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly httpClient: HttpClient,
              private readonly storage: StorageService,
              private readonly settings: SettingsService) {
  }

  async getProducts(): Promise<any> {
    return this.storage.getStocks().then(value => {
      if (value === null) {
        return database().table('stocks').getAll().then(data => {
          return this.storage.saveStocks(data as any);
        });
      } else {
        return value;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  async getSalesOverview(from: string, to: string, period: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return functions(activeShop.projectId)
      .request(FaasUtil.functionsUrl(`/reports/sales/overview/${from}/${to}/${period}`, activeShop.projectId))
      .get();
  }

  async getSalesGrowth(from: string, to: string, period: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return functions(activeShop.projectId)
      .request(FaasUtil.functionsUrl(`/reports/sales/growth/${from}/${to}/${period}`, activeShop.projectId))
      .get();
  }

  async getInvoices(from: string, to: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const shop = await this.storage.getActiveShop();
    return await database(shop.projectId)
      .collection('invoices')
      .query()
      .find();
  }

  async getTotalSale(beginDate: any, endDate: any, channel: string): Promise<number> {
    beginDate = moment(beginDate).format('YYYY-MM-DD');
    endDate = moment(endDate).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    const total: number = await database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', endDate)
      .greaterThanOrEqual('date', beginDate)
      .count(true).find();
    let sales: SalesModel[] = await database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', endDate)
      .greaterThanOrEqual('date', beginDate)
      .skip(0)
      .size(total)
      .find<SalesModel[]>({
        returnFields: ['amount', 'batch']
      });

    const duplication: { batch: string, value: any } = {batch: 'a', value: 'a'};

    sales = sales.filter(value => {
      if (duplication[value.batch] === value.batch) {
        return false;
      }
      duplication[value.batch] = value.batch;
      return true;
    });
    return sales.map(value => value.amount).reduce((a, b) => a + b, 0);
  }

  async getProductPerformanceReport(period: string, from: string, to: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return functions(activeShop.projectId).request(
      FaasUtil.functionsUrl(`/reports/sales/performance/${from}/${to}/product/${period}`, activeShop.projectId)
    ).get();
  }

  async getSalesByCategory(period: string, from: string, to: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return functions(activeShop.projectId)
      .request(
        FaasUtil.functionsUrl(`/reports/sales/performance/${from}/${to}/category/${period}`, activeShop.projectId)
      ).get();
  }

  async getStockReorderReportReport(skip = 0, size = 100): Promise<any> {
    // return new Promise<any>(async (resolve, reject) => {
    //   try {
    //     const activeShop = await this.storage.getActiveShop();
    //     this._httpClient.get(this._settings.ssmFunctionsURL +
    //       `/dashboard/stock-reports/stockReorderReport/${activeShop.projectId}`, {
    //       headers: this._settings.ssmFunctionsHeader
    //     }).subscribe(value => {
    //       resolve(value);
    //     }, error => {
    //       reject(error);
    //     });
    //   } catch (e) {
    //     reject(e);
    //   }
    // // });

    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();

    if (!(stocks && Array.isArray(stocks) && stocks.length > 0)) {
      stocks = await database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter(stock => stock.reorder >= stock.quantity);
  }

  async getExpiredProducts(date: any, skip = 0, size = 1000): Promise<any[]> {
    date = moment(date).format('YYYY-MM-DD');
    // endDate = moment(endDate).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return database(activeShop.projectId).collection('stocks')
      .query()
      .lessThanOrEqual('expire', date)
      .skip(skip)
      .size(size)
      .find<any[]>();
  }

  async getProductsAboutToExpire(): Promise<any[]> {
    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();
    const today = moment(new Date()).format('YYYY-MM-DD');
    if (!(stocks && Array.isArray(stocks) && stocks.length > 0)) {
      stocks = await database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter(stock => (stock.expire > today && (stock.expire <= moment(today).add(3, 'M').format('YYYY-MM-DD'))));
  }

  async getSoldCarts(from: string, to: string): Promise<CartModel[]> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    const url = `/reports/sales/order/${from}/${to}/cart/day`;
    const salesTracking: any[] = await functions(activeShop.projectId)
      .request(FaasUtil.functionsUrl(url, activeShop.projectId))
      .get();
    // console.log(salesTracking);
    return salesTracking.map(x => {
      x.businessName = activeShop.businessName;
      return x;
    });
  }

  async getSellerSales(from: string, to: string, period: string): Promise<CartModel[]> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return functions(activeShop.projectId).request(
      FaasUtil.functionsUrl(`/reports/sales/performance/${from}/${to}/seller/${period}`, activeShop.projectId)
    ).get();
  }

  async getStockTracking(stockId: string, from: string, to: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    return functions(activeShop.projectId)
      .request(
        FaasUtil.functionsUrl(`/reports/stocks/tracking/${stockId}/${from}/${to}`, activeShop.projectId)
      ).get();
  }

  async getTotalGrossSale(beginDate: any, endDate: any): Promise<number> {
    beginDate = moment(beginDate).format('YYYY-MM-DD');
    endDate = moment(endDate).format('YYYY-MM-DD');
    const activeShop = await this.storage.getActiveShop();
    const total: number = await database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', endDate)
      .greaterThanOrEqual('date', beginDate)
      .count(true)
      .find();
    let sales = await database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', endDate)
      .greaterThanOrEqual('date', beginDate)
      .skip(0)
      .size(total)
      .find<SalesModel[]>({
        returnFields: ['amount', 'batch', 'quantity', 'stock'],
      });
    const duplication: { batch: string, value: any } = {batch: 'a', value: 'a'};
    sales = sales.filter(value => {
      if (duplication[value.batch] === value.batch) {
        return false;
      }
      duplication[value.batch] = value.batch;
      return true;
    });
    const salesCost = sales.map(value => value.amount).reduce((a, b) => a + b, 0);
    const costOfGoodSold = sales.map(value => (value.quantity * value.stock.purchase)).reduce((a, b) => a + b, 0);
    return salesCost - costOfGoodSold;
  }

  async getStockStatus(): Promise<{ x: string; y: number }[]> {
    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();
    const status: { x: string; y: number }[] = [];
    if (stocks && Array.isArray(stocks) && stocks.length > 0) {
      status.push({x: 'total', y: stocks.length});
      status.push({x: 'out', y: stocks.filter(stock => stock.quantity <= 0).length});
      status.push({x: 'order', y: stocks.filter(stock => stock.quantity <= stock.reorder).length});
    } else {
      stocks = await database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0
      });
      status.push({x: 'total', y: stocks.length});
      status.push({x: 'out', y: stocks.filter(stock => stock.quantity > 0).length});
      status.push({x: 'order', y: stocks.filter(stock => stock.quantity <= stock.reorder).length});
    }
    return status;
  }

  async getStockStatusByCategory(): Promise<{ x: string; y: number }[]> {
    const activeShop = await this.storage.getActiveShop();
    const categories = {};
    let stocks = await this.storage.getStocks();
    const status: { x: string; y: number }[] = [];
    if (stocks && Array.isArray(stocks) && stocks.length > 0) {
      stocks.forEach(stock => categories[stock.category] = stock.category);
      Object.keys(categories).forEach(category => {
        status.push({x: category, y: stocks.filter(stock => stock.category === category).length});
      });
    } else {
      stocks = await database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0
      });
      stocks.forEach(stock => categories[stock.category] = stock.category);
      Object.keys(categories).forEach(category => {
        status.push({x: category, y: stocks.filter(stock => stock.category === category).length});
      });
    }
    return status;
  }

  // async getStockTracking(from: string, to: string, channel: string, skip = 0, size = 100): Promise<CartModel[]> {
  //   // const activeShop = await this.storage.getActiveShop();
  //
  //   return new Promise<any>(async (resolve, reject) => {
  //     try {
  //       const activeShop = await this.storage.getActiveShop();
  //       this.httpClient.get(
  //         `/report/${activeShop.projectId}/${channel}/${from}/${to}`, {}).subscribe(value => {
  //         resolve(value);
  //       }, error => {
  //         reject(error);
  //       });
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }
}
