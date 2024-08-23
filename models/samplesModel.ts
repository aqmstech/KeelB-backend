import { BaseModel } from "./baseModel";
import { SamplesInterface } from "../models/Interfaces/samplesInterface";

export class SamplesModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('samples', []);
    this.fillables = [
      {
        "column": "name",
        "type": "string"
      },
      {
        "column": "description",
        "type": "text"
      },
      {
        "column": "createdAt",
        "type": "date"
      }
    ]
  }

  public sanitize(data: any): SamplesInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as SamplesInterface;
  }
}