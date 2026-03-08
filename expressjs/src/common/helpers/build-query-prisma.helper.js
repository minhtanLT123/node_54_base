export const buildQueryPrisma = (req) => {
    let { page, pageSize, filters } = req.query;

    const pageDefault = 1;
    const pageSizeDefault = 3;

    // ĐẢM BẢO LÀ SỐ
    page = Number(page);
    pageSize = Number(pageSize);

    // nếu gửi chữ
    page = Number(page) || pageDefault;
    pageSize = Number(pageSize) || pageSizeDefault;

    // nếu mà số âm
    if (page < 1) page = pageDefault;
    if (pageSize < 1) pageSize = pageSizeDefault;

    // xử lý index
    const index = (page - 1) * pageSize;

    // xử lý filters
    try {
        filters = JSON.parse(filters);
    } catch (error) {
        filters = {};
    }
    // tìm kiếm trong filter nếu giá trị nào là string thì bọc nó bằng 1 object có key là contains
    Object.entries(filters).forEach(([key, value]) => {
        // nếu lọc với string thì lồng vào 1 một object có key là contains
        if (typeof value === "string") {
            filters[key] = {
                contains: value,
            };
        }
    });

    console.log({ page, pageSize, index, filters });

    const where = {
        ...filters,
        isDeleted: false,
    };

    return {
        page,
        pageSize,
        index,
        where,
    };
};
