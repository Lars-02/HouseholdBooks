import { Injectable } from "@angular/core";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Router } from "@angular/router";
import { ProjectService } from "./project.service";
import { BalanceService } from "./balance.service";

export interface FormUser {
  email: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {

  get user() { return getAuth().currentUser;}

  constructor(private router: Router, private project: ProjectService, private balance: BalanceService) { }

  async signIn(user: FormUser) {
    await setPersistence(getAuth(), browserSessionPersistence);
    await signInWithEmailAndPassword(getAuth(), user.email, user.password);
    await this.router.navigateByUrl("/");
  }

  async register(user: FormUser) {
    await setPersistence(getAuth(), browserSessionPersistence);
    await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    await this.router.navigateByUrl("/");
  }

  async logout() {
    await getAuth().signOut();
    await getAuth().updateCurrentUser(null);
    this.project.projects = [];
    this.balance.balances = [];
  }
}
