import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Project, ProjectService } from "../../../service/project.service";
import { Subscription } from "rxjs";
import { Balance, BalanceService } from "../../../service/balance.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CategoryService } from "../../../service/category.service";

export function notZero(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return +control.value === 0 ? { notZero: true } : null;
  };
}

@Component({
  selector: "project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.css"],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  editName: boolean = false;
  project?: Project;

  private subscriptions: Subscription[] = [];

  constructor(public projectService: ProjectService, private categoryService: CategoryService, private balanceService: BalanceService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("projectId");
    this.project = this.projectService.getProject(id);
    if (this.project && this.project.data.archived) {
      await this.router.navigateByUrl("/");
    }
    if (this.project) {
      this.balanceService.setProject(this.project);
      this.categoryService.setProject(this.project);
    }

    this.subscriptions.push(this.projectService.projectsChanged.subscribe(async () => {
      this.project = this.projectService.getProject(id);
      if (!this.project || this.project.data.archived) {
        await this.router.navigateByUrl("/");
        return;
      }
      this.categoryService.setProject(this.project);
      this.balanceService.setProject(this.project);
    }));
  }

  saveProjectName() {
    if (!this.project || this.project.data.name.length < 1 || this.project.data.name.length > 16) {
      return;
    }
    this.projectService.saveProject(this.project);
    this.editName = false;
  }

  async delete() {
    if (this.project) {
      await this.projectService.deleteProject(this.project);
      await this.router.navigateByUrl("/");
    }
  }

  async archive() {
    if (this.project) {
      this.project.data.archived = true;
      await this.projectService.saveProject(this.project);
      await this.router.navigateByUrl("/");
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
