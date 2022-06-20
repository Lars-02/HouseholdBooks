import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { onValue, push, ref, set, remove } from "firebase/database";
import { Subject } from "rxjs";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface Project {
  $id?: string;
  data: {
    name: string;
    archived: boolean;
    description?: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  public projects: Project[] = [];
  public projectsChanged: Subject<void> = new Subject();

  constructor(private database: DatabaseService) {
    onAuthStateChanged(getAuth(), async (user) => {
      if (!user) {
        return;
      }
      onValue(ref(this.database.db, "projects/" + user.uid), (snapshot => {
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
    const user = getAuth().currentUser;
    if (user) {
      this.projects.push({ data: { name: "", archived: false } });
    }
  }

  async saveProject(project: Project) {
    const user = getAuth().currentUser;
    if (!user) {
      return;
    }
    if (project.$id) {
      await set(ref(this.database.db, "projects/" + user.uid + "/" + project.$id), project.data);
    } else {
      push(ref(this.database.db, "projects/" + user.uid), project.data);
    }
  }

  async deleteProject(project: Project) {
    const user = getAuth().currentUser;
    if (!user) {
      return;
    }
    await remove(ref(this.database.db, "projects/" + user.uid + "/" + project.$id));
  }

  getProject(id: string | null): Project | undefined {
    if (!id) { return undefined; }

    return this.projects.find(project => {
      return project.$id === id;
    });
  }

}
