import { responseSuccess } from "../common/helpers/response.helper.js";
import { artcileService } from "../services/article.service.js";

export const articleController = {
  async findAll(req, res, next) {
    const result = await artcileService.findAll(req);
    const response = responseSuccess(
      result,
      "Lấy danh sách artcile thành công",
      201,
    );
    res.status(response.statusCode).json(response);
  },
  async create(req, res, next) {
    const result = await artcileService.create(req);
    const response = responseSuccess(result, "Tạo artcile thành công");
    res.status(response.statusCode).json(response);
  },
  async update(req, res, next) {
    const result = await artcileService.update(req);
    const response = responseSuccess(result, "Cập nhật artcile thành công");
    res.status(response.statusCode).json(response);
  },
  async delete(req, res, next) {
    const result = await artcileService.delete(req);
    const response = responseSuccess(result, "Xoá artcile thành công");
    res.status(response.statusCode).json(response);
  },
};
