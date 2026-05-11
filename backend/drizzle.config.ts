import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'mysql',
    schema: './src/db/schema.ts',
    dbCredentials: {
        url: process.env.MYSQL_URL!,
    },
});
