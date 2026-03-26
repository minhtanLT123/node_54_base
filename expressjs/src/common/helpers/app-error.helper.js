import { responseError } from "./response.helper.js";
import jwt from "jsonwebtoken";
import { statusCodes } from "./status-code.helper.js";

export const appError = (err, req, res, next) => {
  console.log("mid đặc biệt bắt lỗi", err);
  if (err instanceof jwt.TokenExpiredError) {
    // class TokenExpiredError chỉ bắt lỗi HẾT HẠN liên quan tới token
    err.code = statusCodes.FORBIDDEN; // 403: FE sẽ gọi api refresh-token
    err.errorCode = "TOKEN_EXPIRED";
  }

  // console.log({
  //     cause: err?.cause,
  //     message: err?.message,
  //     name: err?.name,
  //     stack: err?.stack,
  //     code: err?.code,
  // });
  const response = responseError(
    err?.message,
    err?.code,
    err?.stack,
    err?.errorCode,
  );

  // console.log(response);
  res.status(response.statusCode).json(response);
};
