import express from "express";
import articleRouter from "./article.router.js";
import authRouter from "./auth.router.js";
import overtimeRequestRouter from "./overtime-request.router.js";
import userRouter from "./user.router.js";
import chatGroupRouter from "./chat-group.router.js";
import chatMessageRouter from "./chat-message.router.js";

const rootRouter = express.Router();

rootRouter.use("/article", articleRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/overtime-request", overtimeRequestRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/chat-group", chatGroupRouter);
rootRouter.use("/chat-message", chatMessageRouter);

export default rootRouter;
