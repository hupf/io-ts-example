import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import * as t from "io-ts";

import { RestService } from "./rest.service";
import { DecodeError } from "./utils/decode";

describe("RestService", () => {
  let service: FooService;
  let httpTestingController: HttpTestingController;
  const Foo = t.type({
    foo: t.string
  });

  @Injectable()
  class FooService extends RestService<typeof Foo> {
    constructor(http: HttpClient) {
      super(http, Foo, "foo");
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FooService]
    });
    service = TestBed.get(FooService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe(".get", () => {
    it("requests single instance with given id", () => {
      service.get(123).subscribe(result => {
        expect(result).toEqual({ foo: "bar" });
      });

      httpTestingController.expectOne("/api/foo/123").flush({ foo: "bar" });
    });

    it("throws an error if JSON from server is not compliant", () => {
      const success = jasmine.createSpy("success");
      const error = jasmine.createSpy("error");
      service.get(123).subscribe(success, error);

      httpTestingController.expectOne("/api/foo/123").flush({ foo: 123 });

      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalled();

      expect(error).toHaveBeenCalledWith(
        new DecodeError(
          "Invalid value 123 supplied to : { foo: string }/foo: string"
        )
      );
    });
  });

  describe(".getList", () => {
    it("requests multiple instances", () => {
      service.getList().subscribe(result => {
        expect(result).toEqual([{ foo: "bar" }, { foo: "baz" }]);
      });

      httpTestingController
        .expectOne("/api/foo")
        .flush([{ foo: "bar" }, { foo: "baz" }]);
    });

    it("throws an error if JSON from server is not compliant", () => {
      const success = jasmine.createSpy("success");
      const error = jasmine.createSpy("error");
      service.getList().subscribe(success, error);

      httpTestingController
        .expectOne("/api/foo")
        .flush([{ foo: 123 }, { foo: "baz" }]);

      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalled();

      expect(error).toHaveBeenCalledWith(
        new DecodeError(
          "Invalid value 123 supplied to : Array<{ foo: string }>/0: { foo: string }/foo: string"
        )
      );
    });
  });
});
