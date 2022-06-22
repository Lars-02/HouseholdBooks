import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./modules/login/login.component";
import { routing } from "./app.route";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthFormComponent } from "./modules/auth-form/auth-form.component";
import { ProjectComponent } from "./modules/project/project.component";
import { AuthService } from "./service/auth.service";
import { DatabaseService } from "./service/database.service";
import { ProjectDetailComponent } from './modules/project/detail/project-detail.component';
import { ErrorsComponent } from './modules/components/errors/errors.component';
import { RegisterComponent } from "./modules/register/register.component";
import { CategoryComponent } from './modules/project/detail/categories/category/category.component';
import { CategoriesComponent } from './modules/project/detail/categories/categories.component';
import { ChartComponent } from './modules/project/detail/categories/category/chart/chart.component';
import { BalancesComponent } from './modules/project/detail/balances/balances.component';
import { BalanceComponent } from './modules/project/detail/balances/balance/balance.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthFormComponent,
    RegisterComponent,
    ProjectComponent,
    ProjectDetailComponent,
    ErrorsComponent,
    CategoryComponent,
    CategoriesComponent,
    ChartComponent,
    BalancesComponent,
    BalanceComponent,
  ],
  exports: [
    AuthFormComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [AuthService, DatabaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
