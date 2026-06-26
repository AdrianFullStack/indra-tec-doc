import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    port: parseInt(process.env.APP_PORT ?? '3000'),
    baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    env: process.env.NODE_ENV ?? 'dev',
    databaseUrl: process.env.DATABASE_URL ?? ''
}));