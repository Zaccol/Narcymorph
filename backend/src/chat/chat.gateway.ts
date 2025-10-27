import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { userId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.chatService.sendMessage(data.userId, data.content);

      // Emit response back to client
      client.emit('messageReceived', result);

      return { success: true };
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('userTyping', data);
  }
}
