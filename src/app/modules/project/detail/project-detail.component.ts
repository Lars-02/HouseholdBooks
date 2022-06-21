import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Project, ProjectService } from "../../../service/project.service";
import { Subscription } from "rxjs";
import { Balance, BalanceService } from "../../../service/balance.service";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";

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

  get label() { return this.form?.get("label"); }

  get amount() { return this.form?.get("amount"); }

  get formattedDate() { return dayjs(this.date).format('MMMM YYYY') };

  editName: boolean = false;
  project?: Project;
  form!: FormGroup;

  private date: Dayjs = dayjs();
  private subscriptions: Subscription[] = [];

  constructor(public projectService: ProjectService, public balanceService: BalanceService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("projectId");
    this.project = this.projectService.getProject(id);
    if (this.project && this.project.data.archived) {
      await this.router.navigateByUrl("/");
    }
    if (this.project) {
      this.balanceService.setProject(this.project);
    }

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

    this.subscriptions.push(this.projectService.projectsChanged.subscribe(async () => {
      this.project = this.projectService.getProject(id);
      if (!this.project || this.project.data.archived) {
        await this.router.navigateByUrl("/");
        return;
      }
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

  async createBalance() {
    if (!this.label || !this.amount || this.amount.value === 0) {
      return;
    }
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

  async balanceChange(balance: Balance) {
    await this.balanceService.saveBalance(balance);
  }

  changeMonth(by: number) {
    this.date = dayjs(this.date).add(by, 'months')
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
