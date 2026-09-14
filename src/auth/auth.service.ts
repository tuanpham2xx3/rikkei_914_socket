import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma, User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email.toLowerCase() }],
      },
    });
    if (exists) throw new ConflictException('Username or email already exists');

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email.toLowerCase(),
          password: await bcrypt.hash(dto.password, 12),
        },
      });
      return this.toPublicUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
      }),
      user: this.toPublicUser(user),
    };
  }

  private toPublicUser(user: User) {
    return { id: user.id, username: user.username, email: user.email };
  }
}
