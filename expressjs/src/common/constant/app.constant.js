import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

console.log(
  "\n",
  {
    DATABASE_URL: DATABASE_URL,
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  },
  "\n",
);
