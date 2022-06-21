import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        await this.router.navigateByUrl("/");
      }
    });
  }
}
