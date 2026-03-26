import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import {
  BadRequestException,
  NotfoundException,
  UnauthorizedException,
} from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

export const chatMessageService = {
  async create(req) {
    const chatGroupId = Number(req.body.chatGroupId);
    const messageText = req.body.messageText?.trim();

    if (!chatGroupId || !messageText) {
      throw new BadRequestException("Thiếu chatGroupId hoặc messageText");
    }

    const membership = await prisma.chatGroupMembers.findFirst({
      where: {
        chatGroupId,
        userId: req.user.id,
      },
    });

    if (!membership) {
      throw new UnauthorizedException("Bạn không thuộc phòng chat này");
    }

    return prisma.chatMessages.create({
      data: {
        chatGroupId,
        userIdSender: req.user.id,
        messageText,
      },
    });
  },

  async findAll(req) {
    const { index, page, pageSize } = buildQueryPrisma(req);

    // Đọc chatGroupId từ query trực tiếp hoặc từ trong filters JSON
    const rawFilters = (() => {
      try {
        return JSON.parse(req.query.filters || "{}");
      } catch {
        return {};
      }
    })();
    const chatGroupId = Number(req.query.chatGroupId || rawFilters.chatGroupId);

    if (!chatGroupId) {
      throw new BadRequestException("Thiếu chatGroupId");
    }

    const membership = await prisma.chatGroupMembers.findFirst({
      where: {
        chatGroupId,
        userId: req.user.id,
      },
    });

    if (!membership) {
      throw new UnauthorizedException("Bạn không thuộc phòng chat này");
    }

    const finalWhere = {
      chatGroupId,
    };

    const resultPrismaPromise = prisma.chatMessages.findMany({
      where: finalWhere,
      skip: index, // skip tương đương với OFFSET
      take: pageSize, // take tương đương với LIMIT
      orderBy: {
        [req.query.sortBy || "createdAt"]:
          req.query.isDesc === "true" ? "desc" : "asc",
      },
    });
    const totalItemPromise = prisma.chatMessages.count({
      where: finalWhere,
    });

    const [resultPrisma, totalItem] = await Promise.all([
      resultPrismaPromise,
      totalItemPromise,
    ]);

    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      totalItem,
      totalPage,
      page,
      pageSize,
      // Map sang định dạng TAllmessage của frontend
      items: resultPrisma.map((msg) => ({
        messageText: msg.messageText,
        userIdSender: String(msg.userIdSender),
        chatGroupId: String(msg.chatGroupId),
        createdAt: msg.createdAt,
      })),
    };
  },

  async findOne(req) {
    const messageId = Number(req.params.id);
    const message = await prisma.chatMessages.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
      },
    });

    if (!message) {
      throw new NotfoundException("Không tìm thấy tin nhắn");
    }

    const membership = await prisma.chatGroupMembers.findFirst({
      where: {
        chatGroupId: message.chatGroupId,
        userId: req.user.id,
      },
    });

    if (!membership) {
      throw new UnauthorizedException("Bạn không thuộc phòng chat này");
    }

    return message;
  },

  async update(req) {
    return `This action updates a id: ${req.params.id} chatMessage`;
  },

  async remove(req) {
    return `This action removes a id: ${req.params.id} chatMessage`;
  },
};
