import { Injectable } from '@nestjs/common';
import { Room, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(): Promise<Room> {
    return await this.prismaService.room.create({
      data: {
        roomCode: await this.generateRoomCode(),
      },
    });
  }

  async createUser(username: string, isHost: boolean): Promise<User> {
    return await this.prismaService.user.create({
      data: {
        name: username,
        isHost: isHost,
      },
      include: { room: true },
    });
  }

  async findPlayers(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  private async generateRoomCode(): Promise<string> {
    const roomCode: string = randomBytes(2).toString('hex');
    const existingRoom: Room = await this.prismaService.room.findFirst({
      where: {
        roomCode: roomCode,
      },
    });
    if (existingRoom) {
      this.generateRoomCode();
    } else {
      return roomCode;
    }
  }
}
