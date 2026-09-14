import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateRoomDto } from '../auth/dto/create-room.dto.js';
import { RoomService } from './room.service.js';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    username: string;
  };
};

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createOrGet(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateRoomDto,
  ) {
    return this.roomService.createOrGet(request.user.userId, dto);
  }

  @Get()
  getMyRooms(@Req() request: AuthenticatedRequest) {
    return this.roomService.getMyRooms(request.user.userId);
  }
}
