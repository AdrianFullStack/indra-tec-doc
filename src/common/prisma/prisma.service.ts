import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor(configService: ConfigService) {
        const connectionString = configService.getOrThrow('app.databaseUrl');
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        super({ adapter });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to PostgreSQL');
        } catch (error) {
            this.logger.error('Error connecting to database:', error);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
