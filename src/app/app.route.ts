import { RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { LoginComponent } from "./modules/login/login.component";
import { ProjectComponent } from "./modules/project/project.component";
import { ProjectDetailComponent } from "./modules/project/detail/project-detail.component";
import { RegisterComponent } from "./modules/register/register.component";

export const routes: Routes = [
  {
    path: "403",
    redirectTo: "",
  },
  {
    path: "",
    component: ProjectComponent,
  },
  {
    path: "project/:projectId",
    component: ProjectDetailComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
