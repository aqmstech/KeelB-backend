import { BaseModel } from "../../models/baseModel";
import { RegionsInterface } from "./regionsInterface";

export class RegionsModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('regions', []);
    this.fillables = [
      {
        "column": "name",
        "type": "string"
      },
      {
        "column": "status",
        "type": "boolean"
      },
      {
        "column": "createdAt",
        "type": "date"
      },
      {
        "column": "updatedAt",
        "type": "date"
      }
    ]
  }

  public sanitize(data: any): RegionsInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as RegionsInterface;
  }
}