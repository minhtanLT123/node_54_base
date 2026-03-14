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
    const response = responseSuccess(true, `login auths successfully`);
    res.cookie("accessToken", result.accessToken);
    res.cookie("refreshToken", result.refreshToken);

    res.status(response.statusCode).json(response);
  },

  async getInfo(req, res, next) {
    const result = await authService.getInfo(req);
    const response = responseSuccess(result, `getInfo auths successfully`);
    res.status(response.statusCode).json(response);
  },

  async refreshToken(req, res, next) {
    const result = await authService.refreshToken(req);
    const response = responseSuccess(true, `refreshToken auths successfully`);
    res.cookie("accessToken", result.accessToken);
    res.cookie("refreshToken", result.refreshToken);
    res.status(response.statusCode).json(response);
  },
  async googleCallback(req, res, next) {
    console.log(req.user);
    res.cookie("accessToken", result.accessToken);
    res.cookie("refreshToken", result.refreshToken);

    res.redirect("http://localhost:3000/login-callback");
  },
};
