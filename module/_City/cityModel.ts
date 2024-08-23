import { BaseModel } from "../../models/baseModel";
import { CityInterface } from "./cityInterface";

export class CityModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('cities', []);
    this.fillables = [
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
        "column": "stateId",
        "type": "string"
      },
      {
        "column": "name",
        "type": "string"
      },
      {
        "column": "population",
        "type": "number"
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

  public sanitize(data: any): CityInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as CityInterface;
  }
}