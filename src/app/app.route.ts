import { RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectDetailComponent } from "./project/detail/project-detail.component";

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
