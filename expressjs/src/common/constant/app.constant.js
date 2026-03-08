import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;

console.log(
    "\n",
    {
        DATABASE_URL: DATABASE_URL,
    },
    "\n",
);
