import Dexie, {Collection, PromiseExtended} from "dexie";
import {AppDatabase} from "../database";
import {DatabaseStatus, IFilterDelegate} from "../models";
import {IListResponse} from "../../app/modules/main/models/response";


export class Table<T, TKey>{
  protected readonly columns: string;
  private readonly table_name: string = 'Table';

  protected table!: Dexie.Table<T, TKey>;

  public readonly schema: Record<string, string> = {};

  protected batch_size = 100;

  constructor(protected db: AppDatabase, columns: string, table_name: string, searchable_columns: string[] | "all" = null) {
    this.table_name = table_name;
    if (searchable_columns){
      this.columns = columns.concat(",", "*searchable_columns");
    }
    else
      this.columns = columns;

    this.schema[this.table_name] = this.columns;


    this.db.status$.asObservable().subscribe((status: DatabaseStatus)=>{
      if (status === DatabaseStatus.OPENED){
        this.table = db.table(this.table_name);

        this.table.hook("creating",(primKey, obj: any, trans)=>{
          if (!searchable_columns)
            return;

          let cols = searchable_columns === "all" ? columns.split(",") : searchable_columns;

          let search_column_values: string[] = [];
          cols.forEach((col): void=>{
            if (typeof obj[col] === 'string' && !!obj[col]){
              search_column_values = search_column_values.concat(obj[col].split(/(?:-_\.,| )+/));
            }
          });

          obj.searchable_columns = this.getSearchWords(search_column_values);
        });

        this.table.hook("updating", (modifications: Object, primKey, obj: any, transaction)=>{
          if (searchable_columns){
            let cols = searchable_columns === "all" ? columns.split(",") : searchable_columns;

            let search_column_values: string[] = [];
            cols.forEach((col): void=>{
              if (typeof obj[col] === 'string' && !!obj[col]){
                search_column_values = search_column_values.concat(obj[col].split(/(?:-_\.,| )+/));
              }
            });

            obj.searchable_columns = this.getSearchWords(search_column_values);
          }
        })
      }

      if (status === DatabaseStatus.STORES){

      }
    })
  }

  private getSearchWords(search_column_values: string[]){
    let word_set = search_column_values.reduce(function (prev: { [x: string]: boolean; }, current: string | number) {
      prev[current] = true;
      return prev;
    }, {});
    return Object.keys(word_set);
  }

  async getList(page= 1, filterDelegate: IFilterDelegate | undefined = undefined){
    if (page < 1)
      page = 1;

    let dataset: Collection<any, any>;
    if (!!filterDelegate)
      dataset = filterDelegate(this.table);
    else
      dataset = this.table.toCollection();

    let count = filterDelegate ? await filterDelegate(this.table).count() : await this.table.count()

    let next: boolean = false;
    if (page * this.batch_size < count)
      next = true;

    return {
      count: count,
      next: next,
      results: await dataset.offset((page - 1) * this.batch_size).limit(this.batch_size).toArray(),
      page: page
    } as IListResponse<T>;
  }

  getAll(filterDelegate: IFilterDelegate | undefined = undefined): PromiseExtended<T[]> {
    if (!!filterDelegate) {
      return filterDelegate(this.table).toArray();
    }
    return this.table.toArray();
  }

  getCount(){
    return this.table.count();
  }

  getById(id: TKey) {
    return this.table.get(id);
  }

  async addBulkAsync(items: T[]) {
    const batchSize = 1000;
    let processed = 0;

    while (processed < items.length) {
      const batch = items.slice(processed, processed + batchSize);
      await this.table.bulkPut(batch);
      processed += batchSize;
    }
  }

  async addAsync(item: T): Promise<void> {
    await this.table.add(item);
  }

  async addOrUpdateAsync(item: T): Promise<void> {
    await this.table.put(item);
  }

  async updateAsync(id: TKey, changes: Partial<T>): Promise<void> {
    await this.table.update(id, changes);
  }

  async removeAsync(id: TKey): Promise<void> {
    await this.table.delete(id);
  }

  async removeRangeAsync(id_list: TKey[]): Promise<void> {
    await this.table.bulkDelete(id_list);
  }
}
