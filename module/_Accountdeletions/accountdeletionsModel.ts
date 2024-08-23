import { BaseModel } from "../../models/baseModel";
import { AccountdeletionsInterface } from "./accountdeletionsInterface";

export class AccountdeletionsModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('account-deletions', []);
    this.fillables = [
      {
        "column": "userId",
        "type": "string"
      },
      {
        "column": "reason",
        "type": "text"
      },
      {
        "column": "createdAt",
        "type": "date"
      }
    ]
  }

  public sanitize(data: any): AccountdeletionsInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as AccountdeletionsInterface;
  }
}