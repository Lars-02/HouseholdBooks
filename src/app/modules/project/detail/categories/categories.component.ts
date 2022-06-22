import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CategoryService } from "../../../../service/category.service";
import { CategoryView } from "./category/category.component";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: CategoryView[] = [];
  newCategory?: CategoryView;

  private subscriptions: Subscription[] = [];

  constructor(private categoryService: CategoryService) { }

  async ngOnInit() {
    this.setCategories();
    this.subscriptions.push(this.categoryService.categoriesChanged.subscribe(async () => {
      this.setCategories();
    }));
  }

  private setCategories() {
    this.categories = this.categoryService.categories
      .map(newCategory => {
        return {
          ...newCategory, edit: this.categories.some(category => {
            return category.$id === newCategory.$id && category.edit;
          }),
        };
      });
  }

  createCategory() {
    this.newCategory = {
      data: {
        label: "",
        budget: null,
        endDate: null,
      },
      edit: true,
    };
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
