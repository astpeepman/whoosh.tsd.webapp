import Dexie, {Collection} from "dexie";

export class DatabaseModel{
  id: string;
  update_time = new Date();
}

export interface IFilterDelegate {
  (dbSet: Dexie.Table): Collection;
}

export interface ITableSchema{
  name: string;
  schema: string;
}
