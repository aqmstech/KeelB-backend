import crypto from "crypto";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { Application } from "../../app";
import {Utils} from "../../utils/utils";
import { Response, Request, NextFunction } from "express";

const ivLength = 16;

// length must be 16  characters long
const iv = crypto.randomBytes(ivLength);

export function encrypt(payload: any, options?: any) {
  const now = Math.floor(Date.now() / 1000); // get current time in seconds
  const expiresIn = now + 60 * 60 * 24; // 1 day
  const payloadWithExpiresIn = { payload, expiresIn, issuedAt: now };
  const cipher = crypto.createCipheriv(
    Application.conf.ENCRYPTION.algorithm,
    Application.conf.ENCRYPTION.salt,
    Application.conf.ENCRYPTION.iv
  );
  let encrypted = cipher.update(
    JSON.stringify(payloadWithExpiresIn),
    "utf8",
    "hex"
  );
  encrypted += cipher.final("hex");

  return iv.toString("hex") + encrypted;
}

export function decrypt(payload: any, options?: any) {
  let encrypted = payload.substring(32);

  const decipher = crypto.createDecipheriv(
    Application.conf.ENCRYPTION.algorithm,
    Application.conf.ENCRYPTION.salt,
    Application.conf.ENCRYPTION.iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  
  // decrypted += decipher.final("utf8");
  // console.log("decrypted => ", decrypted);
  // console.log(JSON.parse(decrypted), "decrypted");

  return JSON.parse(decrypted);
}

export function verify(token: string,res:Response) {
  try {
    const decrypted = decrypt(token);
    // console.log({ decrypted });
    const now = Math.floor(Date.now() / 1000); // get current time in seconds

    if (decrypted && decrypted.expiresIn) {
      if (now < decrypted.expiresIn) {
        return decrypted.payload;
      } else {
        const errorResponse = Utils.getResponse(false, "Token expired", {}, 401, 1010);
        return res.status(errorResponse.status_code).send(errorResponse.body);
        // throw new NotAuthorizedError("Token expired");
      }
    } else {
      return decrypted.payload;
    }
  } catch (error) {
    console.log({ error });
    const errorResponse = Utils.getResponse(false, "Invalid access token", {}, 401, 1010);
    return res.status(errorResponse.status_code).send(errorResponse.body);
    // throw new NotAuthorizedError("Invalid access token");
  }
}
