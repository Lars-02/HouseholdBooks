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

interface BalanceView extends Balance {
  dateString?: string;
  editDate: boolean;
}

@Component({
  selector: "project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.css"],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  get label() { return this.createForm?.get("label"); }

  get amount() { return this.createForm?.get("amount"); }

  get formattedDate() { return dayjs(this.date).format("MMMM YYYY"); };

  editName: boolean = false;
  balances: BalanceView[] = [];
  project?: Project;
  createForm!: FormGroup;
  dateForm!: FormGroup;

  private date: Dayjs = dayjs();
  private subscriptions: Subscription[] = [];

  constructor(public projectService: ProjectService, private balanceService: BalanceService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("projectId");
    this.project = this.projectService.getProject(id);
    if (this.project && this.project.data.archived) {
      await this.router.navigateByUrl("/");
    }
    if (this.project) {
      this.balanceService.setProject(this.project);
    }

    this.createForm = new FormGroup({
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

    this.subscriptions.push(this.balanceService.balancesChanged.subscribe(async () => {
      await this.setBalances();
    }));
  }

  private async setBalances() {
    this.balances = this.balanceService.balances.filter(balance => {
      const date = dayjs(balance.data.date);
      return date.month() === this.date.month() && date.year() === this.date.year();
    }).map(balance => {
      return { ...balance, editDate: false };
    });
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
    this.createForm.reset();
  }

  async balanceChange(balance: Balance) {
    await this.balanceService.saveBalance(balance);
  }

  setDate(balance: BalanceView) {
    if (!balance.$id || !balance.dateString) { return; }
    const date = dayjs(balance.dateString);
    if (!date.isValid()) { return; }
    balance.data.date = date.valueOf();
    this.balanceService.saveBalance(balance);
  }

  changeMonth(by: number) {
    this.date = dayjs(this.date).add(by, "months");
    this.setBalances();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  deleteBalance(balance: Balance) {
    this.balanceService.deleteBalance(balance);
  }
}
