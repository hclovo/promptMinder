import { type Config } from "drizzle-kit";

// 引入lib下的env.ts
import { env } from "./lib/env";

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["*"],
} satisfies Config;
