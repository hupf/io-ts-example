import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RestService } from "./rest.service";
import { User } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class UserRestService extends RestService<typeof User> {
  constructor(http: HttpClient) {
    super(http, User, "users");
  }
}
