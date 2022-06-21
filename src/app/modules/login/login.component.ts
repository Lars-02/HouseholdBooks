import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {

  constructor(public auth: AuthService) {}
}
