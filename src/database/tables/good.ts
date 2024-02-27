import {Injectable} from "@angular/core";
import {Table} from "./base";
import {Good} from "../../app/modules/main/models/good";
import {AppDatabase} from "../database";
import {Server} from "../../app/modules/main/models/server";
import {DatabaseStatus} from "../models";

@Injectable({
  providedIn: 'root'
})
export class GoodTable extends Table<Good, string> {
  constructor(db: AppDatabase) {
    super(
      db,
      db.getColumns(
        Good.create({} as Server.Good),
        ['unit', 'property', 'id'],
      ),
      'Good',
      "all"
    );
  }
}
