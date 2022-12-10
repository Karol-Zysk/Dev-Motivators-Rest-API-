import { SigningKeyCallback } from "jsonwebtoken";

export interface CurrentUser extends SigningKeyCallback {
  iat: number;
  id: number;
}
