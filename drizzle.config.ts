import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
	out: "./src/db",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.VITE_DATABASE_URL!,
	},
});
