import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import sequelize from "../common/sequelize/connect.sequelize.js";
import Article from "../models/article.model.js";

// 4 nơi nhận dữ liệu từ FE gửi
// BODY
// PARAMS
// QUERY
// HEADERS

export const artcileService = {
    // QUERY:
    // Thường dùng: phân trang, lọc. tìm kiếm...
    async findAll(req) {
        // sequelize
        // const resultSequelize = await Article.findAll();

        const { index, page, pageSize, where } = buildQueryPrisma(req);

        const resultPrismaPromise = prisma.articles.findMany({
            where: where,
            skip: index, // skip tương đương với OFFSET
            take: pageSize, // take tương đương với LIMIT
        });
        const totalItemPromise = prisma.articles.count({
            // ở findMany mà where cái gì thì đưa vào count giống như vậy
            where: where,
        });

        const [resultPrisma, totalItem] = await Promise.all([resultPrismaPromise, totalItemPromise]);

        const totalPage = Math.ceil(totalItem / pageSize);

        return {
            totalItem: totalItem,
            totalPage: totalPage,
            page: page,
            pageSize: pageSize,
            items: resultPrisma,
        };
    },

    // Body
    // để nhận được body phải thiết lập middleware json ở server.js
    // app.use(express.json())
    async create(req) {
        const body = req.body;

        console.log({ body });

        const articleNew = await prisma.articles.create({
            data: {
                title: body.title,
                content: body.content,
                userId: 1,
            },
        });

        return true;
    },
    // PARAMSMETER
    // Thường dùng để gửi id, lấy detail, update, delete
    async update(req) {
        const { articleId } = req.params;
        const body = req.body;

        const articleUpdate = await prisma.articles.update({
            where: {
                id: Number(articleId),
            },
            data: {
                title: body.title,
                content: body.content,
            },
        });

        console.log({ articleId, body });

        return true;
    },
    async delete(req) {
        const { articleId } = req.params;

        // delete thật trong DB: không nên saif
        // await prisma.articles.delete({
        //     where: {
        //         id: articleId,
        //     },
        // });

        await prisma.articles.update({
            where: {
                id: +articleId,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: 1,
            },
        });

        return true;
    },
};
