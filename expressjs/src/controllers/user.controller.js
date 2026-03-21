import { responseSuccess } from "../common/helpers/response.helper.js";
import { userService } from "../services/user.service.js";

export const userController = {
  async findAll(req, res, next) {
    const result = await userService.findAll(req);
    const response = responseSuccess(result, `findAll user successfully`);
    res.status(response.statusCode).json(response);
  },

  async findOne(req, res, next) {
    const result = await userService.findOne(req);
    const response = responseSuccess(result, `findOne user successfully`);
    res.status(response.statusCode).json(response);
  },
  async avatarLocal(req, res, next) {
    const result = await userService.avatarLocal(req);
    const response = responseSuccess(result, `avatarLocal user successfully`);
    res.status(response.statusCode).json(response);
  },

  async avatarCloud(req, res, next) {
    const result = await userService.avatarCloud(req);
    const response = responseSuccess(result, `avatarCloud users successfully`);
    res.status(response.statusCode).json(response);
  },
};
