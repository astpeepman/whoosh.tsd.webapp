import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {IListResponse} from "../models/response";
import {Server} from "../models/server";
import {environment} from "../../../../environments/environment";
import {Good} from "../models/good";
import Dexie from "dexie";
import {GoodTable} from "../../../../database/tables/good";
import {IFilterDelegate} from "../../../../database/models";

@Injectable({
  providedIn: 'root'
})
export class GoodService {

  constructor(
    private http: HttpClient,
    private good_table: GoodTable
  ) {
  }

  private async getListFromDb(page: number, filterDelegate: IFilterDelegate | undefined = undefined){
    if (!filterDelegate){
      filterDelegate = (db_set: Dexie.Table)=>{
        const date = new Date();
        date.setTime(date.getTime() - 1000 * 60 * 60);
        return db_set.where("update_time").above(date);
      }
    }

    let cached_data = await this.good_table.getList(page,
      filterDelegate
    )

    let is_cached_data_available = cached_data?.count > 0;
    if (is_cached_data_available)
      return cached_data;

    return null;
  }

  private async updateGoodList(){
    let page = 1;
    while(true){
      const url = environment.api + "barcode/list";
      const response = await lastValueFrom(
        this.http.get<IListResponse<Server.Good>>(
          url,
          {
            params:{
              page: page
            }
          }
        )
      );

      if (response?.count > 0){
        await this.good_table.addBulkAsync(response.results.map((good: Server.Good)=>{
          return Good.create(good);
        }));
      }

      if (!response.next)
        break;

      page++;
    }

  }

  async list(page: number | "update" = 1){
    if (page === "update"){
      await this.updateGoodList();
      page = 1;
    }

    let good_list = await this.getListFromDb(page);
    if (!good_list){
      await this.updateGoodList();
    }

    return await this.getListFromDb(page);
  }

  async search(text: string, page: number = 1){

    let good_list = await this.getListFromDb(page);
    if (!good_list){
      await this.updateGoodList();
    }

    let search_words = text.split(" ").filter((word)=>{
      return !!word;
    });

    return this.getListFromDb(page, (db_set: Dexie.Table)=>{
      return db_set.where("searchable_columns").startsWithAnyOfIgnoreCase(search_words).distinct();
    })

    // return this.getListFromDb(page, (db_set: Dexie.Table)=>{
    //   return db_set.filter((good: Good)=>{
    //     let string = `${good.id} ${good.remainder} ${good.models} ${good.property} ${good.master_code} ${good.vendor_code} ${good.name} ${good.barcode}`;
    //
    //     for (let word of search_words){
    //       if (string.includes(word)){
    //         return true;
    //       }
    //     }
    //     return false;
    //   })
    // });


    // let cached_data = await this.good_table.getAll(
    //   (db_set: Dexie.Table)=>{
    //     const date = new Date();
    //     date.setTime(date.getTime() - 1000 * 60 * 60);
    //     return db_set.where("update_time").above(date);
    //   }
    // )
    //
    // let is_cached_data_available = cached_data?.length > 0;
    // if (!is_cached_data_available){
    //   while (true){
    //     const url = environment.api + "barcode/list";
    //     const response = await lastValueFrom(
    //       this.http.get<IListResponse<Server.Good>>(url)
    //     );
    //
    //     if (response?.count > 0){
    //       await this.good_table.addBulkAsync(response.results.map((good: Server.Good)=>{
    //         return Good.create(good);
    //       }));
    //     }
    //
    //     if (!response.next)
    //       break;
    //   }
    // }
    //
    // let search_text = text.split(" ").filter((word)=>{
    //   return !!word;
    // });
    //
    // return this.good_table.getAll(
    //   (db_set: Dexie.Table) => {
    //     return db_set.filter((good: Good)=>{
    //       let string = `${good.id} ${good.remainder} ${good.models} ${good.property} ${good.master_code} ${good.vendor_code} ${good.name} ${good.barcode}`;
    //
    //       for (let word in search_text){
    //         if (string.includes(word))
    //           return true
    //       }
    //
    //       return false
    //     })
    //   }
    // );
  }
}
