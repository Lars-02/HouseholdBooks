import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-errors",
  templateUrl: "./errors.component.html",
  styleUrls: ["./errors.component.css"],
})
export class ErrorsComponent {

  @Input() control?: AbstractControl | null;
  @Input() notDirty: boolean = false;
}
