import { BaseModel } from "../../models/baseModel";
import { SecurityquestionsInterface } from "./securityquestionsInterface";

export class SecurityquestionsModel extends BaseModel {
  protected fillables: any = [];

  constructor() {
    super('security-questions', []);
    this.fillables = [
      {
        "column": "question",
        "type": "text"
      },
      {
        "column": "createdAt?",
        "type": "date"
      },
      {
        "column": "updatedAt?",
        "type": "date"
      }
    ]
  }

  public sanitize(data: any): SecurityquestionsInterface {
    const keys = Object.keys(data);
    const columns = this.fillables.map((column: any) => column.column);
    let newData: any = {}
    // Check if all the required keys are present in the data
    for (const key of columns) {
      if (keys.includes(key)) {
        newData[key] = data[key];
      }
    }

    return newData as SecurityquestionsInterface;
  }
}