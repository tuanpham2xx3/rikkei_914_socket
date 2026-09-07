import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getUserList(): any {
    return this.userService.getUserList();
  }
}
