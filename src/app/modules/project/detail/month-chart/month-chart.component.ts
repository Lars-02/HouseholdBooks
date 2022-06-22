import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { BalanceService } from "../../../../service/balance.service";
import * as dayjs from "dayjs";

@Component({
  selector: "app-month-chart",
  templateUrl: "./month-chart.component.html",
})
export class MonthChartComponent implements OnDestroy, AfterViewInit {

  private subscriptions: Subscription[] = [];
  private chart?: Chart;

  constructor(private balanceService: BalanceService) { Chart.register(...registerables); }

  ngAfterViewInit() {
    this.setChart();
    this.subscriptions.push(this.balanceService.balancesChanged.subscribe(() => {
      this.setChart();
    }));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private setChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = (document.getElementById("month-chart") as HTMLCanvasElement)?.getContext("2d");
    if (!ctx) { return; }
    const data: ChartData = {
      labels: this.getForEachDay((day) => day),
      datasets: [
        {
          label: "Profit",
          data: this.getForEachDayBalance((data, amount) => data + amount, amount => amount > 0),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192)",
          tension: 0,
        },
        {
          label: "Spent",
          data: this.getForEachDayBalance((data, amount) => data - amount, amount => amount < 0),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132)",
          tension: 0,
        },
        {
          label: "Cost",
          data: this.getForEachDay((day) => {
            const spent = this.getForEachDayBalance((data, amount) => data - amount, amount => amount < 0);
            const profit = this.getForEachDayBalance((data, amount) => data + amount, amount => amount > 0);
            return spent[day - 1] - profit[day - 1] > 0 ? spent[day - 1] - profit[day - 1] : 0;
          }),
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86)",
          tension: 0,
        },
        {
          label: "Total",
          data: this.getForEachDayBalance((data, amount) => data + amount, () => true),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255)",
          tension: 0,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: "line",
      data: data,
    };
    this.chart = new Chart(ctx, config);
  }

  private getForEachDay(add: (day: number) => number): number[] {
    const days: number[] = [];
    for (let index = 1; index <= this.balanceService.getMonth.daysInMonth(); index++) {
      days.push(add(index));
    }
    return days;
  }

  private getForEachDayBalance(manipulate: (data: number, amount: number) => number, check: (amount: number) => boolean): number[] {
    return this.getForEachDay((day) => {
      let data = 0;
      for (const balance of this.balanceService.balances) {
        if (check(balance.data.amount) && !dayjs(balance.data.date).isAfter(this.balanceService.getMonth.date(day))) {
          data = manipulate(data, balance.data.amount);
        }
      }
      return data;
    });
  }
}
