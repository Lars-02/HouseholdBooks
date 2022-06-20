import { Component } from "@angular/core";
import { DatabaseService } from "./service/database.service";
import { AuthService } from "./service/auth.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {

  constructor(private db: DatabaseService, public auth: AuthService, private router: Router) {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user && (router.url === '/login' || router.url === '/register')) {
        await this.router.navigateByUrl("/");
      } else if (!user) {
        await this.router.navigateByUrl("/login");
      }
    });
  }
}
