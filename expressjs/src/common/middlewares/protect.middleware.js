import { tokenService } from "../../services/token.service.js";
import { UnauthorizedException } from "../helpers/exception.helper.js";
import { prisma } from "../prisma/connect.prisma.js";
export const protect = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new UnauthorizedException("Không có token");
  }
  const decode = tokenService.verityAccessToken(accessToken);
  const userExits = prisma.users.findUnique({
    where: {
      id: decode.userId,
    },
  });
  req.user = userExits;
  console.log("protect", { accessToken, decode });
  next();
};
