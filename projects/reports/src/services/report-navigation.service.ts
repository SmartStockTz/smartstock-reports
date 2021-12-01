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
