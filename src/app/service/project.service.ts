import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { onValue, push, ref, set, remove } from "firebase/database";
import { Subject } from "rxjs";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface Project {
  $id?: string;
  data: {
    name: string;
    description?: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class ProjectService {

  private readonly ref = ref(this.database.db, "projects");

  public projects: Project[] = [];
  public projectsChanged: Subject<void> = new Subject();

  constructor(private database: DatabaseService) {
    onAuthStateChanged(getAuth(), async (user) => {
      if (!user) {
        return;
      }
      onValue(this.ref, (snapshot => {
        this.projects = [];
        snapshot.forEach(child => {
          this.projects.push({
            $id: child.key ?? undefined,
            data: {
              ...child.val(),
            },
          });
        });
        this.projectsChanged.next();
      }));
    });
  }

  addProject() {
    this.projects.push({ data: { name: "" } });
  }

  async saveProject(project: Project) {
    if (project.$id) {
      await set(ref(this.database.db, "projects/" + project.$id), project.data);
    } else {
      push(this.ref, project.data);
    }
  }

  async deleteProject(project: Project) {
    await remove(ref(this.database.db, "projects/" + project.$id));
  }

  getProject(id: string | null): Project | undefined {
    if (!id) { return undefined; }

    return this.projects.find(project => {
      return project.$id === id;
    });
  }

}
