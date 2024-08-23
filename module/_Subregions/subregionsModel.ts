import { BaseModel } from "../../models/baseModel";
import { SubregionsInterface } from "./subregionsInterface";

export class SubregionsModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('sub-regions', []);
    this.fillables = [
      {
        "column": "regionId",
        "type": "string"
      },
      {
        "column": "name",
        "type": "string"
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

  public sanitize(data: any): SubregionsInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as SubregionsInterface;
  }
}