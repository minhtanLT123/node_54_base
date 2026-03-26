import { responseSuccess } from "../common/helpers/response.helper.js";
import { overtimeRequestService } from "../services/overtime-request.service.js";

export const overtimeRequestController = {
  async create(req, res, next) {
    const result = await overtimeRequestService.create(req);
    const response = responseSuccess(result, "Tạo yêu cầu tăng ca thành công");
    res.status(response.statusCode).json(response);
  },

  async findAll(req, res, next) {
    const result = await overtimeRequestService.findAll(req);
    const response = responseSuccess(
      result,
      "Lấy danh sách yêu cầu tăng ca thành công",
    );
    res.status(response.statusCode).json(response);
  },
};
