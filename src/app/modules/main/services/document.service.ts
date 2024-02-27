import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Server} from "../models/server";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private http: HttpClient,
  ) {
  }

  conversionFromBarcode(barcode: string): Observable<Server.DocumentConversion> {
    const url = environment.api + 'documents/conversion';
    return this.http.post<Server.DocumentConversion>(
      url,
      {
        barcode: barcode
      }
    )
  }
}
