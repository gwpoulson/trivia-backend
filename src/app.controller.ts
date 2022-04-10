import { Controller, Get, Param } from '@nestjs/common';
import { Room, User } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('rooms')
  async getAllRooms(): Promise<Room[]> {
    return this.prismaService.room.findMany({
      include: { user: true },
    });
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany({
      include: { room: true },
    });
  }

  @Get('user/:name')
  async getUsersForRoom(@Param() params): Promise<boolean> {
    console.log(params);
    const user = await this.prismaService.user.findFirst({
      where: { name: params.name },
    });
    console.log(user);
    return user ? true : false;
  }
}
