import path from "path";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";

cloudinary.config({
  // true là bắt buộc BE phải có domain https (có s)
  // false là dành cho dev dùng http (không có s)
  // secure: false,
  api_key: "518816194587136",
  api_secret: "_P6L11UI13ZCjly2uzf7UnuH0AE",
  cloud_name: "dlw01gfzk",

  // Không cần cung cấp vì ở file .env đã có CLOUDINARY_URL
  // cloudinary tự động đọc CLOUDINARY_URL
  // api_key: "",
  // api_secret: "",
  // cloud_name: "",
});

export const userService = {
  async findAll(req) {
    // sequelize
    // const resultSequelize = await Article.findAll();

    const { index, page, pageSize, where } = buildQueryPrisma(req);

    const resultPrismaPromise = prisma.users.findMany({
      where: where,
      skip: index, // skip tương đương với OFFSET
      take: pageSize, // take tương đương với LIMIT
    });
    const totalItemPromise = prisma.users.count({
      // ở findMany mà where cái gì thì đưa vào count giống như vậy
      where: where,
    });

    const [resultPrisma, totalItem] = await Promise.all([
      resultPrismaPromise,
      totalItemPromise,
    ]);

    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      totalItem: totalItem,
      totalPage: totalPage,
      page: page,
      pageSize: pageSize,
      items: resultPrisma,
    };
  },

  async findOne(req) {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });

    return user;
  },
  async avatarLocal(req) {
    // Logic to create a user

    if (!req.file) {
      throw new BadRequestException("thiếu file");
    }

    if (req.user.avatar) {
      const oldFilePath = path.join("public/images/", req.user.avatar);
      // console.log({ oldFilePath });
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      // xoá cloud
      cloudinary.uploader.destroy(req.user.avatar);
    }
    await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: req.file.filename,
      },
    });

    console.log({
      "req.file": req.file,
      "req.body": req.body,
      "req.user": req.user,
    });
    return `http://localhost:3069/images/${req.file.filename}`; // Example response
  },

  async avatarCloud(req) {
    if (!req.file) {
      throw new BadRequestException("thiếu file");
    }

    if (req.user.avatar) {
      const oldFilePath = path.join("public/images/", req.user.avatar);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      cloudinary.uploader.destroy(req.user.avatar);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "node_54" }, (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        })
        .end(req.file.buffer);
    });
    await prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: uploadResult.public_id,
      },
    });

    console.log({
      "req.file": req.file,
      "req.body": req.body,
      "req.user": req.user,
      uploadResult: uploadResult,
    });
    // Logic to create a user
    return uploadResult.secure_url;
  },
};
