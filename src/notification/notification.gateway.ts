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
    this.notificaitonServer.emit('auth', { name: 'test' });
  }

  handleConnection(client: Socket) {
    client.emit("connection",client.id)
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
