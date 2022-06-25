import { Injectable } from "@angular/core";
import { getDaasAddress, UserService } from "smartstock-core";
import { functions } from "bfast";
import { CartModel } from "../models/cart.model";
import { InvoiceSalesOverviewModel } from "../models/invoice-sales-overview.model";
import { CashSalesTrackModel } from "../models/cash-sales-track.model";
import { CashSalesPerformanceProductModel } from "../models/cash-sales-performance-product.model";
import { CashSalesPerformanceSellerModel } from "../models/cash-sales-performance-seller.model";
import { CashSalesPerformanceCategoryModel } from "../models/cash-sales-performance-category.model";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(private readonly userService: UserService) {}

  async getSalesOverview(from: Date, to: Date, period: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId)
      .request(getDaasAddress(shop) + "/report/sales/overview/cash/" + period)
      .get({ params: { from, to } });
  }

  async getProductPerformanceReport(
    from: Date,
    to: Date
  ): Promise<CashSalesPerformanceProductModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId)
      .request(getDaasAddress(shop) + "/report/sales/performance/product")
      .get({ params: { from, to } });
  }

  async getCategoryPerformanceReport(
    from: Date,
    to: Date
  ): Promise<CashSalesPerformanceCategoryModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId)
      .request(getDaasAddress(shop) + "/report/sales/performance/category")
      .get({ params: { from, to } });
  }

  async getSellerPerformanceReport(
    from: Date,
    to: Date
  ): Promise<CashSalesPerformanceSellerModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId)
      .request(getDaasAddress(shop) + "/report/sales/performance/seller")
      .get({ params: { from, to } });
  }

  async getSoldCarts(from: Date, to: Date): Promise<CashSalesTrackModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId)
      .request(getDaasAddress(shop) + "/report/sales/track/cash")
      .get({ params: { from, to } });
  }

  async getInvoiceSalesOverview(
    from: Date,
    to: Date,
    period: string
  ): Promise<InvoiceSalesOverviewModel[]> {
    const shop = await this.userService.getCurrentShop();
    return functions(shop.projectId)
      .request(
        getDaasAddress(shop) + "/report/sales/overview/invoice/" + period
      )
      .get({ params: { from, to } });
  }
}
