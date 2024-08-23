import { InternalServerError } from "../../errors/internal-server-error";
import { BaseModel } from "../../models/baseModel";
import { BlockusersInterface } from "./blockusersInterface";
import mongodb from "mongodb";

export class BlockusersModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('block-users', []);
    this.fillables = [
      {
        "column": "userId",
        "type": "string"
      },
      {
        "column": "blockedId",
        "type": "string"
      },
      {
        "column": "createdAt",
        "type": "date"
      }
    ]
  }

  public sanitize(data: any): BlockusersInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as BlockusersInterface;
  }

  public async removeBlockUser(condition: {}) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.deleteOne(condition);
      return res;
    } catch (error) {
      console.log(error)
      throw new InternalServerError();
    }
  }

  public async findWithAggregate(query: object[]): Promise<mongodb.Document | null> {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.aggregate(query).toArray();
      return res;
    } catch (error: any) {
      console.log({ error: error.message });
      throw new InternalServerError();
    }
  }
}