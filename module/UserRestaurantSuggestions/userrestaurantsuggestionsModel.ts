import {BaseModel} from "../../models/baseModel";
import { UserRestaurantSuggestionsInterface} from "./userrestaurantsuggestionsInterface";

export class UserRestaurantSuggestionsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('userrestaurantsuggestions', []);
        this.fillables = [
  {
    "column": "name?",
    "type": "string"
  },
  {
    "column": "location?",
    "type": "object"
  },
  {
    "column": "address",
    "type": "string"
  },
  {
    "column": "phone",
    "type": "string"
  },
  {
    "column": "user_id?",
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

    public sanitize(data: any): UserRestaurantSuggestionsInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as UserRestaurantSuggestionsInterface;
            }
}