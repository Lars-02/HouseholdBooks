import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Category, CategoryService } from "../../../../../service/category.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { BalanceService } from "../../../../../service/balance.service";

export interface CategoryView extends Category {
  edit: boolean;
}

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {

  @Input() category!: CategoryView;
  @Output() savedNewCategory = new EventEmitter<void>();

  form!: FormGroup;

  get label() { return this.form?.get("label"); }

  get budget() { return this.form?.get("budget"); }

  get endDate() { return this.form?.get("endDate"); }

  constructor(public categoryService: CategoryService, private balanceService: BalanceService) { }

  ngOnInit(): void {
    const endDate = dayjs(this.category.data.endDate).isValid() ? dayjs(this.category.data.endDate).format("YYYY-MM-DD") : null;
    this.form = new FormGroup({
      label: new FormControl(this.category.data.label, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]),
      budget: new FormControl(this.category.data.budget, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
        Validators.minLength(1),
        Validators.maxLength(7),
      ]),
      endDate: new FormControl(endDate, []),
    });
  }

  saveCategory(property: "label" | "budget" | "endDate") {
    const control = this.form.get(property);
    if (!control || !this.category) { return; }
    if (property === "endDate") {
      const date = dayjs(control.value);
      this.category.data.endDate = date.isValid() ? date.valueOf() : null;
    } else {
      this.category.data[property] = control?.value as never;
    }
    if (!this.category.$id || !this.form.valid || !control.valid) { return; }
    this.categoryService.saveCategory(this.category, property);
  }

  saveNewCategory() {
    this.categoryService.saveCategory(this.category);
    this.savedNewCategory.next();
  }

  balanceDropped($event: DragEvent) {
    if (!this.category) { return; }
    const balanceId = $event.dataTransfer?.getData("text");
    if (!balanceId) { return; }
    const balance = this.balanceService.getBalance(balanceId);
    if (!balance) { return; }
    balance.data.category = this.category.$id ?? null;
    this.balanceService.saveBalance(balance);
  }

  dropAllowed($event: DragEvent) {
    if (this.category && this.category.$id) {
      $event.preventDefault();
    }
  }
}
