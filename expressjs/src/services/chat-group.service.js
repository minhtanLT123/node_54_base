import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

export const chatGroupService = {
  async create(req) {
    return `This action create`;
  },

  async findAll(req) {
    // sequelize
    // const resultSequelize = await Article.findAll();

    const { index, page, pageSize, where } = buildQueryPrisma(req);

    const resultPrismaPromise = prisma.chatGroups.findMany({
      where: {
        // ...where,
        ChatGroupMembers: {
          some: {
            userId: req.user.id,
          },
        },
      },
      skip: index, // skip tương đương với OFFSET
      take: pageSize, // take tương đương với LIMIT
      include: {
        ChatGroupMembers: {
          include: {
            Users: true,
          },
        },
      },
    });
    const totalItemPromise = prisma.chatMessages.count({
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
    return `This action returns a id: ${req.params.id} chatGroup`;
  },

  async update(req) {
    return `This action updates a id: ${req.params.id} chatGroup`;
  },

  async remove(req) {
    return `This action removes a id: ${req.params.id} chatGroup`;
  },
};
