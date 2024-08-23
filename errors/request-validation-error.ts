import {ValidationError} from "express-validator";
import {CustomError} from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 422;

    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((err) => {
            let path: string = "";
            if (err.type == "field") {
                path = err.path;
            }
            return {message: err.msg, field: path};
        });
    }
}
