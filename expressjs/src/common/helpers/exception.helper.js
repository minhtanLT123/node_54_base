import { statusCodes } from "./status-code.helper.js";

export const errorCodes = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
};

// 400
export class BadRequestException extends Error {
  code = statusCodes.BAD_REQUEST;
  name = "BadRequestException";
  constructor(message = "BadRequestException") {
    super(message);
  }
}

// 401: quy định với FE là khi gặp thì logout
// 40001: quy định riêng với FE là khi gặp thì logout
export class UnauthorizedException extends Error {
  code = statusCodes.UNAUTHORIZED;
  errorCode = undefined;
  name = "UnauthorizedException";
  constructor(message = "UnauthorizedException", errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}

// 403: quy định với FE là khi gặp thì gọi api refresh-token
export class ForbiddenException extends Error {
  code = statusCodes.FORBIDDEN;
  errorCode = undefined;
  name = "ForbiddenException";
  constructor(message = "ForbiddenException", errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}

// 404
export class NotfoundException extends Error {
  code = statusCodes.NOT_FOUND;
  name = "NotfoundException";
  constructor(message = "NotfoundException") {
    super(message);
  }
}
