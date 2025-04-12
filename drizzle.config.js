/** @type { import("drizzle-kit").Config} */
export default{
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url:'postgresql://neondb_owner:npg_baz6tPv9dQVU@ep-lucky-pine-a5kcee86-pooler.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
};