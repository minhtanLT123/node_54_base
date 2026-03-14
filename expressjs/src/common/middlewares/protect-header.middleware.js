import { tokenService } from "../../services/token.service.js";
import { UnauthorizedException } from "../helpers/exception.helper.js";
import { prisma } from "../prisma/conntect.prisma.js";

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new UnauthorizedException("Không có authorization");
  }

  const [type, token] = authorization.split(" ");
  if (type !== "Bearer") {
    throw new UnauthorizedException("Token không phải là Bearer");
  }
  if (!token) {
    throw new UnauthorizedException("Không có token");
  }

  const { userId } = tokenService.verifyAccessToken(token);

  const userExits = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExits) {
    throw new UnauthorizedException("Không tìm thấy user");
  }

  // console.log({ authorization, type, token, userId, userExits });

  req.user = userExits;

  next();
};
