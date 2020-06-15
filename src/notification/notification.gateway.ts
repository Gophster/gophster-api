import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { AuthService } from './../auth/services/auth.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

import * as path from 'path';
import * as fs from 'fs';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer() notificaitonServer: Server;

  constructor(private authService: AuthService) {}

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
