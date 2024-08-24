import {BaseModel} from "../../models/baseModel";
import { RecentSearchesInterface} from "./recentsearchesInterface";

export class RecentSearchesModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('recentsearches', []);
        this.fillables = [
  {
    "column": "user_id",
    "type": "string"
  },
  {
    "column": "keyword",
    "type": "string"
  },
  {
    "column": "module?",
    "type": "enum"
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

    public sanitize(data: any): RecentSearchesInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as RecentSearchesInterface;
            }
}