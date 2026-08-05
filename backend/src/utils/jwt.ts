import jwt from "jsonwebtoken";
import { AuthPayload } from "../types";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "dev-secret-change-me";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  // jwt.verify's return type is generic `any` under the hood - we cast it
  // to our known shape here, in ONE controlled place, so `any` never leaks elsewhere.
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
