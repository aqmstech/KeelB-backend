import {BaseModel} from "../../models/baseModel";
import { RestaurantsInterface} from "./restaurantsInterface";

export class RestaurantsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('restaurants', []);
        this.fillables = [
  {
    "column": "name",
    "type": "string"
  },
  {
    "column": "cover_image",
    "type": "string"
  },
  {
    "column": "description",
    "type": "string"
  },
  {
    "column": "address",
    "type": "string"
  },
  {
    "column": "user_id",
    "type": "string"
  },
  {
    "column": "min_price",
    "type": "number"
  },
  {
    "column": "max_price",
    "type": "number"
  },
  {
    "column": "avg_rating",
    "type": "number"
  },
  {
    "column": "menu",
    "type": "object"
  },
  {
    "column": "currency_type",
    "type": "string"
  },
  {
    "column": "location",
    "type": "object"
  },
  {
    "column": "cuisines",
    "type": "array"
  },
  {
    "column": "meal_type",
    "type": "array"
  },
  {
    "column": "ambiance",
    "type": "array"
  },
  {
    "column": "categories",
    "type": "array"
  },
  {
    "column": "timings",
    "type": "array"
  },
  {
    "column": "accepted_payment_types",
    "type": "enum"
  },
  {
    "column": "service_types",
    "type": "enum"
  },
  {
    "column": "service_time",
    "type": "object"
  },
  {
    "column": "isFeatured",
    "type": "boolean"
  },
  {
    "column": "isVerified",
    "type": "boolean"
  },
  {
    "column": "status",
    "type": "enum"
  },
  {
    "column": "createdAt",
    "type": "date"
  },
  {
    "column": "updatedAt",
    "type": "date"
  },
  {
    "column": "deletedAt",
    "type": "date"
  }
]
    }

    public sanitize(data: any): RestaurantsInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as RestaurantsInterface;
            }
}