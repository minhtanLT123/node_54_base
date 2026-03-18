import express from "express";
import articleRouter from "./article.router.js";
import authRouter from "./auth.router.js";
import overtimeRequestRouter from "./overtime-request.router.js";
import userRouter from "./user.router.js";

const rootRouter = express.Router();

rootRouter.use("/article", articleRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/overtime-request", overtimeRequestRouter);
rootRouter.use("/user", userRouter);

export default rootRouter;
