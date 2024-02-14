import {Good} from "../../app/modules/main/models/good";
import {AppDatabase} from "../database";
import {Server} from "../../app/modules/main/models/server";
import {Table} from "./base";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GoodTable extends Table<Good, string>{
  constructor(db: AppDatabase) {
    super(db,  db.getColumns(Good.create({} as Server.Good)), 'Good');
  }
}
