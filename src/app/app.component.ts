import { Component, OnInit } from "@angular/core";
import { UserRestService } from "./user-rest.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "io-ts-example";

  constructor(private userService: UserRestService) {}

  ngOnInit(): void {
    this.userService.getList().subscribe(users => {
      console.log(users);
    });
  }
}
