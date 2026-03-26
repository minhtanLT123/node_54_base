import express from "express";
import { chatGroupController } from "../controllers/chat-group.controller.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const chatGroupRouter = express.Router();

// Tạo route CRUD
chatGroupRouter.post("/", protect, chatGroupController.create);
chatGroupRouter.get("/", protect, chatGroupController.findAll);
chatGroupRouter.get("/:id", protect, chatGroupController.findOne);
chatGroupRouter.patch("/:id", protect, chatGroupController.update);
chatGroupRouter.delete("/:id", protect, chatGroupController.remove);

export default chatGroupRouter;
