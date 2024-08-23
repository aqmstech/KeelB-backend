import {BaseModel} from "../../models/baseModel";
import { ContactUsInterface} from "./contactusInterface";

export class ContactUsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('contactus', []);
        this.fillables = [
  {
    "column": "name",
    "type": "string"
  },
  {
    "column": "email",
    "type": "email"
  },
  {
    "column": "phone",
    "type": "string"
  },
  {
    "column": "message",
    "type": "text"
  },
  {
    "column": "createdAt",
    "type": "date"
  },
  {
    "column": "deletedAt?",
    "type": "date"
  }
]
    }

    public sanitize(data: any): ContactUsInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as ContactUsInterface;
            }
}