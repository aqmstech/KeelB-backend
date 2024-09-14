import { BaseModel } from "../../models/baseModel";
import { AuthInterface } from "./authInterface";
import {Utils} from "../../utils/utils";
const internal_server_error_1 = require("../../errors/internal-server-error");

export class AuthModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('users', []);
    this.fillables = [
      {
        "column": "profileImage?",
        "type": "string"
      },
      {
        "column": "fullName?",
        "type": "string"
      },
      {
        "column": "username?",
        "type": "string"
      },
      {
        "column": "coverImage?",
        "type": "string"
      },
      {
        "column": "address",
        "type": "string"
      },
      {
        "column": "email",
        "type": "email"
      },
      {
        "column": "password",
        "type": "string"
      },
      {
        "column": "dob?",
        "type": "string"
      },
      {
        "column": "role",
        "type": "number"
      },
      {
        "column": "pushNotification?",
        "type": "boolean"
      },
      {
        "column": "isVerified?",
        "type": "boolean"
      },
      {
        "column": "isPro?",
        "type": "boolean"
      },
      {
        "column": "location?",
        "type": "object"
      },
      {
        "column": "otpInfo?",
        "type": "object"
      },
      {
        "column": "phone",
        "type": "string"
      },
      {
        "column": "gender",
        "type": "string"
      },
      {
        "column": "isDeleted?",
        "type": "boolean"
      },
      {
        "column": "isSocial?",
        "type": "boolean"
      },
      {
        "column": "status",
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

  public sanitize(data: any): AuthInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }
    return newData as AuthInterface;
  }

  public async findByQuery(query: object) {
    try {
      if (!this.collection)
        await this.INIT();
      const res = await this.collection.findOne(query);
      return res;
    } catch (error) {
      throw new internal_server_error_1.InternalServerError();
    }

  }

  public async List(filter: any, order: {}, page: number, perPage: number, withoutPagination: boolean = false) {
    if (!this.collection) await this.INIT()
    try {
      filter.deletedAt = null;
      let aggregationPipeline = [{$match: filter},{
        $project: {
          password: 0,
          otpInfo: 0,

        }
      }];
      let pagination = Utils.CalcPagination(page, perPage)
      const total: any = await this.collection.countDocuments(filter)
      let data = [];
      if (withoutPagination) {
        data = await this.collection.aggregate(aggregationPipeline).sort(order).toArray();
        return data;
      }
      data = await this.collection.aggregate(aggregationPipeline).sort(order).skip(pagination.skip).limit(pagination.limit).toArray();
      return Utils.Pagination(data, page, perPage, parseInt(total), this?.collectionName || 'data');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

}