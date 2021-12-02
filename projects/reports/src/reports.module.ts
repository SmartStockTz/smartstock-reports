import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {StockPageComponent} from './pages/stock.page';
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
import {CashSalesTrackingComponent} from './components/cash-sales-tracking.component';
import {ProfitByCategoryComponent} from './components/profit-by-category.component';
import {RouterModule, ROUTES, Routes} from '@angular/router';
import {LibModule} from '@smartstocktz/core-libs';
import {ProductPerformanceComponent} from './components/product-performance.component';
import {IndexPage} from './pages/index.page';
import {CashSalesOverviewDayPage} from './pages/cash-sales-overview-day.page';
import {PerformanceReportPageComponent} from './pages/performance-report.page';
import {ProfitCategoryPageComponent} from './pages/profit-category.page';
import {CartReportPageComponent} from './pages/cart-report.page';
import {CashSalesOverviewComponent} from './components/cash-sales-overview.component';
import {SalesByCategoryComponent} from './components/sales-by-category.component';
import {TotalSalesComponent} from './components/total-sales.component';
import {SalesPerformanceComponent} from './components/sales-performance.component';
import {CartDetailsComponent} from './components/cart-details.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {SalesGrowthPageComponent} from './pages/sales-growth.page';
import {CashSalesTrackPage} from './pages/cash-sales-track.page';
import {SalesPerformancePageComponent} from './pages/sales-performance.page';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DateRangeComponent} from './components/date-range.component';
import {SalesReceiptOverviewComponent} from './components/sales-receipt-overview.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {InvoiceDetailsComponent} from './components/invoice-details.component';
import {ReportNavigationService} from './services/report-navigation.service';
import {CashSalesOverviewMonthPage} from './pages/cash-sales-overview-month.page';
import {CashSalesOverviewYearPage} from './pages/cash-sales-overview-year.page';
import {InvoiceSalesOverviewComponent} from './components/invoice-sales-overview.component';
import {InvoiceSalesOverviewDayPage} from './pages/invoice-sales-overview-day.page';
import {InvoiceSalesOverviewMonthPage} from './pages/invoice-sales-overview-month.page';
import {InvoiceSalesOverviewYearPage} from './pages/invoice-sales-overview-year.page';


const routes: Routes = [
  {path: '', component: IndexPage},
  {path: 'sales/overview/cash/day', component: CashSalesOverviewDayPage},
  {path: 'sales/overview/cash/month', component: CashSalesOverviewMonthPage},
  {path: 'sales/overview/cash/year', component: CashSalesOverviewYearPage},
  {path: 'sales/overview/invoice/day', component: InvoiceSalesOverviewDayPage},
  {path: 'sales/overview/invoice/month', component: InvoiceSalesOverviewMonthPage},
  {path: 'sales/overview/invoice/year', component: InvoiceSalesOverviewYearPage},
  {path: 'sales/track/cash', component: CashSalesTrackPage},
  {path: 'sales/performance', component: SalesPerformancePageComponent},
];

@NgModule({
  declarations: [
    CashSalesTrackingComponent,
    CashSalesOverviewMonthPage,
    ProfitByCategoryComponent,
    CashSalesOverviewComponent,
    ProductPerformanceComponent,
    CartReportPageComponent,
    IndexPage,
    PerformanceReportPageComponent,
    ProfitCategoryPageComponent,
    SalesPageComponent,
    CashSalesOverviewDayPage,
    StockPageComponent,
    SalesByCategoryComponent,
    TotalSalesComponent,
    SalesPerformanceComponent,
    CartDetailsComponent,
    SalesPerformancePageComponent,
    SalesGrowthPageComponent,
    DateRangeComponent,
    SalesReceiptOverviewComponent,
    InvoiceDetailsComponent,
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
