import { Component } from "@angular/core";
import { Project, ProjectService } from "../../service/project.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent {

  public showArchived: boolean = false;
  public showNewProject: boolean = false;
  public newProject: Project = { data: { name: "", archived: false } };

  constructor(public projectService: ProjectService) { }

  async createProject() {
    if (this.newProject.data.name.length < 1 || this.newProject.data.name.length > 16) {
      return;
    }
    await this.projectService.saveProject(this.newProject);
    this.showNewProject = false;
    this.newProject = { data: { name: "", archived: false } };
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
    await this.projectService.saveProject(project);
    if (!this.archiveExists()) {
      this.showArchived = false;
    }
  }
}
