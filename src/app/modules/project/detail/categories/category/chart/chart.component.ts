import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { CategoryView } from "../category.component";
import { BalanceService } from "../../../../../../service/balance.service";
import { Subscription } from "rxjs";

@Component({
  selector: "category-chart",
  templateUrl: "./chart.component.html",
})
export class ChartComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() category!: CategoryView;
  private subscriptions: Subscription[] = [];
  private profit: number = 0;
  private cost: number = 0;

  constructor(private balanceService: BalanceService) { Chart.register(...registerables); }

  ngOnInit() {
    this.subscriptions.push(this.balanceService.balancesChanged.subscribe(() => {

    }));
  }

  ngAfterViewInit() {
    this.setCostAndProfit();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private setCostAndProfit() {
    this.profit = 0;
    this.cost = 0;
    for (const balance of this.balanceService.getBalanceOfCategory(this.category)) {
      if (balance.data.amount > 0) {
        this.profit += balance.data.amount;
      } else if (balance.data.amount < 0) {
        this.cost -= balance.data.amount;
      }
    }
    this.setChart();
  }

  private setChart() {
    const ctx = (document.getElementById("chart" + this.category.$id) as HTMLCanvasElement)?.getContext("2d");
    if (!ctx) { return; }
    const data: ChartData = {
      labels: [
        "Profit",
        "Cost",
      ],
      datasets: [{
        type: "bar",
        label: "Balance",
        data: [this.profit, this.cost],
        borderWidth: 2,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
      }, {
        type: "line",
        label: "Budget",
        data: [this.category.data.budget, this.category.data.budget],
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
    new Chart(ctx, config);
  }

}
