import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsEnum(RoomType)
  type: RoomType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsMongoId({ each: true })
  memberIds: string[];
}
