import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(username: string, password: string): string {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }
}
