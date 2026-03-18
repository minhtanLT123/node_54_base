import { responseSuccess } from "../common/helpers/response.helper.js";
import { overtimeRequestService } from "../services/overtime-request.service.js";

export const overtimeRequestController = {
  async create(req, res, next) {
    const result = await overtimeRequestService.create(req);
    const response = responseSuccess(result, "Tạo yêu cầu tăng ca thành công");
    res.status(response.statusCode).json(response);
  },
};
