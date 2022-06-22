import { Component, Input, OnInit } from "@angular/core";
import { Category } from "../../../../service/category.service";

export interface CategoryView extends Category {
  edit: boolean;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() category!: CategoryView

  constructor() { }

  ngOnInit(): void {
  }

}
