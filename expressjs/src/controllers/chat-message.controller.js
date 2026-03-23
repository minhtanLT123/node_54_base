import { responseSuccess } from "../common/helpers/response.helper.js";
import { chatMessageService } from "../services/chat-message.service.js";

export const chatMessageController = {
  async create(req, res, next) {
    try {
      const result = await chatMessageService.create(req);
      const response = responseSuccess(
        result,
        `Create chatMessage successfully`,
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  async findAll(req, res, next) {
    try {
      const result = await chatMessageService.findAll(req);
      const response = responseSuccess(
        result,
        `Get all chatMessages successfully`,
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  async findOne(req, res, next) {
    try {
      const result = await chatMessageService.findOne(req);
      const response = responseSuccess(
        result,
        `Get chatMessage #${req.params.id} successfully`,
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await chatMessageService.update(req);
      const response = responseSuccess(
        result,
        `Update chatMessage #${req.params.id} successfully`,
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await chatMessageService.remove(req);
      const response = responseSuccess(
        result,
        `Remove chatMessage #${req.params.id} successfully`,
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
};
