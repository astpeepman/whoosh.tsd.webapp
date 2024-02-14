import {Server} from "./server";
import {DatabaseModel} from "../../../../database/models";

export class Cell extends DatabaseModel implements Server.Cell{
  readonly barcode: string;
  readonly name: string;

  constructor(
    id: string,
    barcode: string,
    name: string,
  ) {
    super();

    this.id = id;
    this.barcode = barcode;
    this.name = name;
  }

  public static create(cell: Server.Cell){
    return new Cell(
      cell.id,
      cell.barcode,
      cell.name,
    )
  }
}
