import {AppDatabase} from "../database";
import {Server} from "../../app/modules/main/models/server";
import {Table} from "./base";
import {Injectable} from "@angular/core";
import {Cell} from "../../app/modules/main/models/cell";

@Injectable({
  providedIn: 'root'
})
export class CellTable extends Table<Cell, string>{
  constructor(db: AppDatabase) {
    super(db, db.getColumns(Cell.create({} as Server.Good)), 'Cell');
  }
}
