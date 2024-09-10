import {BaseModel} from "../../models/baseModel";
import { DinningOptionsInterface} from "./dinningoptionsInterface";

export class DinningOptionsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('dinningoptions', []);
        this.fillables = [
  {
    "column": "name",
    "type": "string"
  },
  {
    "column": "imageRestauranttypeRoutes",
    "type": "string"
  },
  {
    "column": "status",
    "type": "boolean"
  },
  {
    "column": "isFeaturedRestauranttypeRoutes",
    "type": "boolean"
  },
  {
    "column": "createdAt",
    "type": "date"
  },
  {
    "column": "updatedAtRestauranttypeRoutes",
    "type": "date"
  },
  {
    "column": "deletedAt?",
    "type": "date"
  }
]
    }

    public sanitize(data: any): DinningOptionsInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as DinningOptionsInterface;
            }
}