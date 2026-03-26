import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { UnauthorizedException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

export const chatGroupService = {
  async create(req) {
    return `This action create`;
  },

  async findAll(req) {
    const { index, page, pageSize, where } = buildQueryPrisma(req);
    const finalWhere = {
      ...where,
      ChatGroupMembers: {
        some: {
          userId: req.user.id,
          isDeleted: false,
        },
      },
    };

    const resultPrismaPromise = prisma.chatGroups.findMany({
      where: finalWhere,
      skip: index,
      take: pageSize,
      include: {
        ChatGroupMembers: {
          include: {
            Users: true,
          },
        },
        Users: true,
        ChatMessages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    const totalItemPromise = prisma.chatGroups.count({
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
      items: resultPrisma,
    };
  },
  async findOne(req) {
    const chatGroupId = Number(req.params.id);
    const chatGroup = await prisma.chatGroups.findUnique({
      where: {
        id: chatGroupId,
      },
      include: {
        ChatGroupMembers: {
          include: {
            Users: true,
          },
        },
        Users: true,
      },
    });

    const isMember = chatGroup?.ChatGroupMembers.some(
      (member) => member.userId === req.user.id,
    );
    if (!chatGroup || !isMember) {
      throw new UnauthorizedException("Bạn không thuộc phòng chat này");
    }

    return chatGroup;
  },

  async update(req) {
    return `This action updates a id: ${req.params.id} chatGroup`;
  },

  async remove(req) {
    return `This action removes a id: ${req.params.id} chatGroup`;
  },
};
