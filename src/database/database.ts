import {Inject, Injectable, OnDestroy, PLATFORM_ID} from "@angular/core";
import Dexie, {Table} from "dexie";
import {ITableSchema} from "./models";
import {Table as InstanceTable} from "./tables/base";
import {GoodTable} from "./tables/good";
import {CellTable} from "./tables/cell";
import {isPlatformBrowser} from "@angular/common";

export const DB_NAME = 'tsd';

@Injectable({
  providedIn: 'root',
})
export class AppDatabase extends Dexie {
  public readonly version_number = 1;

  constructor() {
    super(DB_NAME);
  }

  public async clear(){
    console.log('deleting DB...');
    this.close();
    await this.delete();
    await this.open();
    console.log('DB deleted.');
  }

  public getColumns<T extends Record<string, any>>(instance: T): string {
    return (Object.keys(instance) as (keyof T)[]).sort((a: keyof T, b: keyof T)=>{
      if (a.toString() === "id"){
        return -1;
      }
      else if (b.toString() === "id"){
        return 1;
      }
      return 0;
    }).join(',');
  }

  public stores(schema: {[p: string]: string}){
    return this.version(this.version_number).stores(schema);
  }

  public async migrate(){
    if (await Dexie.exists(DB_NAME)) {
      const declared_schema = AppDatabase.getCanonicalComparableSchema(this);
      const dyn_db = new Dexie(DB_NAME);
      const installed_schema = await dyn_db
        .open()
        .then(AppDatabase.getCanonicalComparableSchema);
      dyn_db.close();
      if (declared_schema !== installed_schema) {
        console.log('Db schema is not updated, so deleting the db.');
        await this.clear();
      }
    }
  }

  public static getCanonicalComparableSchema(db: Dexie): string {
    const table_schemas: ITableSchema[] = db.tables.map((table) =>
      AppDatabase.getTableSchema(table)
    );
    return JSON.stringify(
      table_schemas.sort((a, b) => (a.name < b.name ? 1 : -1))
    );
  }

  public static getTableSchema(table: Table): ITableSchema {
    const { name, schema } = table;
    const indexSources = schema.indexes.map((idx) => idx.src).sort();
    const schemaString = [schema.primKey.src, ...indexSources].join(',');
    return { name, schema: schemaString };
  }
}


@Injectable({
  providedIn: 'root'
})
export class DataBase implements OnDestroy{

  constructor(
    private db: AppDatabase,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    const good_table = new GoodTable(db);
    const cell_table = new CellTable(db);

    if (isPlatformBrowser(this.platform)){
      if (!db.isOpen())
        db.open();

      console.log(db.isOpen())
      // db.migrate().then();
    }
  }

  ngOnDestroy() {
    this.db.close();
  }
}
