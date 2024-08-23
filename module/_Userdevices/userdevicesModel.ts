import { ObjectId } from "mongodb";
import { InternalServerError } from "../../errors/internal-server-error";
import { BaseModel } from "../../models/baseModel";
import { UserdevicesInterface } from "./userdevicesInterface";
import { BadRequestError } from "../../errors/bad-request-error";

export class UserdevicesModel extends BaseModel {
  protected fillables: any = [];
  constructor() {
    super('user-devices', []);
    this.fillables = [
      {
        "column": "userId",
        "type": "string"
      },
      {
        "column": "deviceToken",
        "type": "string"
      },
      {
        "column": "deviceType",
        "type": "string"
      },
      {
        "column": "isDeleted?",
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

  public sanitize(data: any): UserdevicesInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as UserdevicesInterface;
  }

  public async getDevicesByUserIds(userIds: Array<string>) {
    try {
      if (!this.collection) await this.INIT()
      return this.collection.find({
        userId: { $in: userIds }
      }).toArray()
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }
  }
  public async addUserDevice(userDevice: UserdevicesInterface) {
    try {
      if (!this.collection) await this.INIT()
      const filter = { userId: userDevice.userId, deviceType: userDevice.deviceType };
      const update = { $set: userDevice };
      const options = { upsert: true };
      const result = await this.collection.updateOne(filter, update, options);
      return result;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async getUserDeviceById(data: {}) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.findOne(data);
      return res;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async removeUserDevice(condition: {}) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.deleteOne(condition);
      return res;
    } catch (error) {
      console.log(error)
      throw new InternalServerError();
    }
  }

  public async updateUserDevice(_id: string, update: any) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...update,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );
      return res;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async upsertIfNotFound(query: any, upsertObj: any) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.findOneAndUpdate(
        query,
        { $set: { ...upsertObj } },
        { upsert: true }
      );
      return res;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async findByQuery(
    query: object
  ) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.findOne(query);
      return res;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async findByQueryAndUpdate(query: any, update: any) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.findOneAndUpdate(
        query,
        {
          $set: {
            ...update,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );
      return res;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async findAllByQuery(query: object) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.find(query).toArray();
      return res;
    } catch (error) {
      throw new InternalServerError();
    }
  }

  public async findAllWithAggregation(pipeline: [object]) {
    try {
      if (!this.collection) await this.INIT()
      const res = await this.collection.aggregate(pipeline).toArray();
      return res;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}