import { Request } from "express";
import { AuthPayload } from "../dto";

export interface UserAuthRequest extends Request {
  user?: AuthPayload;
}
