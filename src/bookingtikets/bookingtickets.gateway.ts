import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, WebSocketGateway } from "@nestjs/websockets";
import { SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { BookingtiketsService } from './bookingtikets.service';
import { Seat } from './entities/bookingtiket.entity';
@WebSocketGateway({
    cors: {
        origin: '*'
    }

})
export class MyGateWay implements OnModuleInit {
    constructor(private bookingtiketsService: BookingtiketsService) { }
    @WebSocketServer()
    server: Server
    onModuleInit() {
    }

    @SubscribeMessage('booking')
    async onBooking(@MessageBody() body: Seat) {
        const data = await this.bookingtiketsService.choosingSeats(body)
        this.server.to(body.room).emit('onBooking', data)

        return data
    }
    @SubscribeMessage('join-room')
    room(@MessageBody() room, @ConnectedSocket() client: Socket) {
        client.rooms.forEach(item => client.leave(item))
        client.join(room)
    }
}            