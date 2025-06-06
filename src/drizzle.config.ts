import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schemas/*.ts",
    out: "./drizzle",
    dbCredentials: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || '',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        ssl: true
    },
});

// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//     dialect: "postgresql",
//     schema: "./db/schema.ts",
//     out: "./drizzle",
//     dbCredentials: {
//         host: "localhost",
//         port: 5432,
//         database: "synclydb",
//         user: "postgres",
//         password: "noufalrahim",
//         ssl: false,
//     },
// });
