import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {StockPageComponent} from './pages/stock.page';
import {ReorderComponent} from './components/reorder.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {SalesPageComponent} from './pages/sales.page';
import {ExpireNearComponent} from './components/expireNear.component';
import {CartComponent} from './components/cart.component';
import {ExpiredComponent} from './components/expired.component';
import {ProfitByCategoryComponent} from './components/profit-by-category.component';
import {RouterModule, ROUTES, Routes} from '@angular/router';
import {LibModule} from '@smartstocktz/core-libs';
import {ProductPerformanceComponent} from './components/product-performance.component';
import {IndexPage} from './pages/index.page';
import {ReorderReportPageComponent} from './pages/reorder-report.page';
import {SalesReportPageComponent} from './pages/sales-report.page';
import {PerformanceReportPageComponent} from './pages/performance-report.page';
import {ProfitCategoryPageComponent} from './pages/profit-category.page';
import {ExpiredReportPageComponent} from './pages/expired-report.page';
import {CartReportPageComponent} from './pages/cart-report.page';
import {NearToExpireReportPageComponent} from './pages/near-to-expire-report.page';
import {SalesTrendsComponent} from './components/sales-trends.component';


const routes: Routes = [
  {path: 'sales', component: SalesPageComponent},
  {path: 'stock', component: StockPageComponent},
  {path: '', component: IndexPage},
  {path: 'profit-by-category', component: ProfitCategoryPageComponent},
  {path: 'performance-report', component: PerformanceReportPageComponent},
  {path: 'sales-report', component: SalesReportPageComponent},
  {path: 'cart-report', component: CartReportPageComponent},
  {path: 'reorder-report', component: ReorderReportPageComponent},
  {path: 'expired-report', component: ExpiredReportPageComponent},
  {path: 'near-to-expire-report', component: NearToExpireReportPageComponent},
];

@NgModule({
  declarations: [
    ExpiredComponent,
    ReorderComponent,
    ExpireNearComponent,
    CartComponent,
    ProfitByCategoryComponent,
    SalesTrendsComponent,
    ProductPerformanceComponent,

    // reports pages
    CartReportPageComponent,
    ExpiredReportPageComponent,
    IndexPage,
    NearToExpireReportPageComponent,
    PerformanceReportPageComponent,
    ProfitCategoryPageComponent,
    ReorderReportPageComponent,
    SalesPageComponent,
    SalesReportPageComponent,
    StockPageComponent
  ],
  exports: [
    // ExpiredComponent,
    // ReorderComponent,
    // ExpireNearComponent,
    // SalesTrendsComponent,
    // ProductPerformanceComponent,
  ],
  imports: [
    CommonModule,
    {
      ngModule: RouterModule,
      providers: [
        {
          multi: true,
          provide: ROUTES,
          useValue: routes
        }
      ]
    },
    MatDatepickerModule,
    LibModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    LibModule
  ]
})
export class ReportsModule {
}
