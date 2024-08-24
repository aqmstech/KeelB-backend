import {BaseModel} from "../../models/baseModel";
import { ReviewsInterface} from "./reviewsInterface";

export class ReviewsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('reviews', []);
        this.fillables = [
  {
    "column": "reviewer_name?",
    "type": "string"
  },
  {
    "column": "images?",
    "type": "array"
  },
  {
    "column": "description",
    "type": "string"
  },
  {
    "column": "rating",
    "type": "number"
  },
  {
    "column": "user_id?",
    "type": "string"
  },
  {
    "column": "restaurant_id?",
    "type": "string"
  },
  {
    "column": "status?",
    "type": "boolean"
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

    public sanitize(data: any): ReviewsInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as ReviewsInterface;
            }
}