import {Injectable} from '@angular/core';
import {NavigationService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})

export class ReportNavigationService {
  constructor(private readonly configs: NavigationService) {
  }

  init(): void {
    this.configs.addMenu({
      name: 'Report',
      link: '/report',
      roles: ['admin'],
      icon: 'table_chart',
      pages: this.getPages()
    });
  }

  getPages(): { link: string, icon?: string, detail?: string,
    name: string, roles: string[], click: () => void }[] {
    return [
      {
        link: '/report/sales/overview/cash/day',
        name: 'Days cash sale',
        icon: 'score',
        detail: 'daily cash sales report',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/overview/cash/month',
        name: 'Months cash sales',
        icon: 'score',
        detail: 'monthly cash sales report',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/overview/cash/year',
        name: 'Years cash sales',
        icon: 'score',
        detail: 'cash sales report by year',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/overview/invoice/day',
        name: 'Days invoice sale',
        icon: 'waterfall_chart',
        detail: 'daily invoice sales report',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/overview/invoice/month',
        name: 'Months invoice sale',
        icon: 'waterfall_chart',
        detail: 'monthly invoice sales report',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/overview/invoice/year',
        name: 'Years invoice sale',
        icon: 'waterfall_chart',
        detail: 'invoice sales report by year',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/track/cash',
        name: 'Cash sales tracking',
        icon: 'stream',
        detail: 'Live track of cash sales',
        roles: ['manager', 'user', 'admin'],
        click: null
      },
      {
        link: '/report/sales/performance/product',
        icon: 'insights',
        detail: 'See which product give you profit',
        name: 'P. Performance',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/performance/seller',
        name: 'S. Performance',
        icon: 'insights',
        detail: 'View your shop seller sales',
        roles: ['admin'],
        click: null
      },
      {
        link: '/report/sales/performance/category',
        name: 'C. Performance',
        icon: 'insights',
        detail: 'See which category lead in sales',
        roles: ['admin'],
        click: null
      },
    ];
  }

  selected(): void {
    this.configs.selectedModuleName = 'Report';
  }
}
