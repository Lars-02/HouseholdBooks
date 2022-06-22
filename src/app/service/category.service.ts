import { Injectable } from "@angular/core";
import { Project } from "./project.service";
import { Subject } from "rxjs";
import { DatabaseService } from "./database.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, push, ref, remove, set } from "firebase/database";

export interface Category {
  $id?: string;
  data: {
    label: string;
    budget: number | null;
    endDate: number | null;
  };
}

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  private project?: Project;
  public categories: Category[] = [];
  public categoriesChanged: Subject<void> = new Subject();

  constructor(private database: DatabaseService) { }

  setProject(project: Project) {
    if (this.project === project) {
      return;
    }
    this.project = project;
    this.getCategories();
  }

  private getCategories() {
    onAuthStateChanged(getAuth(), async (user) => {
      if (!user || !this.project) {
        return;
      }
      onValue(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/categories`), (snapshot => {
        this.categories = [];
        snapshot.forEach(child => {
          this.categories.push({
            $id: child.key ?? undefined,
            data: {
              ...child.val(),
            },
          });
        });
        this.categoriesChanged.next();
      }));
    });
  }

  async saveCategory(category: Category, property?: "label" | "budget" | "endDate") {
    const user = getAuth().currentUser;
    if (!user || !this.project || !this.project.$id) {
      return;
    }
    if (category.$id) {
      if (property) {
        await set(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/categories/${category.$id}/${property}`), category.data[property]);
      } else {
        await set(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/categories/${category.$id}`), category.data);
      }
    } else {
      push(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/categories`), category.data);
    }
  }

  async deleteCategory(category: Category) {
    const user = getAuth().currentUser;
    if (!user || !this.project || !this.project.$id || !category.$id) {
      return;
    }
    await remove(ref(this.database.db, "projects/" + user.uid + "/" + this.project.$id + "/categories/" + category.$id));
  }

  getCategory(id: string): Category | undefined {
    return this.categories.find(category => {
      return category.$id = id;
    });
  }
}
