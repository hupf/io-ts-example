import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { decode } from "./utils/decode";
import { User } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  get(id: number): Observable<User> {
    return this.http
      .get<unknown>(`/api/users/${id}`)
      .pipe(switchMap(decode(User)));
  }

  create(user: User): Observable<User> {
    return this.http
      .post("/api/users", User.encode(user))
      .pipe(switchMap(decode(User)));
  }
}
