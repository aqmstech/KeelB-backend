import {BaseModel} from "../../models/baseModel";
import { AreasInterface} from "./areasInterface";

export class AreasModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('areas', []);
        this.fillables = [
  {
    "column": "name",
    "type": "string"
  },
  {
    "column": "image",
    "type": "string"
  },
  {
    "column": "status",
    "type": "boolean"
  },
  {
    "column": "isFeatured",
    "type": "boolean"
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

    public sanitize(data: any): AreasInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as AreasInterface;
            }
}