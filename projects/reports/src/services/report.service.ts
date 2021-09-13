import {Injectable} from '@angular/core';
import {IpfsService, UserService} from '@smartstocktz/core-libs';
import {database} from 'bfast';
import {CartModel} from '../models/cart.model';
import * as moment from 'moment';
import {SalesModel} from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly userService: UserService) {
  }

  async getSalesOverview(from: string, to: string, period: string): Promise<any> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    switch (period) {
      case 'day':
        return this.salesReportOverviewByDay(from, to);
      case 'month':
        return this.salesReportOverviewByMonth(from, to);
      case 'year':
        return this.salesReportOverviewByYear(from, to);
      default:
        return this.salesReportOverviewByDay(from, to);
    }
  }

  // async getSalesGrowth(from: string, to: string, period: string): Promise<any> {
  //   from = moment(from).format('YYYY-MM-DD');
  //   to = moment(to).format('YYYY-MM-DD');
  //   const activeShop = await this.userService.getCurrentShop();
  //   return functions(activeShop.projectId)
  //     .request(FaasUtil.functionsUrl(`/reports/sales/growth/${from}/${to}/${period}`, activeShop.projectId))
  //     .get();
  // }

  async getProductPerformanceReport(period: string, from: string, to: string): Promise<any> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales.reduce((a, b) => {
      a[b.batch] = {
        _id: b.batch,
        product: b.product,
        channel: b.channel,
        quantity: b.quantity,
        stock: b.stock,
        amount: b.amount,
        date: b.date,
      };
      return a;
    }, {});
    const groupByDate = Object.values(salesWithNoDup).reduce((a, b) => {
      a[b.product] = {
        id: b.product,
        quantitySold: !isNaN(a[b.product]?.quantity)
          ? (a[b.product].quantity + b.quantity)
          : b.quantity,
        sales: !isNaN(a[b.product]?.amount)
          ? (a[b.product].amount + b.amount)
          : b.amount,
        purchase: !isNaN(a[b.product]?.purchase)
          ? (a[b.product].purchase + b.stock.purchase)
          : b.stock.purchase
      };
      return a;
    }, {});
    const r2 = Object.values(groupByDate).map((x: any) => {
      x.costOfGoodsSold = x.purchase * x.quantitySold;
      x.grossProfit = x.sales - x.costOfGoodsSold;
      return x;
    });
    r2.sort((a, b) => {
      if (a.quantitySold > b.quantitySold) {
        return -1;
      }
      if (a.quantitySold < b.quantitySold) {
        return 1;
      }
      return 0;
    });
    return r2;
  }

  async getCategoryPerformanceReport(period: string, from: string, to: string): Promise<any> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales.reduce((a, b) => {
      a[b.batch] = {
        id: b.batch,
        quantity: b.quantity,
        category: b.stock.category,
        amount: b.amount,
        date: b.date,
      };
      return a;
    }, {});
    const groupByCategory = Object.values(salesWithNoDup).reduce((a: any, b: any) => {
      a[b.category] = {
        id: b.category,
        date: b.date,
        category: b.category,
        amount: !isNaN(a[b.category]?.amount) ? (a[b.category].amount + b.amount) : b.amount,
        quantity: !isNaN(a[b.category]?.quantity) ? (a[b.category].quantity + b.quantity) : b.quantity
      };
      return a;
    }, {});
    const r = Object.values(groupByCategory);
    r.sort((a: any, b: any) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });
    return r;
  }

  async getSellerPerformanceReport(from: string, to: string, _: string): Promise<CartModel[]> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales.reduce((a, b) => {
      a[b.batch] = {
        id: b.batch,
        quantity: b.quantity,
        category: b.stock.category,
        amount: b.amount,
        date: b.date,
        sellerId: b.sellerId,
        user: b.user,
        sellerObject: b.sellerObject
      };
      return a;
    }, {});
    const groupBySeller = Object.values(salesWithNoDup).reduce((a, b) => {
      const id = b.sellerId ? b.sellerId : b.user;
      a[id] = {
        id,
        date: b.date,
        sellerFirstname: b.sellerObject?.firstname,
        sellerLastname: b.sellerObject?.lastname,
        amount: !isNaN(a[id]?.amount) ? (a[id].amount + b.amount) : b.amount,
        quantity: !isNaN(a[id]?.quantity) ? (a[id].quantity + b.quantity) : b.quantity
      };
      return a;
    }, {});
    const r: any[] = Object.values(groupBySeller);
    r.sort((a: any, b: any) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });
    return r;
  }

  async getSoldCarts(from: string, to: string): Promise<CartModel[]> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales
      .filter(x => !!x.cartId)
      .reduce((a, b) => {
        a[b.batch] = {
          _id: b.batch,
          cartId: b.cartId,
          seller: b.sellerObject,
          customer: b.customer,
          time: b.time ? b.time : b.timer,
          timer: b.timer,
          stock: b.stock,
          channel: b.channel,
          quantity: b.quantity,
          amount: b.amount,
          date: b.date,
        };
        return a;
      }, {});
    const groupByDate = Object
      .values(salesWithNoDup)
      .reduce((a, b: SalesModel) => {
        a[b.cartId] = {
          id: b.cartId,
          quantity: !isNaN(a[b.cartId]?.quantity)
            ? (a[b.cartId].quantity + b.quantity)
            : b.quantity,
          seller: b.seller?.username,
          date: b.date,
          time: b.time,
          timer: b.timer,
          customer: b.customer,
          amount: isNaN(a[b?.cartId]?.amount) ? b.amount : a[b.cartId].amount + b.amount,
          channel: b.channel,
          items: a[b.cartId]?.items
            ? [...a[b.cartId].items, {
              product: b.stock?.product,
              description: b.stock?.description,
              purchase: b.stock?.purchase,
              retailPrice: b.stock?.retailPrice,
              wholesalePrice: b.stock?.wholesalePrice,
              quantity: b.quantity,
              amount: b.amount,
              id: b.stock?.id,
            }]
            : [{
              product: b.stock?.product,
              description: b.stock?.description,
              purchase: b.stock?.purchase,
              retailPrice: b.stock?.retailPrice,
              wholesalePrice: b.stock?.wholesalePrice,
              quantity: b.quantity,
              amount: b.amount,
              id: b.stock?.id,
            }]
        };
        return a;
      }, {});
    const r2: any[] = Object.values(groupByDate);
    r2.sort((a, b) => {
      if (a.timer > b.timer) {
        return -1;
      }
      if (a.timer < b.timer) {
        return 1;
      }
      return 0;
    });
    return r2;
  }

  private async salesReportOverviewByYear(from, to): Promise<any[]> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales.reduce((a, b) => {
      a[b.batch] = {
        _id: b.batch,
        product: b.product,
        channel: b.channel,
        quantity: b.quantity,
        stock: b.stock,
        amount: b.amount,
        date: b.date,
      };
      return a;
    }, {});
    const groupByDate = Object.values(salesWithNoDup)
      .map((x: SalesModel) => {
        x.date = moment(x.date).format('YYYY');
        return x;
      })
      .reduce((a, b) => {
        a[b.date] = {
          id: b.date,
          date: b.date,
          amount: !isNaN(a[b.date]?.amount) ? (a[b.date].amount + b.amount) : b.amount
        };
        return a;
      }, {});
    return Object.values(groupByDate);
  }

  private async salesReportOverviewByMonth(from, to): Promise<any[]> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales.reduce((a, b) => {
      a[b.batch] = {
        _id: b.batch,
        product: b.product,
        channel: b.channel,
        quantity: b.quantity,
        stock: b.stock,
        amount: b.amount,
        date: b.date,
      };
      return a;
    }, {});
    const groupByDate = Object.values(salesWithNoDup)
      .map((x: SalesModel) => {
        x.date = moment(x.date).format('YYYY/MM');
        return x;
      })
      .reduce((a, b) => {
        a[b.date] = {
          id: b.date,
          date: b.date,
          amount: !isNaN(a[b.date]?.amount) ? (a[b.date].amount + b.amount) : b.amount
        };
        return a;
      }, {});
    return Object.values(groupByDate);
  }

  protected validateDates(from, to): any {
    if (!from || from.toString() === '') {
      throw new Error('from query field required');
    }
    if (!to || to.toString() === '') {
      throw new Error('to query field required');
    }
  }

  private async salesReportOverviewByDay(from, to): Promise<any[]> {
    const sales = await this.getSales(from, to);
    const salesWithNoDup = sales.reduce((a, b) => {
      a[b.batch] = {
        _id: b.batch,
        product: b.product,
        channel: b.channel,
        quantity: b.quantity,
        stock: b.stock,
        amount: b.amount,
        date: b.date,
      };
      return a;
    }, {});
    const groupByDate = Object.values(salesWithNoDup).reduce((a, b: SalesModel) => {
      a[b.date] = {
        id: b.date,
        date: b.date,
        amount: !isNaN(a[b.date]?.amount) ? (a[b.date].amount + b.amount) : b.amount
      };
      return a;
    }, {});
    const r = Object.values(groupByDate);
    r.sort((a: SalesModel, b: SalesModel) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });
    return r;
  }

  private async getSales(from, to): Promise<SalesModel[]> {
    from = moment(from).format('YYYY-MM-DD');
    to = moment(to).format('YYYY-MM-DD');
    const activeShop = await this.userService.getCurrentShop();
    this.validateDates(from, to);
    const cids: string[] = await database(activeShop.projectId)
      .table('sales')
      .query()
      .cids(true)
      .raw({
        date: {
          $fn: `return it>='${from}' && it<='${to}';`
        }
      });
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    );
  }
}
