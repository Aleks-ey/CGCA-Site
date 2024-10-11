import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RefreshService {
  constructor() {}

  private refreshSubject = new Subject<string>();

  public refreshObservable = this.refreshSubject.asObservable();

  public triggerRefresh(context: string): void {
    this.refreshSubject.next(context);
  }
}
