import { responseError } from "./response.helper.js";

export const appError = (err, req, res, next) => {
  console.log("mid đặc biệt bắt lỗi", err);

  // console.log({
  //     cause: err?.cause,
  //     message: err?.message,
  //     name: err?.name,
  //     stack: err?.stack,
  //     code: err?.code,
  // });
  const response = responseError(err?.message, err?.code, err?.stack);

  // console.log(response);
  res.status(response.statusCode).json(response);
};
