import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./service/database.service";
import { AuthService } from "./service/auth.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {

  private routeSubscription?: Subscription;

  constructor(private db: DatabaseService, public auth: AuthService, private router: Router) {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user && (router.url === "/login" || router.url === "/register")) {
        if (this.routeSubscription) {
          this.routeSubscription.unsubscribe();
          this.routeSubscription = undefined;
        }
        await this.router.navigateByUrl("/");
        return;
      }

      if (!user) {
        await this.router.navigateByUrl("/login");
        this.routeSubscription = this.router.events.subscribe(async () => {
          if (!this.auth.user) {
            await this.router.navigateByUrl("/login");
          }
        });
      }
    });
  }
}
