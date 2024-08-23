import { Response, Request, NextFunction } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { verify } from "../../module/_Auth/customJWT";
import {Utils} from "../../utils/utils";
import { AuthModel } from "../../module/_Auth/authModel"; // Adjust the import path according to your project structure
import { ObjectId } from "mongodb";

// Create an instance of AuthModel
const authModel = new AuthModel();

async function requireUser(req: Request, res: Response, next: NextFunction) {

  const accessToken = (
      req.headers?.authorization ||
      req.cookies?.accessToken ||
      ""
  ).replace(/^Bearer\s/, "");


  if (!accessToken){
    const errorResponse = Utils.getResponse(false, "Access token required", {}, 400, 1010);
    return res.status(errorResponse.status_code).send(errorResponse.body);
  }

  //if (!accessToken) throw new Error("Access token required");

  const decoded = verify(accessToken,res);


  if (Object.keys(decoded).length > 0) {

    try {
      // Find the user by the decoded information
      const user = await authModel.GetById(new ObjectId(decoded._id));

      if (!user) {
        const errorResponse = Utils.getResponse(false, "User not found", {}, 401, 1011);
        return res.status(errorResponse.status_code).send(errorResponse.body);
      }

      res.locals.currentUser = user;
      // @ts-ignore
      req.auth = user;

      return next();
    } catch (error) {
      console.error("Error finding user:", error);
      throw new BadRequestError("You are not authenticated");
    }
  } else {
    console.log("The object is empty");
    throw new BadRequestError("You are not auhtenticated");
  }
}

export default requireUser;