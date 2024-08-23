import { pbkdf2Sync, randomBytes } from "crypto";

export function cryptoHash(
  password: string,
  salt?: number,
  iterations?: number
) {
  try {
    const Salt = (salt || 16).toString();
    const Iterations = iterations || 10000;
    return pbkdf2Sync(password, Salt, Iterations, 32, "sha256").toString("hex");
  } catch (error) {
    console.log(error);
  }
}
