import { tokenService } from "../../services/token.service.js";
import { UnauthorizedException } from "../helpers/exception.helper.js";
import { prisma } from "../prisma/connect.prisma.js";

export const protect = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new UnauthorizedException("Không có token");
  }
  const decode = tokenService.verifyAccessToken(accessToken);
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
