import {Injectable} from '@angular/core';
import {getDaasAddress, UserService} from '@smartstocktz/core-libs';
import {functions} from 'bfast';
import {CartModel} from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  constructor(private readonly userService: UserService) {
  }

  async getSalesOverview(from: string, to: string, period: string): Promise<any> {
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

  async getSoldCarts(from: string, to: string): Promise<CartModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId).request(
      getDaasAddress(shop) + '/report/sales/track/cash'
    ).get({params: {from, to}});
  }
}
