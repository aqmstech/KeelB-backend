import { BaseModel } from "../../models/baseModel";
import { StatesInterface } from "./statesInterface";

export class StatesModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('states', []);
    this.fillables = [
      {
        "column": "name",
        "type": "string"
      },
      {
        "column": "countryId",
        "type": "string"
      },
      {
        "column": "regionId",
        "type": "string"
      },
      {
        "column": "subRegionId",
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

  public sanitize(data: any): StatesInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as StatesInterface;
  }
}