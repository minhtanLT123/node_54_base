export const article = {
  "/article": {
    get: {
      tags: ["Article"],
      summary: "Returns a list of article.",
      description: "Optional extended description in CommonMark or HTML.",
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            example: "1",
          },
        },
        {
          in: "query",
          name: "pageSize",
          schema: {
            type: "integer",
            example: "3",
          },
        },
      ],
      responses: {
        200: {
          description: "ok",
        },
      },
    },
  },
  "/article/{id}": {
    get: {
      tags: ["Article"],
      summary: "Returns a list of article.",
      description: "Optional extended description in CommonMark or HTML.",
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            type: "integer",
            example: "1",
          },
        },
      ],
      responses: {
        200: {
          description: "ok",
        },
      },
    },
  },
};
