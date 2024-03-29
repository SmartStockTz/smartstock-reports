import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { WelcomePage } from "./pages/welcome.page";
import { LoginPageComponent } from "./pages/login.page";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { init } from "bfast";
import { AuthGuard } from "./guards/auth.guard";
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { IpfsService, NavigationService } from "smartstock-core";
import { DatePipe } from "@angular/common";

const routes: Routes = [
  { path: "", component: WelcomePage },
  { path: "login", component: LoginPageComponent },
  {
    path: "report",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../../../reports/src/public-api").then((mod) => mod.ReportsModule)
  }
];

@NgModule({
  declarations: [AppComponent, WelcomePage, LoginPageComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
    BrowserAnimationsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly configs: NavigationService) {
    IpfsService.getVersion().then((value) => {
      console.log("ipfs version : ", value.version);
    });
    init({
      applicationId: "smartstock_lb",
      projectId: "smartstock",
      appPassword: "ZMUGVn72o3yd8kSbMGhfWpI80N9nA2IHjxWKlAhG"
    });

    // this.configs.menu = [
    //   {
    //     name: 'Report',
    //     link: '/report',
    //     roles: ['admin'],
    //     icon: 'table_chart',
    //     pages: [
    //       {
    //         link: '/report/sales/overview',
    //         name: 'sales overviews',
    //         roles: ['*']
    //       },
    //       {
    //         link: '/report/sales/tracking',
    //         name: 'sales tracking',
    //         roles: ['*']
    //       },
    //       {
    //         link: '/report/sales/growth',
    //         name: 'sales growth',
    //         roles: ['*']
    //       },
    //       {
    //         link: '/report/sales/performance',
    //         name: 'sales performance',
    //         roles: ['*']
    //       },ƒ
    //       {
    //         link: '/report/stock/overview',
    //         name: 'stocks overviews',
    //         roles: ['*']
    //       }
    //     ]
    //   }
    // ];
  }
}
