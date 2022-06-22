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

  get balanceLabel() { return this.createBalanceForm?.get("label"); }

  get balanceAmount() { return this.createBalanceForm?.get("amount"); }

  get formattedDate() { return dayjs(this.balanceService.getMonth).format("MMMM YYYY"); };

  createBalanceForm!: FormGroup;
  dateForm!: FormGroup;

  constructor(public balanceService: BalanceService) { }

  ngOnInit() {
    this.createBalanceForm = new FormGroup({
      label: new FormControl(this.balanceLabel, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]),
      amount: new FormControl(this.balanceAmount, [
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
    if (!this.balanceLabel || !this.balanceAmount || this.balanceAmount.value === 0) { return; }
    await this.balanceService.saveBalance({
      data: {
        label: this.balanceLabel.value,
        amount: this.balanceAmount.value,
        category: null,
        date: Date.now(),
      },
    });
    this.createBalanceForm.reset();
  }
}
