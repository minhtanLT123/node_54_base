import express from "express";
import { appError } from "./src/common/helpers/app-error.helper.js";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logApi } from "./src/common/middlewares/log-api.middleware.js";
import { initLoginGooglePassport } from "./src/common/passport/login-google.passport.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/common/swagger/init.swagger.js";
import { initSocket } from "./src/common/socket/init-socket.js";

const app = express();

// xu ly cors bang tay
// app.use((req, res,next)=>{
//     console.log(req.headers);
//     res.setHeader("access-control-allow-methods","GET,HEAD,PUT,PATCH,DELETE,POST");
//     res.setHeader("access-control-allow-headers", "content-type");
//     res.setHeader("access-control-allow-origin","http://localhost:3000");

//     next();
// })

app.use(cors({ origin: ["http://localhost:3000", "google.com"] }));

// app.get("", (request, response, next) => {
//     response.json("Hello world");
// });
// để lấy được body (đảm bảo trước "/api")
app.use(express.json());

// để lấy cookie ( đảm bảo trước "/api")
app.use(cookieParser());
app.use(logApi("product"));
initLoginGooglePassport();
app.use(express.static("public"));

// swwagger
// http://localhost:3069/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", rootRouter);
app.use(appError);

//socket io
const httpServer = initSocket(app);

const PORT = 3069;
const server = httpServer.listen(PORT, () => {
  console.log(`Server online at port: ${PORT}`);
});
server.requestTimeout = 0;

// js Version cũ: common-js
// const express =  required("express")

// ES6: phiên bản nâng cấp rất rất nhiều của js

// js Version mới: es-module
// import express from "express"

// npx prisma db pull: kéo database vào code và tạo ra model
// npx prisma generate: tạo ra object CLIENT để sử dụng trong code (để dev)

// EXPRESSS verssion <5: phải bắt try/catch trong controller
