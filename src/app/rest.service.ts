import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, EMPTY } from "rxjs";
import { switchMap, switchMapTo } from "rxjs/operators";
import * as t from "io-ts/lib/index";

import { decode, decodeArray } from "./utils/decode";

type Params =
  | HttpParams
  | {
      [param: string]: string | string[];
    };

export abstract class RestService<T extends t.Mixed> {
  constructor(
    protected http: HttpClient,
    protected codec: T,
    protected resourcePath: string
  ) {}

  get(id: number, params?: Params): Observable<t.TypeOf<T>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`, { params })
      .pipe(switchMap(decode(this.codec)));
  }

  getList(params?: Params): Observable<ReadonlyArray<t.TypeOf<T>>> {
    return this.http
      .get<unknown>(this.baseUrl, { params })
      .pipe(switchMap(decodeArray(this.codec)));
  }

  create(entry: t.TypeOf<T>): Observable<t.TypeOf<T>> {
    return this.http
      .post(this.baseUrl, this.codec.encode(entry))
      .pipe(switchMap(decode(this.codec)));
  }

  update(id: number, entry: t.TypeOf<T>): Observable<t.TypeOf<T>> {
    return this.http
      .patch(`${this.baseUrl}/${id}`, this.codec.encode(entry))
      .pipe(switchMap(decode(this.codec)));
  }

  remove(id: number): Observable<never> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(switchMapTo(EMPTY));
  }

  protected get baseUrl(): string {
    return `/api/${this.resourcePath}`;
  }
}
