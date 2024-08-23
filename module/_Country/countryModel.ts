import { BaseModel } from "../../models/baseModel";
import { CountryInterface } from "./countryInterface";

export class CountryModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('countries', []);
    this.fillables = [
      {
        "column": "regionId",
        "type": "string"
      },
      {
        "column": "subRegionId",
        "type": "string"
      },
      {
        "column": "name",
        "type": "string"
      },
      {
        "column": "capital",
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

  public sanitize(data: any): CountryInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as CountryInterface;
  }
}