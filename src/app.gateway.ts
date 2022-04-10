import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Question, Room, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@WebSocketGateway({ cors: true })
export class AppGateway {
  constructor(private readonly prismaService: PrismaService, private readonly appService: AppService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody('username') username: string, @MessageBody('roomCode') roomCode: string) {
    await this.appService.createUser(username, false);

    const playersInRoom: User[] = await this.appService.findPlayers();

    this.server.emit('newPlayer', playersInRoom);
  }

  @SubscribeMessage('players')
  async sendPlayersToRoom() {
    const playersInRoom: User[] = await this.appService.findPlayers();
    this.server.emit('newPlayer', playersInRoom);
  }

  @SubscribeMessage('startGame')
  async startGame() {
    const questions: Question[] = await this.prismaService.question.findMany();

    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    this.server.emit('gameStarted', questions.slice(0, 10));
  }

  @SubscribeMessage('clearUsers')
  async clearUsers() {
    await this.prismaService.user.deleteMany();
  }

  @SubscribeMessage('submitAnswer')
  async submitAnswer(
    @MessageBody('answer') answer: string,
    @MessageBody('isCorrect') isCorrect: boolean,
    @MessageBody('user') user: User,
  ) {
    console.log(user);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        currentAnswer: answer,
        score: {
          increment: isCorrect ? 10 : 0,
        },
      },
    });
    const players = await this.prismaService.user.findMany();
    this.server.emit('newPlayer', players);
  }

  @SubscribeMessage('nextQuestion')
  async nextQuestion() {
    await this.prismaService.user.updateMany({
      data: {
        currentAnswer: null
      }
    })
    this.server.emit('sendNextQuestion');
  }
}
