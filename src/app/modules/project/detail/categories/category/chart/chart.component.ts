import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { CategoryView } from "../category.component";
import { BalanceService } from "../../../../../../service/balance.service";
import { Subscription } from "rxjs";

@Component({
  selector: "category-chart",
  templateUrl: "./chart.component.html",
})
export class ChartComponent implements OnDestroy, AfterViewInit {

  @Input() category!: CategoryView;
  private subscriptions: Subscription[] = [];
  private profit: number = 0;
  private spent: number = 0;
  private total: number = 0;
  private chart?: Chart;

  constructor(private balanceService: BalanceService) { Chart.register(...registerables); }

  ngAfterViewInit() {
    this.setCostAndProfit();
    this.subscriptions.push(this.balanceService.balancesChanged.subscribe(() => {
      this.setCostAndProfit();
    }));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private setCostAndProfit() {
    this.profit = 0;
    this.spent = 0;
    this.total = 0;
    for (const balance of this.balanceService.getBalanceOfCategory(this.category)) {
      if (balance.data.amount > 0) {
        this.profit += balance.data.amount;
      } else if (balance.data.amount < 0) {
        this.spent -= balance.data.amount;
      }
      this.total += balance.data.amount;
    }
    this.setChart();
  }

  private setChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = (document.getElementById("chart" + this.category.$id) as HTMLCanvasElement)?.getContext("2d");
    if (!ctx) { return; }
    const cost = this.spent - this.profit > 0 ? this.spent - this.profit : 0;
    const data: ChartData = {
      labels: [
        "Profit",
        "Spent",
        "Cost",
        "Total",
      ],
      datasets: [{
        type: "bar",
        label: "Balance",
        data: [this.profit, this.spent, cost, this.total],
        borderWidth: 2,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
      }, {
        type: "line",
        label: "Budget",
        data: [...this.getBudgetTimes(4)],
        borderWidth: 2,
        pointStyle: "line",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
      }],
    };

    const config: ChartConfiguration = {
      type: "scatter",
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    this.chart = new Chart(ctx, config);
  }

  private getBudgetTimes(times: number): number[] {
    if (!this.category.data.budget) { return []; }
    const budgets: number[] = [];
    for (let index = 0; index < times; index++) {
      budgets.push(this.category.data.budget);
    }
    return budgets;
  }
}
