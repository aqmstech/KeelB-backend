import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../errors/custom-error";
import { Sentry } from "../../server/sentry";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    Sentry.Error(err, "Error resulted from API call");
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  Sentry.Error(err, "Error resulted from API call");
  res.status(400).send({
    errors: [{ message: err.message || "Something went wrong" }],
  });
};
