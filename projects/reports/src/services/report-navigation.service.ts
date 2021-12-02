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
      pages: [
        {
          link: '/report/sales/overview/cash/day',
          name: 'Days cash sale',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/overview/cash/month',
          name: 'Months cash sales',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/overview/cash/year',
          name: 'Years cash sales',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/overview/invoice/day',
          name: 'Days invoice sale',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/overview/invoice/month',
          name: 'Months invoice sale',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/overview/invoice/year',
          name: 'Years invoice sale',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/track/cash',
          name: 'Cash sales tracking',
          roles: ['manager', 'user', 'admin'],
          click: null
        },
        {
          link: '/report/sales/performance',
          name: 'sales performance',
          roles: ['admin'],
          click: null
        },
      ]
    });
  }

  selected(): void {
    this.configs.selectedModuleName = 'Report';
  }
}
