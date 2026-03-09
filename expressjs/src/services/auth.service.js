import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service.js";

export const authService = {
  async register(req) {
    // nhan du lieu tu FE gui len
    const { email, password, fullname } = req.body;

    // kiem tra email co ton tai trong db hay khong
    const userExits = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (userExits) {
      throw new BadRequestException("nguo dung da ton tai");
    }
    // hash: băm => bcrypt
    // không thể dịch ngược
    // chỉ so sánh

    // encryption: mã hóa
    // có thể dịch ngược
    const passwordHash = bcrypt.hashSync(password, 10);

    // tao moi nguoi dung vao db
    const newUser = await prisma.users.create({
      data: {
        email: email,
        password: passwordHash,
        fullName: fullname,
      },
    });
    console.log({ email, password, fullname, userExits, newUser });
    return true;
  },
  // kiểm tra email xem có tồn tại chưa
  // nếu chua tồn tại => kêu người dùng đăng ký
  // nếu mà tồn tại rồi => đi xử lý tiếp

  async login(req) {
    const { email, password } = req.body;
    const userExits = await prisma.users.findUnique({
      where: {
        email: email,
      },
      omit: {
        password: false,
      },
    });
    if (!userExits) {
      throw new BadRequestException(
        "người dùng chưa tồn tại, vui lòng đăng ký!",
      );
    }

    const isPassword = bcrypt.compareSync(password, userExits.password); // true
    if (!isPassword) {
      // throw new BadRequestException("Account Invalid..");
      throw new BadRequestException("Mật khẩu khống chính xác");
    }
    const accessToken = tokenService.createAccessToken(userExits.id);

    console.log({ email, password, userExits, isPassword });
    return {
      accessToken: accessToken,
      refreshToken: "refreshToken",
    };
  },

  async getInfo(req) {
    console.log("getInfo service", req.user);

    return req.user;
  },
};
