import {BaseModel} from "../../models/baseModel";
import { UserFavoritesInterface} from "./userfavoritesInterface";

export class UserFavoritesModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('userfavorites', []);
        this.fillables = [
  {
    "column": "user_id?",
    "type": "string"
  },
  {
    "column": "restaurant_id?",
    "type": "string"
  },
  {
    "column": "createdAt",
    "type": "date"
  },
  {
    "column": "updatedAt?",
    "type": "date"
  },
  {
    "column": "deletedAt?",
    "type": "date"
  }
]
    }

    public sanitize(data: any): UserFavoritesInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as UserFavoritesInterface;
            }
}