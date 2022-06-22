import { AfterViewInit, Component, Input } from "@angular/core";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { CategoryView } from "../category.component";

@Component({
  selector: "category-chart",
  templateUrl: "./chart.component.html",
})
export class ChartComponent implements AfterViewInit {

  @Input() category!: CategoryView;

  constructor() { Chart.register(...registerables); }

  ngAfterViewInit() {
    this.setChart();
  }

  setChart() {
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
        data: [10, 0],
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
