import express from "express";
import { overtimeRequestController } from "../controllers/overtime-request.controller.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const overtimeRequestRouter = express.Router();

overtimeRequestRouter.get("/", protect, overtimeRequestController.findAll);
overtimeRequestRouter.post("/", protect, overtimeRequestController.create);

export default overtimeRequestRouter;
