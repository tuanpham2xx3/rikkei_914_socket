import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRoomDto } from '../auth/dto/create-room.dto.js';
import { RoomType } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrGet(currentUserId: string, dto: CreateRoomDto) {
    const memberIds = [...new Set([currentUserId, ...dto.memberIds])].sort();

    if (dto.type === RoomType.DIRECT && memberIds.length !== 2) {
      throw new BadRequestException('Phòng chat 1-1 phải có đúng 2 thành viên');
    }

    if (dto.type === RoomType.GROUP && memberIds.length < 3) {
      throw new BadRequestException(
        'Phòng chat nhóm phải có ít nhất 3 thành viên',
      );
    }

    if (dto.type === RoomType.GROUP && !dto.name?.trim()) {
      throw new BadRequestException('Phòng nhóm phải có tên');
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: memberIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== memberIds.length) {
      throw new NotFoundException('Có thành viên không tồn tại');
    }

    const conversationKey =
      dto.type === RoomType.DIRECT
        ? `dm:${memberIds.join(':')}`
        : `group:${randomUUID()}`;

    if (dto.type === RoomType.DIRECT) {
      return this.prisma.room.upsert({
        where: {
          conversationKey,
        },
        update: {},
        create: {
          type: dto.type,
          memberIds,
          createdById: currentUserId,
          conversationKey,
        },
      });
    }

    return this.prisma.room.create({
      data: {
        name: dto.name?.trim(),
        type: dto.type,
        memberIds,
        createdById: currentUserId,
        conversationKey,
      },
    });
  }

  getMyRooms(currentUserId: string) {
    return this.prisma.room.findMany({
      where: {
        memberIds: {
          has: currentUserId,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}
