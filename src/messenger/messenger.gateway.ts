import { MessengerModule } from './messenger.module';
import { AuthService } from './../auth/services/auth.service';
import { Server } from 'socket.io';
import { MessengerService } from './messenger.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WsJwtGuard } from './messenger.guard';
import { UseGuards, Logger, forwardRef, Inject } from '@nestjs/common';
import { classToPlain } from 'class-transformer';

@WebSocketGateway({ namespace: 'message' })
export class MessengerGateway implements OnGatewayInit {
  @WebSocketServer() public messengerServer: Server;
  private readonly logger = new Logger(MessengerModule.name);

  constructor(
    @Inject(forwardRef(() => MessengerService))
    private messengerService: MessengerService,
    private authService: AuthService,
  ) {}

  afterInit() {
    this.logger.log('Messenger Gateway is initialized 💬');
  }

  @SubscribeMessage('auth')
  @UseGuards(WsJwtGuard)
  auth(client: any) {
    this.authService.setMessengerIdByHandle(client.user.handle, client.id);
  }

  @SubscribeMessage('message')
  @UseGuards(WsJwtGuard)
  async handleMessage(client: any, payload: any): Promise<any> {
    const message = await this.messengerService.createMessage(
      client.user,
      payload.to,
      payload.message,
    );

    return classToPlain(message);
  }
}
