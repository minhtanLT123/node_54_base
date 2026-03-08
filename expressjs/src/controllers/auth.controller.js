import { responseSuccess } from "../common/helpers/response.helper.js";
import { authService } from "../services/auth.service.js";

export const authController = {
   async register(req, res, next) {
      const result = await authService.register(req);
      const response = responseSuccess(result, `register auth successfully`);
      res.status(response.statusCode).json(response);
   },

   async login(req, res, next) {
      const result = await authService.login(req);
      const response = responseSuccess(result, `login auths successfully`);
      res.status(response.statusCode).json(response);
   },
};