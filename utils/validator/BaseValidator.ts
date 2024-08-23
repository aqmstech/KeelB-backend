import {JoiSchemas} from "./joiSchemas";

export interface ValidationError {
    errored: boolean;
    errors: string[] | null;
    value: any;
}

export class BaseValidator extends JoiSchemas {
    protected ValidateAdd(data: any, schema: any): ValidationError {
        let result = schema.validate(data, {abortEarly: false});
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return {errored: false, errors: null, value: result.value};
    }

    protected ValidateUpdate(data: any, schema: any): ValidationError {
        let result = schema.validate(data, {abortEarly: false});
        if (result.error)
            return {
                errored: true,
                errors: result.error.message.split('.'),
                value: result.value,
            };
        else return {errored: false, errors: null, value: result.value};
    }
}
