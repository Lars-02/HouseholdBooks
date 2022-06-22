import { Component, OnInit } from "@angular/core";
import * as dayjs from "dayjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Balance, BalanceService, BalanceView } from "../../../../service/balance.service";
import { notZero } from "../project-detail.component";

@Component({
  selector: "app-balances",
  templateUrl: "./balances.component.html",
  styleUrls: ["./balances.component.css"],
})
export class BalancesComponent implements OnInit {

  get label() { return this.form?.get("label"); }

  get amount() { return this.form?.get("amount"); }

  get formattedDate() { return dayjs(this.balanceService.getMonth).format("MMMM YYYY"); };

  form!: FormGroup;

  constructor(public balanceService: BalanceService) { }

  ngOnInit() {
    this.form = new FormGroup({
      label: new FormControl(this.label, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]),
      amount: new FormControl(this.amount, [
        notZero(),
        Validators.required,
        Validators.min(-1000),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.maxLength(6),
      ]),
    });
  }

  async createBalance() {
    if (!this.label || !this.amount || this.amount.value === 0) { return; }
    await this.balanceService.saveBalance({
      data: {
        label: this.label.value,
        amount: this.amount.value,
        category: null,
        date: Date.now(),
      },
    });
    this.form.reset();
  }
}
