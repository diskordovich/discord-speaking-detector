import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
    private readonly logger = new Logger(SocketService.name);
    public connectionList: Map<string, Socket[]> = new Map();

    constructor() {
        this.logger.log('SocketService constructor');
    }

    public addConnection(clientId: string, socket: Socket) {
        const connections = this.connectionList.get(clientId) || [];
        connections.push(socket);
        this.connectionList.set(clientId, connections);
    }

    public removeConnection(clientId: string, socket: Socket) {
        const connections = this.connectionList.get(clientId) || [];
        connections.splice(connections.indexOf(socket), 1);
        this.connectionList.set(clientId, connections);
    }   
}
