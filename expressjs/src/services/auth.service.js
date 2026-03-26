import {
  BadRequestException,
  UnauthorizedException,
} from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service.js";

export const authService = {
  async register(req) {
    // nhận dữ liệu từ FE gửi lên
    const { email, password, fullname, fullName } = req.body;
    const normalizedEmail = email?.trim()?.toLowerCase();
    const normalizedFullName = fullName?.trim() || fullname?.trim();

    if (!normalizedEmail || !password || !normalizedFullName) {
      throw new BadRequestException("Vui lòng nhập đầy đủ email, mật khẩu và họ tên");
    }

    // kiểm tra email có tồn tại trong db hay không
    const userExits = await prisma.users.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    if (userExits) {
      throw new BadRequestException(
        "Người dùng đã tồn tại, vui lòng đăng nhập",
      );
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
        email: normalizedEmail,
        password: passwordHash,
        fullName: normalizedFullName,
      },
    });
    // console.log({ email, password, fullname, userExits, newUser });
    return true;
  },
  // kiểm tra email xem có tồn tại chưa
  // nếu chua tồn tại => kêu người dùng đăng ký
  // nếu mà tồn tại rồi => đi xử lý tiếp

  async login(req) {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim()?.toLowerCase();

    if (!normalizedEmail || !password) {
      throw new BadRequestException("Vui lòng nhập email và mật khẩu");
    }

    const userExits = await prisma.users.findUnique({
      where: {
        email: normalizedEmail,
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
    const refreshToken = tokenService.createRefreshToken(userExits.id);

    // console.log({ email, password, userExits, isPassword });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: userExits.id,
        email: userExits.email,
        fullName: userExits.fullName,
        avatar: userExits.avatar,
      },
    };
  },

  async getInfo(req) {
    // console.log("getInfo service", req.user);

    return req.user;
  },

  async refreshToken(req) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
      throw new UnauthorizedException("Không có accessToken để kiểm tra");
    }

    if (!refreshToken) {
      throw new UnauthorizedException("Không có refreshToken để kiểm tra");
    }

    // tại vì accessToken đang bị hết hạn, FE đang muốn làm mới
    // cho nên không được kiểm tra hạn của accessToken { ignoreExpiration: true }
    const decodeAccessToken = tokenService.verifyAccessToken(accessToken, {
      ignoreExpiration: true,
    });
    const decodeRefreshToken = tokenService.verifyRefreshToken(refreshToken);

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new UnauthorizedException("Token không hợp lệ..");
    }

    const userExits = await prisma.users.findUnique({
      where: {
        id: decodeAccessToken.userId,
      },
    });

    // console.log({ accessToken, refreshToken });
    const accessTokenNew = tokenService.createAccessToken(userExits.id);
    const refreshTokenNew = tokenService.createRefreshToken(userExits.id);
    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
    };
  },
};
