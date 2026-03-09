import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/index.js";
import { DATABASE_URL } from "../constant/app.constant.js";

const url = new URL(DATABASE_URL);
// console.log({ url, databaseName: url.pathname.substring(1) });

const adapter = new PrismaMariaDb({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1),
  port: url.port, // code mẫu trong doc không có port (LƯU Ý phải thêm port)
  connectionLimit: 5,
});
const prisma = new PrismaClient({
  adapter,
  omit: {
    users: {
      password: true,
    },
  },
});

try {
  await prisma.$queryRaw`SELECT 1+1 AS result`;
  console.log("✅ [PRISMA] Connection has been established successfully.");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error);
}

export { prisma };
