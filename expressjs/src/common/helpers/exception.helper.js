import { statusCodes } from "./status-code.helper.js";

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
  name = "UnauthorizedException";
  constructor(message = "UnauthorizedException") {
    super(message);
  }
}

// 403: quy định với FE là khi gặp thì gọi api refresh-token
export class ForbiddenException extends Error {
  code = statusCodes.FORBIDDEN;
  name = "ForbiddenException";
  constructor(message = "ForbiddenException") {
    super(message);
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
