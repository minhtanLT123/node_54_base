import express from "express";
import { articleController } from "../controllers/article.controller.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import { BadRequestException, NotfoundException } from "../common/helpers/exception.helper.js";

const articleRouter = express.Router();

// READ
articleRouter.get(
    "",
    (req, res, next) => {
        console.log("mid 1");

        const payload = "dữ liệu của mid 1";

        req.payload = payload;

        if (false) {
            const response = responseSuccess(null, "Người dùng này không hợp lệ", 401);
            res.status(response.statusCode).json(response);
        } else {
            next();
        }
    },
    (req, res, next) => {
        console.log("mid 2");
        console.log(req.payload);
        // (new Error).

        // const err = new Error("lỗi rồi");
        // throw new NotfoundException("Password không tìm thấy ");
        // console.log("mid err", err);
        // throw err;
        next();
    },
    (req, _, next) => {
        console.log("mid 3");
        console.log(req.payload);
        next();
    },

    articleController.findAll,
);
// CREATE
articleRouter.post("/", articleController.create)
// UPDATE (patch/put)
articleRouter.put("/:articleId", articleController.update)
// DELETE
articleRouter.delete("/:articleId", articleController.delete)

export default articleRouter;
