import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GoodTable} from "../../../../database/tables/good";
import {lastValueFrom, map, Observable, tap} from "rxjs";
import {IListResponse} from "../models/response";
import {Server} from "../models/server";
import {environment} from "../../../../environments/environment";
import {Good} from "../models/good";
import Dexie from "dexie";

@Injectable({
  providedIn: 'root'
})
export class GoodService {

  constructor(
    private http: HttpClient,
    private good_table: GoodTable
  ) { }

  async list(page: number | "update" = 1){
    if (page !== "update"){
      let cached_data = await this.good_table.getList(page,
        (db_set: Dexie.Table)=>{
          const date = new Date();
          date.setTime(date.getTime() - 1000 * 60 * 60);
          return db_set.where("update_time").above(date);
        }
      )

      let is_cached_data_available = cached_data?.count > 0;
      if (is_cached_data_available)
        return cached_data;
    }

    const url = environment.api + "barcode/list";
    const response = await lastValueFrom(
      this.http.get<IListResponse<Server.Good>>(url)
    );

    const goods: IListResponse<Good> = {
      count: response.count,
      next: response.next,
      page: response.page,
      results: response.results.map((good: Server.Good)=>{
        return Good.create(good);
      })
    } as IListResponse<Good>;
    if (response?.count > 0){
      await this.good_table.addBulkAsync(goods.results);
    }

    return goods;
  }
}
