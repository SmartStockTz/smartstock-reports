import {Injectable} from '@angular/core';
import {ConfigsService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})

export class ReportNavigationService {
  constructor(private readonly configs: ConfigsService) {
  }

  init(): void {
    this.configs.addMenu({
      name: 'Report',
      link: '/report',
      roles: ['admin'],
      icon: 'table_chart',
      pages: [
        {
          link: '/report/sales/overview',
          name: 'sales overviews',
          roles: ['admin'],
          click: null
        },
        {
          link: '/report/sales/tracking',
          name: 'sales tracking',
          roles: ['*'],
          click: null
        },
        // {
        //   link: '/report/sales/growth',
        //   name: 'sales growth',
        //   roles: ['admin']
        // },
        {
          link: '/report/sales/performance',
          name: 'sales performance',
          roles: ['admin'],
          click: null
        },
        // {
        //   name: 'invoices',
        //   link: '/report/stock/invoices',
        //   roles: ['admin']
        // },
        // {
        //   link: '/report/stock/overview',
        //   name: 'stocks overviews',
        //   roles: ['admin']
        // },
        // {
        //   name: 'stock tracking',
        //   link: '/report/stock/tracking',
        //   roles: ['admin']
        // }
      ]
    });
  }

  selected(): void {
    this.configs.selectedModuleName = 'Report';
  }
}
