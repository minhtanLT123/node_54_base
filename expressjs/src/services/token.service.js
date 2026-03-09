import jwt from "jsonwebtoken";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { ACCESS_TOKEN_SECRET } from "../common/constant/app.constant.js";
export const tokenService = {
  createAccessToken(userId) {
    if (!userId) {
      throw new BadRequestException("KHông có userId để tạo token");
    }
    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1D",
    });
    return accessToken;
  },
  verityAccessToken(accessToken, option) {
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, option);
    return decode;
  },
};
