import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
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
import {CashSalesTrackingComponent} from './components/cash-sales-tracking.component';
import {RouterModule, ROUTES, Routes} from '@angular/router';
import {LibModule} from '@smartstocktz/core-libs';
import {ProductPerformanceComponent} from './components/product-performance.component';
import {IndexPage} from './pages/index.page';
import {CashSalesOverviewDayPage} from './pages/cash-sales-overview-day.page';
import {CashSalesOverviewComponent} from './components/cash-sales-overview.component';
import {CashSalesPerformanceComponent} from './components/cash-sales-performance.component';
import {CartDetailsComponent} from './components/cart-details.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {CashSalesTrackPage} from './pages/cash-sales-track.page';
import {CashSalesPerformanceProductPage} from './pages/cash-sales-performance-product.page';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DateRangeComponent} from './components/date-range.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReportNavigationService} from './services/report-navigation.service';
import {CashSalesOverviewMonthPage} from './pages/cash-sales-overview-month.page';
import {CashSalesOverviewYearPage} from './pages/cash-sales-overview-year.page';
import {InvoiceSalesOverviewComponent} from './components/invoice-sales-overview.component';
import {InvoiceSalesOverviewDayPage} from './pages/invoice-sales-overview-day.page';
import {InvoiceSalesOverviewMonthPage} from './pages/invoice-sales-overview-month.page';
import {InvoiceSalesOverviewYearPage} from './pages/invoice-sales-overview-year.page';
import {CashSalesPerformanceSellerPage} from './pages/cash-sales-performance-seller.page';
import {CashSalesPerformanceCategoryPage} from './pages/cash-sales-performance-category.page';


const routes: Routes = [
  {path: '', component: IndexPage},
  {path: 'sales/overview/cash/day', component: CashSalesOverviewDayPage},
  {path: 'sales/overview/cash/month', component: CashSalesOverviewMonthPage},
  {path: 'sales/overview/cash/year', component: CashSalesOverviewYearPage},
  {path: 'sales/overview/invoice/day', component: InvoiceSalesOverviewDayPage},
  {path: 'sales/overview/invoice/month', component: InvoiceSalesOverviewMonthPage},
  {path: 'sales/overview/invoice/year', component: InvoiceSalesOverviewYearPage},
  {path: 'sales/track/cash', component: CashSalesTrackPage},
  {path: 'sales/performance/product', component: CashSalesPerformanceProductPage},
  {path: 'sales/performance/seller', component: CashSalesPerformanceSellerPage},
  {path: 'sales/performance/category', component: CashSalesPerformanceCategoryPage},
];

@NgModule({
  declarations: [
    CashSalesTrackingComponent,
    CashSalesPerformanceSellerPage,
    CashSalesOverviewMonthPage,
    CashSalesPerformanceCategoryPage,
    CashSalesOverviewComponent,
    ProductPerformanceComponent,
    IndexPage,
    CashSalesOverviewDayPage,
    CashSalesPerformanceComponent,
    CartDetailsComponent,
    CashSalesPerformanceProductPage,
    DateRangeComponent,
    CashSalesOverviewYearPage,
    InvoiceSalesOverviewComponent,
    InvoiceSalesOverviewDayPage,
    InvoiceSalesOverviewMonthPage,
    InvoiceSalesOverviewYearPage,
    CashSalesTrackPage
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
        }
      ]
    },
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
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
})
export class ReportsModule {
  constructor(private readonly reportNav: ReportNavigationService) {
    this.reportNav.init();
    reportNav.selected();
  }
}
