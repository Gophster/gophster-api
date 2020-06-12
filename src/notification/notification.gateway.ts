import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Client, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() notificaitonServer: Server;

  afterInit(server: any) {
    console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiinit');
  }

  handleConnection(client: Socket) {
    // client.emit('auth');
  }

  @SubscribeMessage('auth')
  handleMessage(client: any, payload: any) {
    console.log(payload);
  }
}
