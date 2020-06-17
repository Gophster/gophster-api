import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Logger } from '@nestjs/common';

import { NotificationModule } from './notification.module';
import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { AuthService } from './../auth/services/auth.service';

import * as path from 'path';
import * as fs from 'fs';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() public notificaitonServer: Server;
  private readonly logger = new Logger(NotificationModule.name);

  constructor(private authService: AuthService) {}

  afterInit() {
    this.logger.log('Notification Gateway is initialized  🚀');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client with socket id: ${client.id} has been desiconected`)
    await this.authService.removeSocketId(client.id);
  }

  @SubscribeMessage('auth')
  handleMessage(client: Socket, payload: any) {
    const { token } = payload;
    try {
      const result = jwt.verify(
        token,
        fs.readFileSync(path.join(process.cwd(), 'credentials/pub.pem')),
        {
          algorithms: ['RS256'],
        },
      );

      if (typeof result === 'object') {
        const jwtPayload = result as JwtPayload;
        this.authService.setSocketIdByHandle(jwtPayload.handle, client.id);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
