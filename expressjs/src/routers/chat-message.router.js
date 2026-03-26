import express from "express";
import { chatMessageController } from "../controllers/chat-message.controller.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const chatMessageRouter = express.Router();

// Tạo route CRUD
chatMessageRouter.post("/", protect, chatMessageController.create);
chatMessageRouter.get("/", protect, chatMessageController.findAll);
chatMessageRouter.get("/:id", protect, chatMessageController.findOne);
chatMessageRouter.patch("/:id", protect, chatMessageController.update);
chatMessageRouter.delete("/:id", protect, chatMessageController.remove);

export default chatMessageRouter;
