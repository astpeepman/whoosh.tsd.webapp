import {Server} from "./server";
import {DatabaseModel} from "../../../../database/models";

export class Good extends DatabaseModel implements Server.Good{
  readonly barcode: string;
  readonly name: string;
  readonly unit: string;
  readonly vendor_code: string;
  readonly property?: string;
  readonly master_code?: string;
  readonly models?: string;
  readonly remainder?: number;

  constructor(
    id: string,
    barcode: string,
    name: string,
    vendor_code: string,
    unit: string,
    master_code?: string,
    models?: string,
    property?: string,
    remainder?: number,
  ) {
    super();

    this.id = id;
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.vendor_code = vendor_code;
    this.property = property;
    this.master_code = master_code;
    this.models = models;
    this.remainder = remainder;
  }

  public static create(good: Server.Good){
    return new Good(
      good.id,
      good.barcode,
      good.name,
      good.vendor_code,
      good.unit,
      good.master_code,
      good.models,
      good.property,
      good.remainder
    )
  }
}
