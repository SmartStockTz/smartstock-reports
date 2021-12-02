import {Injectable} from '@angular/core';
import {getDaasAddress, UserService} from '@smartstocktz/core-libs';
import {functions} from 'bfast';
import {CartModel} from '../models/cart.model';
import {InvoiceSalesOverviewModel} from "../models/invoice-sales-overview.model";
import {CashSalesTrackModel} from "../models/cash-sales-track.model";

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  constructor(private readonly userService: UserService) {
  }

  async getSalesOverview(from: Date, to: Date, period: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/overview/cash/' + period
    ).get({params: {from, to}});
  }

  async getProductPerformanceReport(from: string, to: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/performance/product'
    ).get({params: {from, to}});
  }

  async getCategoryPerformanceReport(from: string, to: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/performance/category'
    ).get({params: {from, to}});
  }

  async getSellerPerformanceReport(from: string, to: string): Promise<CartModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/performance/seller'
    ).get({params: {from, to}});
  }

  async getSoldCarts(from: Date, to: Date): Promise<CashSalesTrackModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/track/cash'
    ).get({params: {from, to}});
  }

  async getInvoiceSalesOverview(from: Date, to: Date, period: string): Promise<InvoiceSalesOverviewModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/overview/invoice/' + period
    ).get({params: {from, to}});
  }
}
