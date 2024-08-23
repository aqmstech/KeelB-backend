import { CustomError } from "./custom-error";

export class PermissionDeniedError extends CustomError {
  statusCode = 403;

  constructor(message: string) {
    super(message || "Permission Denied");

    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
