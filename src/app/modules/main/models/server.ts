interface BaseDocument{
  id: string;
}

export declare namespace Server{
  interface Good{
    id: string;
    barcode: string;
    name: string;
    vendor_code: string;
    unit: string;
    master_code?: string;
    models?: string;
    property?: string;
    remainder?: number;
  }

  interface Cell{
    id: string;
    barcode: string;
    name: string;
  }

  interface Remain<T>{
    object: T;
    quantity: number;
  }

  interface ResponseObject<T>{
    object: T;
    remain_list: Remain<T>
  }

  interface DocumentInventory extends BaseDocument{
    response_cell: ResponseObject<Cell>;
  }
}
