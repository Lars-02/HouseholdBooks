import { Component } from "@angular/core";
import { Project, ProjectService } from "../service/project.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent {

  public showArchived: boolean = false;

  constructor(public projectService: ProjectService) { }

  async projectChange(project: Project) {
    await this.projectService.saveProject(project);
  }

  canAdd() {
    return this.projectService.projects.some(project => {
      return !project.$id;
    });
  }

  archiveExists() {
    return this.projectService.projects.some(project => {
      return project.data.archived;
    });
  }

  async unarchive(project: Project) {
    project.data.archived = false;
    await this.projectService.saveProject(project)
    if (!this.archiveExists()) {
      this.showArchived = false;
    }
  }
}
