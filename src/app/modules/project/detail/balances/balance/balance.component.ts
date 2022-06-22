import { Component, Input, OnInit } from "@angular/core";
import { Balance, BalanceService, BalanceView } from "../../../../../service/balance.service";
import * as dayjs from "dayjs";

@Component({
  selector: "app-balance",
  templateUrl: "./balance.component.html",
  styleUrls: ["./balance.component.css"],
})
export class BalanceComponent implements OnInit {

  @Input() balance!: BalanceView;

  constructor(public balanceService: BalanceService) { }

  ngOnInit() {
  }

  setDate() {
    if (!this.balance.$id || !this.balance.dateString) { return; }
    const date = dayjs(this.balance.dateString);
    if (!date.isValid()) { return; }
    this.balance.data.date = date.valueOf();
    this.balanceService.saveBalance(this.balance);
  }
}
