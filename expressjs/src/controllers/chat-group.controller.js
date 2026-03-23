import { responseSuccess } from "../common/helpers/response.helper.js";
import { chatGroupService } from "../services/chat-group.service.js";

export const chatGroupController = {
  async create(req, res, next) {
    const result = await chatGroupService.create(req);
    const response = responseSuccess(result, `Create chatGroup successfully`);
    res.status(response.statusCode).json(response);
  },

  async findAll(req, res, next) {
    const result = await chatGroupService.findAll(req);
    const response = responseSuccess(result, `Get all chatGroup successfully`);
    res.status(response.statusCode).json(response);
  },

  async findOne(req, res, next) {
    const result = await chatGroupService.findOne(req);
    const response = responseSuccess(
      result,
      `Get chatGroup #${req.params.id} successfully`,
    );
    res.status(response.statusCode).json(response);
  },

  async update(req, res, next) {
    const result = await chatGroupService.update(req);
    const response = responseSuccess(
      result,
      `Update chatGroup #${req.params.id} successfully`,
    );
    res.status(response.statusCode).json(response);
  },

  async remove(req, res, next) {
    const result = await chatGroupService.remove(req);
    const response = responseSuccess(
      result,
      `Remove chatGroup #${req.params.id} successfully`,
    );
    res.status(response.statusCode).json(response);
  },
};
