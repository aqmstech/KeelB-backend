import { BaseModel } from "../../models/baseModel";
import { SocialaccountsInterface } from "./socialaccountsInterface";

export class SocialaccountsModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('social-accounts', []);
    this.fillables = [
      {
        "column": "userId",
        "type": "string"
      },
      {
        "column": "clientId",
        "type": "string"
      },
      {
        "column": "authType",
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

  public sanitize(data: any): SocialaccountsInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as SocialaccountsInterface;
  }
}