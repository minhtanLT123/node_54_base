import express from "express"
import articleRouter from "./article.router.js"
import authRouter from "./auth.router.js"

const rootRouter = express.Router()

rootRouter.use("/article", articleRouter)
rootRouter.use("/auth", authRouter)
export default rootRouter