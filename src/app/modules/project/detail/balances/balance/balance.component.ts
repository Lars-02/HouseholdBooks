import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BalanceService, BalanceView } from "../../../../../service/balance.service";
import * as dayjs from "dayjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { notZero } from "../../project-detail.component";
import { CategoryService } from "../../../../../service/category.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-balance",
  templateUrl: "./balance.component.html",
  styleUrls: ["./balance.component.css"],
})
export class BalanceComponent implements OnInit, OnDestroy {

  @Input() balance!: BalanceView;

  categoryName?: string;
  form!: FormGroup;

  get label() { return this.form?.get("label"); }

  get amount() { return this.form?.get("amount"); }

  get date() { return this.form?.get("date"); }

  private subscriptions: Subscription[] = [];

  constructor(public balanceService: BalanceService, private categoryService: CategoryService) { }

  ngOnInit() {
    const date = dayjs(this.balance.data.date).isValid() ? dayjs(this.balance.data.date).format("YYYY-MM-DD") : null;
    this.form = new FormGroup({
      label: new FormControl(this.balance.data.label, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]),
      amount: new FormControl(this.balance.data.amount, [
        notZero(),
        Validators.required,
        Validators.min(-1000),
        Validators.max(1000),
        Validators.minLength(1),
        Validators.maxLength(6),
      ]),
      date: new FormControl(date, []),
    });

    if (this.balance.data.category) {
      this.categoryName = this.categoryService.getCategory(this.balance.data.category)?.data.label;
    }
    this.subscriptions.push(this.categoryService.categoriesChanged.subscribe(() => {
      if (this.balance.data.category) {
        this.categoryName = this.categoryService.getCategory(this.balance.data.category)?.data.label;
      }
    }));
  }

  saveBalance(property: "label" | "amount" | "date") {
    const control = this.form.get(property);
    if (!control || !this.balance) { return; }
    if (property === "date") {
      const date = dayjs(control.value);
      if (!date.isValid()) { return; }
      this.balance.data.date = date.valueOf();
    } else {
      this.balance.data[property] = control?.value as never;
    }
    if (!this.balance.$id || !this.form.valid || !control.valid) { return; }
    this.balanceService.saveBalance(this.balance, property);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  drag($event: DragEvent) {
    if (!this.balance || !this.balance.$id) { return; }
    $event.dataTransfer?.setData("text", this.balance.$id);
  }
}
