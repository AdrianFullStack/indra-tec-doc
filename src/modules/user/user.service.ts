import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                password: true
            }
        });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                lastname: true,
                email: true,
                active: true,
                createdAt: true
            }
        });
    }
}