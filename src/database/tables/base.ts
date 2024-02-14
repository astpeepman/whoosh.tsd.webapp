import Dexie, {Collection, IndexableType, PromiseExtended} from "dexie";
import {AppDatabase} from "../database";
import {IFilterDelegate} from "../models";
import {IListResponse} from "../../app/modules/main/models/response";


export class Table<T, TKey>{
  protected readonly columns: string;
  private readonly table_name: string = 'Table';

  public readonly table!: Dexie.Table<T, TKey>;

  private schema: Record<string, string> = {};

  protected batch_size = 100;

  constructor(protected db: AppDatabase, columns: string, table_name: string) {
    this.columns = columns;
    this.table_name = table_name;

    this.schema[this.table_name] = this.columns;

    if (!this.db.isOpen())
      this.db.stores(this.schema);

    this.table = db.table(this.table_name);
  }

  async getList(page= 1, filterDelegate: IFilterDelegate | undefined = undefined){
    if (page < 1)
      page = 1;

    let dataset: any;
    if (!!filterDelegate)
      dataset = filterDelegate(this.table);
    else
      dataset = this.table;

    const count = await dataset.count();
    let next: boolean = false;
    if (page * this.batch_size < count)
      next = true;

    return {
      count: count,
      next: next,
      results: await dataset.offset(page * this.batch_size).limit(this.batch_size).toArray(),
      page: page
    } as IListResponse<T>;
  }

  getAll(filterDelegate: IFilterDelegate | undefined = undefined) {
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
