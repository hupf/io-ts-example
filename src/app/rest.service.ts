import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, EMPTY } from "rxjs";
import { switchMap, mapTo, switchAll } from "rxjs/operators";
import * as t from "io-ts/lib/index";

import { decode, decodeArray } from "./utils/decode";

type Params =
  | HttpParams
  | {
      [param: string]: string | string[];
    };

export abstract class RestService<P extends t.AnyProps> {
  constructor(
    protected http: HttpClient,
    protected codec: t.TypeC<P>,
    protected resourcePath: string
  ) {}

  get(id: number, params?: Params): Observable<t.TypeOfProps<P>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`, { params })
      .pipe(switchMap(decode(this.codec)));
  }

  getList(params?: Params): Observable<ReadonlyArray<t.TypeOfProps<P>>> {
    return this.http
      .get<unknown>(this.baseUrl, { params })
      .pipe(switchMap(decodeArray(this.codec)));
  }

  create(entry: t.TypeOfProps<P>): Observable<t.TypeOfProps<P>> {
    return this.http
      .post(this.baseUrl, this.codec.encode(entry))
      .pipe(switchMap(decode(this.codec)));
  }

  update(id: number, entry: t.TypeOfProps<P>): Observable<t.TypeOfProps<P>> {
    return this.http
      .patch(`${this.baseUrl}/${id}`, this.codec.encode(entry))
      .pipe(switchMap(decode(this.codec)));
  }

  remove(id: number): Observable<never> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      mapTo(EMPTY),
      switchAll()
    );
  }

  protected get baseUrl(): string {
    return `/api/${this.resourcePath}`;
  }
}
