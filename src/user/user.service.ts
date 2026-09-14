import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUserList() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
