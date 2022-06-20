import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Project, ProjectService } from "../../service/project.service";
import { Subscription } from "rxjs";

@Component({
  selector: "project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrls: ["./project-detail.component.css"],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public editName: boolean = false;
  public project?: Project;

  constructor(public projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("projectId");
    this.project = this.projectService.getProject(id);

    if (!this.project) {
      this.subscriptions.push(this.projectService.projectsChanged.subscribe(async () => {
        this.project = this.projectService.getProject(id);
        if (!this.project || this.project.data.archived) {
          await this.router.navigateByUrl("/");
        }
      }));
      return;
    }

    if (this.project.data.archived) {
      await this.router.navigateByUrl("/");
    }
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
