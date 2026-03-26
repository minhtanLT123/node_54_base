import { tokenService } from "../../services/token.service.js";
import {
  errorCodes,
  ForbiddenException,
  UnauthorizedException,
} from "../helpers/exception.helper.js";
import { prisma } from "../prisma/connect.prisma.js";

export const protect = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new UnauthorizedException("Không có token");
  }

  let decode;
  try {
    decode = tokenService.verifyAccessToken(accessToken);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 403: FE sẽ tự động gọi api refresh-token rồi retry lại request
      throw new ForbiddenException(
        "Token đã hết hạn",
        errorCodes.TOKEN_EXPIRED,
      );
    }
    throw new UnauthorizedException("Token không hợp lệ");
  }
  const userExits = await prisma.users.findUnique({
    where: {
      id: decode.userId,
    },
  });

  if (!userExits) {
    throw new UnauthorizedException("Người dùng không tồn tại");
  }

  req.user = userExits;
  // console.log("protect", { accessToken, decode, userExits });
  next();
};
