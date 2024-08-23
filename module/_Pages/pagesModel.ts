import { BaseModel } from "../../models/baseModel";
import { PagesInterface } from "./pagesInterface";

export class PagesModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('pages', []);
    this.fillables = [
      {
        "column": "title",
        "type": "string"
      },
      {
        "column": "content",
        "type": "text"
      },
      {
        "column": "slug",
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

  public sanitize(data: any): PagesInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as PagesInterface;
  }
}