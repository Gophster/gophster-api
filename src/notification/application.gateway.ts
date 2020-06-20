import { AppModule } from '../app.module';
import { Message } from '../messenger/messenger.entity';

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { classToPlain } from 'class-transformer';

import { AuthService } from '../auth/services/auth.service';
import { User } from 'src/auth/entity/user.entity';
import { MessengerService } from '../messenger/messenger.service';
import { WsJwtGuard } from '../auth/services/wsjwt.guard';

@WebSocketGateway()
export class ApplicationGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private authService: AuthService,
    private messengerService: MessengerService,
  ) {}

  afterInit() {
    this.logger.log('Application Gateway is initialized  🚀');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(
      `Client with socket id: ${client.id} has been desiconected`,
    );
    await this.authService.removeSocketId(client.id);
  }

  @SubscribeMessage('auth')
  @UseGuards(WsJwtGuard)
  handleAuth(client: Socket & { user: User }) {
    this.authService.setSocketIdByHandle(client.user.handle, client.id);
  }

  @SubscribeMessage('message')
  @UseGuards(WsJwtGuard)
  async handleMessage(
    client: Socket & { user: User },
    payload: any,
  ): Promise<any> {
    const message = await this.messengerService.createMessage(
      client.user,
      payload.to,
      payload.message,
    );

    return classToPlain(message);
  }
}
