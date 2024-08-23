import { BaseModel } from "../../models/baseModel";
import { FaqsInterface } from "./faqsInterface";

export class FaqsModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('faqs', []);
    this.fillables = [
      {
        "column": "question",
        "type": "text"
      },
      {
        "column": "answer",
        "type": "text"
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

  public sanitize(data: any): FaqsInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as FaqsInterface;
  }
}