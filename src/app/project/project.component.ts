import { Component } from "@angular/core";
import { Project, ProjectService } from "../service/project.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent {

  constructor(public projectService: ProjectService) { }

  async projectChange(project: Project) {
    await this.projectService.saveProject(project);
  }

  canAdd() {
    return this.projectService.projects.some(project => {
      return !project.$id;
    });
  }
}
