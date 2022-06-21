import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService, FormUser } from "../../service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "auth-form",
  templateUrl: "./auth-form.component.html",
  styleUrls: ["./auth-form.component.css"],
})
export class AuthFormComponent implements OnInit {

  @Input() submit?: (user: FormUser) => Promise<void>;

  form!: FormGroup;

  constructor(private auth: AuthService, private router: Router) { }

  get email() { return this.form?.get("email"); }

  get password() { return this.form?.get("password"); }

  async ngOnInit(): Promise<void> {
    if (this.auth.user) {
      await this.router.navigateByUrl('/')
    }

    this.form = new FormGroup({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
      ]),
    });
  }
}
