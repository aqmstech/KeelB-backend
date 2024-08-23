import {BaseModel} from "../../models/baseModel";
import { VideosInterface} from "./videosInterface";
import {InternalServerError} from "../../errors/internal-server-error";

export class VideosModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('videos', []);
        this.fillables = [
  {
    "column": "category_id",
    "type": "string"
  },
  {
    "column": "title",
    "type": "string"
  },
  {
    "column": "thumbnail",
    "type": "string"
  },
  {
    "column": "url",
    "type": "string"
  },
  {
    "column": "duration",
    "type": "number"
  },
  {
    "column": "is_feature",
    "type": "boolean"
  },
  {
    "column": "status",
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
    "column": "deletedAt?",
    "type": "date"
  }
]
    }

    public sanitize(data: any): VideosInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as VideosInterface;
            }

    public async findAllAndUpdateByQuery(query: object,update:object) {
        try {
            console.log(query,"query")
            if (!this.collection) await this.INIT()
            const res = await this.collection.updateMany(query,update);
            return res;
        } catch (error) {
            console.log(error,"error")
            throw new InternalServerError();
        }
    }
}