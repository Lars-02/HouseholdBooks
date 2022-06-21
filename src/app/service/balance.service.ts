import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { Subject } from "rxjs";
import { Project } from "./project.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, push, ref, remove, set } from "firebase/database";
import { Dayjs } from "dayjs";

export interface Balance {
  $id?: string;
  data: {
    label: string;
    amount?: number;
    category: string | null;
    date: number;
  };
}

@Injectable({
  providedIn: "root",
})
export class BalanceService {

  private project?: Project;
  public balances: Balance[] = [];
  public balancesChanged: Subject<void> = new Subject();

  constructor(private database: DatabaseService) { }

  setProject(project: Project) {
    if (this.project === project) {
      return;
    }
    this.project = project;
    this.getBalance();
  }

  private getBalance() {
    onAuthStateChanged(getAuth(), async (user) => {
      if (!user || !this.project) {
        return;
      }
      onValue(ref(this.database.db, "projects/" + user.uid + "/" + this.project.$id + "/balances"), (snapshot => {
        this.balances = [];
        snapshot.forEach(child => {
          this.balances.push({
            $id: child.key ?? undefined,
            data: {
              ...child.val(),
            },
          });
        });
        this.balancesChanged.next();
      }));
    });
  }

  async saveBalance(balance: Balance) {
    const user = getAuth().currentUser;
    if (!user || !this.project || !this.project.$id) {
      return;
    }
    if (balance.$id) {
      await set(ref(this.database.db, "projects/" + user.uid + "/" + this.project.$id + "/balances/" + balance.$id), balance.data);
    } else {
      push(ref(this.database.db, "projects/" + user.uid + "/" + this.project.$id + "/balances"), balance.data);
    }
  }

  async deleteBalance(balance: Balance) {
    const user = getAuth().currentUser;
    if (!user || !this.project || !this.project.$id || !balance.$id) {
      return;
    }
    await remove(ref(this.database.db, "projects/" + user.uid + "/" + this.project.$id + "/balances/" + balance.$id));
  }
}
