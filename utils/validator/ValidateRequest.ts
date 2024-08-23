import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    value?: any;
  }
}

export function validateRequestBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (result.error) {
      const errorDetails = result.error.details.map((error) => ({
        key: error.context?.key,
        message: error.message.replace(/"/g, ''),
      }));
      const missingKeys = result.error.details.map(error => error.context?.key);
      return res.status(400).json({
        status:false,
        message:`Missing required keys: ${missingKeys.join(', ')}`,
        data:{
          errors: errorDetails,
        }

      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
}

export function validateRequestParams(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.query, {
      abortEarly: false,
    });
    if (result.error) {
      const errorDetails = result.error.details.map((error) => ({
        key: error.context?.key,
        message: error.message.replace(/"/g, ''),
      }));
      const missingKeys = result.error.details.map(error => error.message.replace(/"/g, ''));
      return res.status(400).json({
        status:false,
        message:`Error: ${missingKeys.join(', ')}`,
        data:{
          errors: errorDetails,
        }

      });

    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
}
