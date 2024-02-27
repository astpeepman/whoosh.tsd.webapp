import {Inject, Injectable, OnDestroy, PLATFORM_ID} from "@angular/core";
import Dexie, {PromiseExtended, Table} from "dexie";
import {DatabaseStatus, ITableSchema} from "./models";
import {isPlatformBrowser} from "@angular/common";
import {GoodTable} from "./tables/good";
import {CellTable} from "./tables/cell";
import {BehaviorSubject} from "rxjs";

export const DB_NAME = 'tsd';

@Injectable({
  providedIn: 'root',
})
export class AppDatabase extends Dexie {
  public readonly version_number = 1;
  public status$: BehaviorSubject<DatabaseStatus> = new BehaviorSubject<DatabaseStatus>(null);

  constructor() {
    super(DB_NAME, {autoOpen: false});
  }

  public async clear(){
    console.log('deleting DB...');
    this.close();
    await this.delete();
    await this.open();
    console.log('DB deleted.');
  }

  public override open(): PromiseExtended<Dexie>{
    this.status$.next(DatabaseStatus.OPENED);
    return super.open();
  }

  public override close(){
    this.status$.next(DatabaseStatus.CLOSED);
    return super.close();
  }

  public getColumns<T extends Record<string, any>>(instance: T, primary_key: string | string[] = "id", additional_columns: string[] = []): string {
    let column_list = Object.keys(instance) as (keyof T)[];

    if (typeof primary_key === 'string')
      column_list.sort((a: keyof T, b: keyof T)=>{
        if (a.toString() === primary_key){
          return -1;
        }
        else if (b.toString() === primary_key){
          return 1;
        }
        return 0;
      });
    else
      column_list.unshift(`[${primary_key.join('+')}]`);

    if (additional_columns.length){
      column_list = [...column_list, ...additional_columns];
    }
    return column_list.join(',');
  }

  public stores(schema: {[p: string]: string}){
    this.status$.next(DatabaseStatus.STORES);
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
    const tables = {
      good: new GoodTable(db),
      cell: new CellTable(db)
    }

    let schemas = {};
    Object.values(tables).forEach((table)=>{
      Object.assign(schemas, table.schema);
    });

    this.db.stores(schemas);

    if (isPlatformBrowser(this.platform)){
      if (!this.db.isOpen()){
        this.db.open().catch (function (err) {
          console.error('Failed to open db: ' + (err.stack || err));
        });
      }
     this.db.migrate();
    }
  }

  ngOnDestroy() {
    this.db.close();
  }
}
