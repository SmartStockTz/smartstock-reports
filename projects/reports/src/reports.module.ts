import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

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
import {MatNativeDateModule, MatOptionModule, MatRippleModule} from '@angular/material/core';
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
import {SalesOverviewPage} from './pages/sales-overview.page';
import {PerformanceReportPageComponent} from './pages/performance-report.page';
import {ProfitCategoryPageComponent} from './pages/profit-category.page';
import {ExpiredReportPageComponent} from './pages/expired-report.page';
import {CartReportPageComponent} from './pages/cart-report.page';
import {NearToExpireReportPageComponent} from './pages/near-to-expire-report.page';
import {SalesOverviewComponent} from './components/sales-overview.component';
import {StockTrackingPage} from './pages/stock-tracking.page';
import {SalesByCategoryComponent} from './components/sales-by-category.component';
import {TotalSalesComponent} from './components/total-sales.component';
import {SalesGrowthComponent} from './components/sales-growth.component';
import {SalesPerformanceComponent} from './components/sales-performance.component';
import {StockTrackingComponent} from './components/stock-tracking.component';
import {ProfitComponent} from './components/profit.component';
import {CartDetailsComponent} from './components/cart-details.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {SalesGrowthPageComponent} from './pages/sales-growth.page';
import {SalesOrderPageComponent} from './pages/sales-order.page';
import {SalesPerformancePageComponent} from './pages/sales-performance.page';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {PeriodDateRangeComponent} from './components/period-date-range.component';
import { SalesReceiptOverviewComponent } from './components/sales-receipt-overview.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {InvoicesPage} from './pages/invoices.page';
import {InvoicesComponent} from './components/invoices.component';


const routes: Routes = [
  // {path: 'sales', component: SalesPageComponent},
  // {path: 'stock', component: StockPageComponent},
  {path: '', component: IndexPage},
  {path: 'stock/overview', component: StockPageComponent},
  {path: 'sales/overview', component: SalesOverviewPage},
  {path: 'sales/tracking', component: SalesOrderPageComponent},
  {path: 'stock/tracking', component: StockTrackingPage},
  {path: 'sales/growth', component: SalesGrowthPageComponent},
  {path: 'sales/performance', component: SalesPerformancePageComponent},
  {path: 'stock/invoices', component: InvoicesPage},
];

@NgModule({
  declarations: [
    StockTrackingPage,
    StockTrackingComponent,
    ExpiredComponent,
    ReorderComponent,
    ExpireNearComponent,
    CartComponent,
    ProfitByCategoryComponent,
    SalesOverviewComponent,
    ProductPerformanceComponent,
    CartReportPageComponent,
    ExpiredReportPageComponent,
    IndexPage,
    NearToExpireReportPageComponent,
    PerformanceReportPageComponent,
    ProfitCategoryPageComponent,
    ReorderReportPageComponent,
    SalesPageComponent,
    SalesOverviewPage,
    StockPageComponent,
    SalesByCategoryComponent,
    TotalSalesComponent,
    SalesGrowthComponent,
    SalesPerformanceComponent,
    ProfitComponent,
    CartDetailsComponent,
    SalesOrderPageComponent,
    SalesPerformancePageComponent,
    SalesGrowthPageComponent,
    PeriodDateRangeComponent,
    SalesReceiptOverviewComponent,
    InvoicesPage,
    InvoicesComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    {
      ngModule: RouterModule,
      providers: [
        {
          multi: true,
          provide: ROUTES,
          useValue: routes
        },
        DatePipe
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
    LibModule,
    MatBottomSheetModule,
    MatListModule,
    MatMomentDateModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
  entryComponents: [CartDetailsComponent],
})
export class ReportsModule {
}
