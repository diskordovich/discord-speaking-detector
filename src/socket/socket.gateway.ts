import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io';

@WebSocketGateway(6969)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketService: SocketService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client: Socket) {
    const roomId = client.handshake.headers.roomid as string;
    if(roomId) {
      this.socketService.addConnection(roomId, client);
    }
    else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const roomId = client.handshake.headers.roomid as string;
    if(roomId) {
      this.socketService.removeConnection(roomId, client);
    }
  }
}
