import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  statusCode = 500;

  constructor() {
    super("Internal Server Error");

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
