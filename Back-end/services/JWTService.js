import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

class JWTService {
  static sign(payload, expire = "60s", secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expire });
  }

  static verify(payload, secret = JWT_SECRET) {
    return jwt.verify(payload, secret);
  }
}
export default JWTService;
