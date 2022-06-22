import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.service";
import { Subject } from "rxjs";
import { Project } from "./project.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, push, ref, remove, set } from "firebase/database";
import { Dayjs } from "dayjs";
import * as dayjs from "dayjs";
import { Category } from "./category.service";

export interface Balance {
  $id?: string;
  data: {
    label: string;
    amount: number;
    category: string | null;
    date: number;
  };
}

export interface BalanceView extends Balance {
  dateString?: string;
  edit: boolean;
}

@Injectable({
  providedIn: "root",
})
export class BalanceService {

  private project?: Project;
  private allBalances: Balance[] = [];
  private date: Dayjs = dayjs();

  public balances: BalanceView[] = [];
  public balancesChanged: Subject<void> = new Subject();

  get getMonth() { return this.date; }

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
      onValue(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/balances`), (snapshot => {
        this.allBalances = [];
        snapshot.forEach(child => {
          this.allBalances.push({
            $id: child.key ?? undefined,
            data: {
              ...child.val(),
            },
          });
        });
        this.setBalances();
      }));
    });
  }

  private setBalances() {
    this.balances = this.allBalances
      .filter(balance => {
        const date = dayjs(balance.data.date);
        return date.month() === this.date.month() && date.year() === this.date.year();
      })
      .map(balance => {
        return { ...balance, edit: false };
      })
      .sort((first, last) => {
        return last.data.date - first.data.date;
      });
    this.balancesChanged.next();
  }

  async saveBalance(balance: Balance, property?: "label" | "amount" | "date") {
    const user = getAuth().currentUser;
    if (!user || !this.project || !this.project.$id) {
      return;
    }
    if (balance.$id) {
      if (property) {
        await set(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/balances/${balance.$id}/${property}`), balance.data[property]);
      } else {
        await set(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/balances/${balance.$id}`), balance.data);
      }
    } else {
      push(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/balances`), balance.data);
    }
  }

  async deleteBalance(balance: Balance) {
    const user = getAuth().currentUser;
    if (!user || !this.project || !this.project.$id || !balance.$id) {
      return;
    }
    await remove(ref(this.database.db, `projects/${user.uid}/${this.project.$id}/balances/${balance.$id}`));
  }

  changeMonth(by: number) {
    this.date = dayjs(this.date).add(by, "months");
    this.setBalances();
  }

  getBalanceOfCategory(category: Category): BalanceView[] {
    return this.balances.filter(balance => {
      return balance.data.category === category.$id;
    });
  }

  reset() {
    this.project = undefined;
    this.allBalances = [];
    this.balances = [];
    this.date = dayjs();
  }
}
