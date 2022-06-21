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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthFormComponent,
    RegisterComponent,
    ProjectComponent,
    ProjectDetailComponent,
    ErrorsComponent,
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
