import jwt from "jsonwebtoken";
import config from '../config/config';
const generateToken = async (data: any): Promise<string> => {
  return jwt.sign({ data }, config.ACCESS_TOKEN_SECRET || "token_secret", { expiresIn: "1d" });
};
export default generateToken;