import { Response, Request, NextFunction } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { verify } from "../../module/_Auth/customJWT";
import {Utils} from "../../utils/utils";
import UserRoles from "../../utils/enums/userRoles";

function requireAdmin(req: Request, res: Response, next: NextFunction) {

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

  if (Object.keys(decoded).length > 0 && decoded?.role == UserRoles.ADMIN) {

    res.locals.currentUser = decoded;
    // @ts-ignore
    req.auth = decoded;


    return next();
  } else {
    console.log("The object is empty");
    throw new BadRequestError("You are not auhtenticated");
  }
}

export default requireAdmin;