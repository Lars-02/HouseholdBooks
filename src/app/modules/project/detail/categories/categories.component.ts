import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { notZero } from "../project-detail.component";
import { Subscription } from "rxjs";
import { CategoryService } from "../../../../service/category.service";
import { CategoryView } from "../category/category.component";
import * as dayjs from "dayjs";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit, OnDestroy {

  createCategoryForm!: FormGroup;
  categories: CategoryView[] = [];

  get categoryLabel() { return this.createCategoryForm?.get("label"); }

  get categoryBudget() { return this.createCategoryForm?.get("budget"); }

  get categoryEndDate() { return this.createCategoryForm?.get("endDate"); }

  private subscriptions: Subscription[] = [];

  constructor(private categoryService: CategoryService) { }

  async ngOnInit() {
    this.createCategoryForm = new FormGroup({
      label: new FormControl(this.categoryLabel, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ]),
      budget: new FormControl(this.categoryBudget, [
        notZero(),
        Validators.required,
        Validators.min(-10000),
        Validators.max(10000),
        Validators.minLength(1),
        Validators.maxLength(7),
      ]),
      endDate: new FormControl(this.categoryEndDate, []),
    });

    this.subscriptions.push(this.categoryService.categoriesChanged.subscribe(async () => {
      this.setCategories();
    }));
  }

  private setCategories() {
    this.categories = this.categoryService.categories.map(category => {
      return { ...category, edit: false };
    });
  }

  async createCategory() {
    if (!this.categoryLabel || !this.categoryBudget || !this.categoryEndDate) { return;}
    const date = dayjs(this.categoryEndDate.value);
    await this.categoryService.saveCategory({
      data: {
        label: this.categoryLabel.value,
        budget: this.categoryBudget.value,
        endDate: date.isValid() ? date.valueOf() : null,
      },
    });
    this.createCategoryForm.reset();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
